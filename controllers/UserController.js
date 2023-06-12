// library
const bcrypt = require('bcrypt')
// model
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')

const { validateMongodbId } = require('../utils/validateMongodbId')

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

  // [GET] /user/wishlist
  async getWishlist(req, res) {
    const { _id } = req.user
    try {
      const findUser = await User.findById(_id).populate('wishlist')
      res.json(findUser)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /user/cart
  async getUserCart(req, res) {
    const { _id } = req.user
    validateMongodbId(_id)
    try {
      const cart = await Cart.find({ orderby: _id }).populate(
        'products.product'
      )
      res.json(cart)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /user/cart
  async userCart(req, res) {
    const { cart } = req.body
    const { _id } = req.user
    validateMongodbId(_id)
    try {
      let products = []
      const user = await User.findById(_id)
      // check if user already have product in cart
      const alreadyExistCart = await Cart.findOne({ orderby: user._id })
      // if (alreadyExistCart) {
      //   alreadyExistCart.remove()
      // }
      for (let i = 0; i < cart.length; i++) {
        let object = {}
        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color
        let getPrice = await Product.findById(cart[i]._id)
          .select('price')
          .exec()
        object.price = getPrice.price
        await products.push(object)
      }
      // let cartTotal = 0
      // for (let i = 0; i < products.length; i++) {
      //   cartTotal = cartTotal + products[i].price * products[i].count
      // }
      let cartTotal = products.reduce((curr, product) => {
        product.price * product.count + curr
      }, 0)
      let newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?._id,
      }).save()
      res.json(newCart)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /user/save-address
  async saveAddress(req, res) {
    const { _id } = req.user
    validateMongodbId(_id)

    try {
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          address: req?.body?.address,
        },
        {
          new: true,
        }
      )
      res.json(updatedUser)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /user/update
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
