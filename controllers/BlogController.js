const Blog = require('../models/blogModel')
const validateMongodbId = require('../utils/validateMongodbId')

class BlogController {
  // [GET] /blog
  async getAllBlog(req, res) {
    try {
      const getAllBlog = await Blog.find()
      res.status(200).json(getAllBlog)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /blog/:id
  async getBlog(req, res) {
    const { id } = req.params
    try {
      const updateViews = await Blog.findByIdAndUpdate(
        id,
        {
          $inc: { numViews: 1 },
        },
        { new: true }
      )
      const findBlog = await Blog.findById(id)
        .populate('likes')
        .populate('dislikes')
      res.status(200).json(findBlog)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /blog
  async createBlog(req, res) {
    try {
      const newBlog = await new Blog(req.body)
      const blog = await newBlog.save()
      res.status(200).json(blog)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /blog/:id
  async updateBlog(req, res) {
    const { id } = req.params
    validateMongodbId(id)
    try {
      const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
        new: true,
      })
      res.status(200).json(updateBlog)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /blog/likes
  async likeTheBlog(req, res) {
    const { blogId } = req.body
    validateMongodbId(blogId)
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId)
    // Find the login user return ObjectId
    const loginUserId = req?.user?._id
    // Find if the user has liked the blog
    const isLiked = blog?.isLiked
    // Find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    )
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      )
      // res.json(blog)
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      )
      res.json(blog)
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      )
      res.json(blog)
    }
  }

  // [PUT] /blog/dislikes
  async dislikeTheBlog(req, res) {
    const { blogId } = req.body
    validateMongodbId(blogId)
    // Find the blog which you want to be disliked
    const blog = await Blog.findById(blogId)
    // Find the login user
    const loginUserId = req?.user?._id
    // Find if the user has disliked the blog
    const isDisLiked = blog?.isDisliked
    // Find if the user has liked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    )
    console.log(isDisLiked, alreadyLiked)
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      )
      // res.json(blog)
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      )
      res.json(blog)
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      )
      res.json(blog)
    }
  }

  // [DELETE] /blog/:id
  async deleteBlog(req, res) {
    const { id } = req.params
    validateMongodbId(id)
    try {
      const deleteBlog = await Blog.findByIdAndDelete(id)
      res.status(200).json('Delete Successfully')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new BlogController()
