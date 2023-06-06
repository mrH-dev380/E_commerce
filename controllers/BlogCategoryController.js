const BlogCategory = require('../models/blogCategoryModel')
const validateMongodbId = require('../utils/validateMongodbId')

class BlogCategoryController {
  // [GET] /blog-category
  async getAllBlogCategory(req, res) {
    try {
      const getAllBlogCategory = await BlogCategory.find()
      res.json(getAllBlogCategory)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /blog-category/:id
  async getBlogCategoryById(req, res) {
    const { id } = req.params
    validateMongodbId(id)
    try {
      const blogCategory = await BlogCategory.findById(id)
      res.json(blogCategory)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /blog-category
  async createBlogCategory(req, res) {
    try {
      const newBlogCategory = await BlogCategory.create(req.body)
      res.json(newBlogCategory)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /blog-category/:id
  async updateBlogCategory(req, res) {
    const { id } = req.params
    validateMongodbId(id)
    try {
      const updateBlogCategory = await BlogCategory.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      )
      res.json(updateBlogCategory)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /blog-category/:id
  async deleteBlogCategory(req, res) {
    const { id } = req.params
    validateMongodbId(id)
    try {
      const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id)
      res.json('Delete Successfully')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new BlogCategoryController()
