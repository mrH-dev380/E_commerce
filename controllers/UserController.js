// library
const bcrypt = require('bcrypt')
const uniqid = require('uniqid')
// model
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')

const { validateMongoDbId } = require('../utils/validateMongoDbId')

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
    validateMongoDbId(id)
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
    validateMongoDbId(_id)
    try {
      const cart = await Cart.find({ orderby: _id }).populate(
        'products.product'
      )
      res.json(cart)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /user/order/:id
  async getOrder(req, res) {
    const { id } = req.params
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      const getOrder = await Order.findById(id)
      res.json(getOrder)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /user/order
  async getAllUserOrder(req, res) {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      const getAllUserOrder = await Order.find({ orderby: _id })
        .populate('products.product')
        .populate('orderby')
        .exec()
      res.json(getAllUserOrder)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /user/all-order
  async getAllOrder(req, res) {
    const { _id } = req.user
    try {
      const getAllOrder = await Order.find()
        .populate('products.product')
        .populate('orderby')
        .exec()
      res.json(getAllOrder)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /user/cart
  async userCart(req, res) {
    const { cart } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
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
        products.push(object)
      }
      const cartTotal = products.reduce((total, product) => {
        return product.price * product.count + total
      }, 0)
      console.log(cartTotal)
      const newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?._id,
      }).save()
      res.json(newCart)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /user/apply-coupon
  async applyCoupon(req, res) {
    const { coupon } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    const validCoupon = await Coupon.findOne({ name: coupon })
    const date = new Date()
    if (validCoupon === null || date > validCoupon.expiry) {
      throw new Error('Invalid Coupon')
    }
    let { cartTotal } = await Cart.findOne({
      orderby: _id,
    }).populate('products.product')
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2)
    const updateCart = await Cart.findOneAndUpdate(
      { orderby: _id },
      { totalAfterDiscount },
      { new: true }
    )
    res.json(updateCart)
  }

  // [POST] /user/cash-order
  async createOrder(req, res) {
    const { COD, couponApplied } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      if (!COD) throw new Error('Create cash order failed')
      const user = await User.findById(_id)
      let userCart = await Cart.findOne({ orderby: user._id })
      // let finalAmount = 0
      // if (couponApplied && userCart.totalAfterDiscount) {
      //   finalAmount = userCart.totalAfterDiscount
      // } else {
      //   finalAmount = userCart.cartTotal
      // }
      let finalAmount =
        couponApplied && userCart.totalAfterDiscount
          ? userCart.totalAfterDiscount
          : (finalAmount = userCart.cartTotal)

      let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
          id: uniqid(),
          method: 'COD',
          amount: finalAmount,
          status: 'Cash on Delivery',
          created: Date.now(),
          currency: 'usd',
        },
        orderby: user._id,
        orderStatus: 'Cash on Delivery',
      }).save()
      let update = userCart.products.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } },
          },
        }
      })
      const updated = await Product.bulkWrite(update, {})
      res.json(newOrder)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /user/save-address
  async saveAddress(req, res) {
    const { _id } = req.user
    validateMongoDbId(_id)

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
    validateMongoDbId(_id)
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
  // [PUT] /user/block-user
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

  // [PUT] /user/unblock-user
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

  // [PUT] /user/order/update-order/:id
  async updateOrderStatus(req, res) {
    const { status } = req.body
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: status,
          paymentIntent: {
            status: status,
          },
        },
        { new: true }
      )
      res.json(updateOrderStatus)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /user/empty-cart
  async emptyCart(req, res) {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      const user = await User.findOne({ _id })
      const cart = await Cart.findOneAndRemove({ orderby: user._id })
      res.json("There're no products in cart")
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
}

module.exports = new UserController()
