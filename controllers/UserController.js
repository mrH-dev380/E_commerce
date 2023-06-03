const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const validateMongodbId = require('../utils/validateMongodbId')

class UserController {
  // [GET] /user/all-user
  async getAllUser(req, res) {
    try {
      const getUsers = await User.find()
      res.status(200).json(getUsers)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /user/:id
  async getUser(req, res) {
    const { id } = req.params
    validateMongodbId(id)
    try {
      const findUser = await User.findById(id)
      res.status(200).json(findUser)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /user/:id
  async updateUser(req, res) {
    const { _id } = req.user
    const { password } = req.body
    validateMongodbId(_id)
    try {
      if (password) {
        const salt = await bcrypt.genSaltSync(10)
        req.body.password = await bcrypt.hashSync(password, salt)
      }
      const updateUser = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
      })
      res.status(200).json(updateUser)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /user/:id
  async deleteUser(req, res) {
    const { id } = req.params
    try {
      const deleteUser = await User.findByIdAndDelete(id)
      res.status(200).json(deleteUser)
    } catch (error) {
      throw new Error(error)
    }
  }

  async blockUser(req, res) {
    const { id } = req.params

    try {
      const blockUser = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: true,
        },
        {
          new: true,
        }
      )
      res.status(200).json({ message: 'User Blocked' })
    } catch (error) {
      throw new Error(error)
    }
  }

  async unblockUser(req, res) {
    const { id } = req.params

    try {
      const unblock = await User.findByIdAndUpdate(
        id,
        {
          isBlocked: false,
        },
        {
          new: true,
        }
      )
      res.status(200).json({ message: 'User UnBlocked' })
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UserController()
