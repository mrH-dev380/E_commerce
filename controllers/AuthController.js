const { generateToken } = require('../config/jwToken')
const generateRefreshToken = require('../config/refreshToken')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

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
        maxAge: 60 * 60 * 24 * 1000,
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
