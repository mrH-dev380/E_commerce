const Brand = require('../models/brandModel')
const { validateMongoDbId } = require('../utils/validateMongoDbId')

class BrandController {
  // [GET] /brand
  async getAllBrand(req, res) {
    try {
      const getAllBrand = await Brand.find()
      res.json(getAllBrand)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /brand/:id
  async getBrandById(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const brand = await Brand.findById(id)
      res.json(brand)
    } catch (error) {
      res.json(id)
      throw new Error(error)
    }
  }

  // [POST] /brand
  async createBrand(req, res) {
    try {
      const newBrand = await Brand.create(req.body)
      res.json(newBrand)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /brand/:id
  async updateBrand(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
      })
      res.json(updateBrand)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /brand/:id
  async deleteBrand(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const deleteBrand = await Brand.findByIdAndDelete(id)
      res.json('Delete Successfully')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new BrandController()
