// library
const bcrypt = require('bcrypt')
const uniqid = require('uniqid')
// model
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')
const PreOrder = require('../models/preOrderModel')
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

  // [GET] /user/pre-order
  async getPreOrder(req, res) {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      const preOrder = await PreOrder.find({ orderby: _id }).populate(
        'products.product'
      )
      res.json(preOrder)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /user/order/:id
  async getOrder(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const getOrder = await Order.findById(id)
        .populate('products.product')
        .populate('orderby')
        .exec()
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
      const getAllUserOrder = await Order.find({ orderedBy: _id })
        .populate('orderItems.product')
        .populate('orderedBy')
        .exec()
      res.json(getAllUserOrder)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /user/all-orders
  async getAllOrder(req, res) {
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
      for (let i = 0; i < cart.length; i++) {
        let object = {}
        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color
        let getPrice = await Product.findById(cart[i]._id)
          .select('price')
          .exec()
        object.price = getPrice.price
        object.detailProductId = uniqid()
        products.push(object)
      }
      const cartTotal = products.reduce((total, product) => {
        return product.price * product.count + total
      }, 0)
      if (alreadyExistCart) {
        const newCart = await Cart.findOneAndUpdate(
          { orderby: user._id },
          {
            products,
            cartTotal,
            orderby: user?._id,
          },
          { new: true }
        )
        res.json(newCart)
      } else {
        const newCart = await new Cart({
          products,
          cartTotal,
          orderby: user?._id,
        }).save()
        res.json(newCart)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  // [POST] /user/pre-order
  async preOder(req, res) {
    const { cart } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      const user = await User.findById(_id)
      let products = []
      let shipping = 0

      for (let i = 0; i < cart.length; i++) {
        let object = {}
        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color
        let getPrice = await Product.findById(cart[i]._id)
          .select('price')
          .exec()
        object.price = getPrice.price
        object.detailProductId = cart[i].detailProductId
        products.push(object)
      }
      let cartTotal = products.reduce((total, product) => {
        return product.price * product.count + total
      }, 0)

      if (cartTotal < 100) {
        shipping = 9
      }

      const preOrder = await new PreOrder({
        products,
        shipping,
        cartTotal,
        orderby: user?._id,
      }).save()
      res.json(preOrder)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /user/cart/apply-coupon
  async applyCoupon(req, res) {
    const { coupon } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    const validCoupon = await Coupon.findOne({ name: coupon })
    const date = new Date()
    if (validCoupon === null || date > validCoupon.expiry) {
      // throw new Error('Invalid Coupon')
      const updateCart = await PreOrder.findOne({ orderby: _id })
      updateCart.aggregate([{ $addFields: { couponError: true } }])
      res.json(updateCart)
    } else {
      let { cartTotal } = await PreOrder.findOne({
        orderby: _id,
      }).populate('products.product')
      let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
      ).toFixed(2)
      const updateCart = await PreOrder.findOneAndUpdate(
        { orderby: _id },
        { totalAfterDiscount, coupon },
        { new: true }
      )
      res.json(updateCart)
    }
  }

  // [POST] /user/cart/remove-coupon
  async removeCoupon(req, res) {
    const { _id } = req.user
    validateMongoDbId(_id)
    const updatePreOrder = await PreOrder.findOneAndUpdate(
      { orderby: _id },
      { $unset: { totalAfterDiscount: '', coupon: '' } },
      { new: true }
    )
    res.json(updatePreOrder)
  }

  // [POST] /cart/create-order
  async createOrder(req, res) {
    const { shippingInfo, coupon } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      const user = await User.findById(_id)
      let userPreOrder = await PreOrder.findOne({ orderby: user._id })
      let deleteProductCart = []
      userPreOrder.products.map((product) => {
        deleteProductCart.push(product.detailProductId)
      })
      let update = userPreOrder.products.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } },
          },
        }
      })
      const updated = await Product.bulkWrite(update, {})
      const updateCart = await Cart.findOneAndUpdate(
        { orderby: user._id },
        {
          $pull: { products: { detailProductId: { $in: deleteProductCart } } },
        }
      )
      if (coupon) {
        const discount = (userPreOrder.cartTotal * coupon.discount) / 100
        const totalPriceAfterDiscount =
          userPreOrder.cartTotal - discount + userPreOrder.shipping
        const order = await Order.create({
          shippingInfo,
          coupon: coupon.name,
          discount: discount,
          shipping: userPreOrder.shipping,
          orderItems: userPreOrder.products,
          totalPrice: userPreOrder.cartTotal,
          totalPriceAfterDiscount: totalPriceAfterDiscount,
          orderedBy: _id,
        })
        res.json(order)
      } else {
        const order = await Order.create({
          shippingInfo,
          shipping: userPreOrder.shipping,
          orderItems: userPreOrder.products,
          totalPrice: userPreOrder.cartTotal,
          orderedBy: _id,
        })
        res.json(order)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /user/add-address
  async addAddress(req, res) {
    const { _id } = req.user
    const { fullName, phoneNumber, province, district, ward, street } = req.body
    validateMongoDbId(_id)
    try {
      const addNewAddress = await User.findByIdAndUpdate(
        _id,
        {
          $push: {
            address: {
              fullName,
              phoneNumber,
              province,
              district,
              ward,
              street,
              id: uniqid(),
            },
          },
        },
        { new: true }
      )

      res.json(addNewAddress)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /user/update
  async updateUser(req, res) {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
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

  // [POST] /user/delete-address
  async deleteAddress(req, res) {
    const { _id } = req.user
    const { id } = req.body
    validateMongoDbId(_id)
    try {
      const deleteAddress = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { address: { id } },
        },
        { new: true }
      )
      res.json(deleteAddress)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /user/pre-order
  async deletePreOrder(req, res) {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
      const user = await User.findOne({ _id })
      const preOrder = await PreOrder.deleteMany({ orderby: user._id })
      res.json("There're no products in pre-order")
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
