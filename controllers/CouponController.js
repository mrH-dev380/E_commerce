const Coupon = require('../models/couponModel')
const { validateMongoDbId } = require('../utils/validateMongoDbId')

class CouponController {
  // [GET] /coupon
  async getAllCoupon(req, res) {
    try {
      const getAllCoupon = await Coupon.find()
      res.json(getAllCoupon)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /coupon/:id
  async getCouponById(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const coupon = await Coupon.findById(id)
      res.json(coupon)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /coupon
  async createCoupon(req, res) {
    try {
      const newCoupon = await Coupon.create(req.body)
      res.json(newCoupon)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /coupon/:id
  async updateCoupon(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true,
      })
      res.json(updateCoupon)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /coupon/:id
  async deleteCoupon(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const deleteCoupon = await Coupon.findByIdAndDelete(id)
      res.json('Delete Successfully')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new CouponController()
