const ProdCategory = require('../models/prodCategoryModel')
const { validateMongoDbId } = require('../utils/validateMongoDbId')

class ProdCategoryController {
  // [GET] /category
  async getAllCategory(req, res) {
    try {
      const getAllCategory = await ProdCategory.find()
      res.json(getAllCategory)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /category/:id
  async getCategoryById(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const category = await ProdCategory.findById(id)
      res.json(category)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /category
  async createCategory(req, res) {
    try {
      const newCategory = await ProdCategory.create(req.body)
      res.json(newCategory)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /category/:id
  async updateCategory(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const updateCategory = await ProdCategory.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      )
      res.json(updateCategory)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /category/:id
  async deleteCategory(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const deleteCategory = await ProdCategory.findByIdAndDelete(id)
      res.json('Delete Successfully')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ProdCategoryController()
