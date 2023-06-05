const { generateToken } = require('../config/jwToken')
const generateRefreshToken = require('../config/refreshToken')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const crypto = require('crypto')
const User = require('../models/userModel')
const EmailController = require('./EmailController')

class AuthController {
  // [POST] /auth/register
  async register(req, res) {
    const { email } = req.body
    const findUser = await User.findOne({ email })
    const newUser = await new User(req.body)

    try {
      if (!findUser) {
        // Create a new user
        const user = await newUser.save()
        res.status(200).json({ user })
      } else {
        throw new Error('Email Already Exists')
      }
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  // [POST] /auth/login
  async login(req, res) {
    const { email, password } = req.body
    const findUser = await User.findOne({ email })
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id)
      const updateuser = await User.findByIdAndUpdate(
        findUser._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      )
      res.status(200).cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000, // 1 day
      })
      res.status(200).json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobilename: findUser?.mobilename,
        token: generateToken(findUser?._id),
      })
    } else {
      throw new Error('Invalid Credentials')
    }
  }

  // [POST] /auth/forget-password
  async forgetPassword(req, res) {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error("Email doesn't exist")
    try {
      const token = await user.createResetPasswordToken()
      await user.save()
      const resetURL = `Please follow this link to reset Your Password. This link valid 10 minutes till now. <a href='http://localhost:3000/auth/reset-password/${token}'>Click Here</>`
      const data = {
        to: email,
        subject: 'Reset Password',
        text: `This mail valid in 10 minutes. Please reset your password`,
        html: resetURL,
      }
      asyncHandler(EmailController.sendEmail(data))
      res.status(200).json(token)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /auth/reset-password/:id
  async resetPassword(req, res) {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })
    if (!user) throw new Error(' Token Expired, Please try again later')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.status(200).json(user)
  }

  // [GET] /auth/refresh-token
  async refreshToken(req, res) {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error('No Refresh Token in db or not matched')
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error('Some thing wrong with refresh token')
      }
      const accessToken = generateToken(user?.id)
      res.status(200).json({ accessToken })
    })
  }

  // [GET] /auth/logout
  async logout(req, res) {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
    const refreshToken = cookie.refreshToken
    console.log(refreshToken)
    const user = await User.findOne({ refreshToken })
    if (!user) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
      })
      return res.status(403).json('Action forbidden')
    }
    await User.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: '',
      }
    )
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    })
    res.status(200).json('Log Out Successfully!')
  }
}

module.exports = new AuthController()
