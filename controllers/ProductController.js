const slugify = require('slugify')
const Product = require('../models/productModel')
const User = require('../models/userModel')
const { validateMongoDbId } = require('../utils/validateMongoDbId')

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
    // {"brand":"Apple","category":"Smart Phone","price":{"gte":"800"}}
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|text|search)\b/g,
      (match) => `$${match}`
    )
    // {"brand":"Apple","category":"Smart Phone","price":{"$gte":"800"}}

    let query = Product.find(JSON.parse(queryStr))
    let totalItems = await Product.countDocuments(JSON.parse(queryStr))

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

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    if (req.query.page) {
      if (skip >= totalItems) throw new Error('This Page does not exists')
    }
    try {
      const getProduct = await query
      res.status(200).json({
        getProduct,
        totalItems,
        currentPage: page,
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /product/:id
  async updateProduct(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
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

  // [PUT] /product/wishlist
  async addToWishlist(req, res) {
    const { _id } = req.user
    const { prodId } = req.body
    try {
      const user = await User.findById(_id)
      const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId)
      if (alreadyAdded) {
        const userWishlist = await User.findByIdAndUpdate(
          _id,
          { $pull: { wishlist: prodId } },
          { new: true }
        )
        res.status(200).json(userWishlist)
      } else {
        const userWishlist = await User.findByIdAndUpdate(
          _id,
          { $push: { wishlist: prodId } },
          { new: true }
        )
        res.status(200).json(userWishlist)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /product/rating
  async rating(req, res) {
    const { _id } = req.user
    const { star, prodId, comment } = req.body
    try {
      const product = await Product.findById(prodId)
      // alreadyRated return userId rated prod
      let alreadyRated = product.ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
      )
      if (alreadyRated) {
        const updateRating = await Product.updateOne(
          {
            // find user match rated
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
          },
          {
            new: true,
          }
        )
      } else {
        const rateProduct = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              ratings: {
                star: star,
                comment: comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        )
      }
      // product has been updated, define new product as getallRatings
      const getallRatings = await Product.findById(prodId)
      let totalRating = getallRatings.ratings.length
      // Using "promise" to apply multiple methods.
      let ratingSum = getallRatings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0)
      let actualRating = Math.round(ratingSum / totalRating)
      let finalProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          totalrating: actualRating,
        },
        { new: true }
      )
      res.json(finalProduct)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /product/:id
  async deleteProduct(req, res) {
    const { id } = req.params
    try {
      const deleteProduct = await Product.findByIdAndDelete(id)
      res.status(200).json('Delete Successfully!')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ProductController()
