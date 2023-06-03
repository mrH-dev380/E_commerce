const Product = require('../models/productModel')
const slugify = require('slugify')

class ProductController {
  // [POST] /product/create-product
  async createProduct(req, res) {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title)
      }
      const newProduct = await new Product(req.body)
      const product = await newProduct.save()
      res.json(product)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /product/:id
  async getProduct(req, res) {
    const { id } = req.params
    try {
      const findProduct = await Product.findById(id)
      res.status(200).json(findProduct)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /product/all-product
  async getAllProduct(req, res) {
    // Filter
    const queryObj = { ...req.query }
    const excludeFields = ['page', 'sort', 'limit', 'fields']
    excludeFields.forEach((element) => delete queryObj[element])
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Product.find(JSON.parse(queryStr))

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // Pagination

    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    if (req.query.page) {
      const productCount = await Product.countDocuments()
      if (skip >= productCount) throw new Error('This Page does not exists')
    }
    try {
      const getProduct = await query
      res.status(200).json(getProduct)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /product/:id
  async updateProduct(req, res) {
    const { id } = req.params
    console.log(id, req.body)
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title)
      }
      const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      })
      res.status(200).json(updateProduct)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /product/:id
  async deleteProduct(req, res) {
    const { id } = req.params
    console.log(id, req.body)
    try {
      const deleteProduct = await Product.findByIdAndDelete(id)
      res.status(200).json('Delete Successfully!')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ProductController()
