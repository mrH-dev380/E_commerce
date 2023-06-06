const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const BlogController = require('../controllers/BlogController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', asyncHandler(BlogController.getAllBlog))
router.get('/:id', asyncHandler(BlogController.getBlog))
router.post('/', authMiddleware, isAdmin, asyncHandler(BlogController.createBlog))
router.put('/likes', authMiddleware, asyncHandler(BlogController.likeTheBlog))
router.put('/dislikes', authMiddleware, asyncHandler(BlogController.dislikeTheBlog))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(BlogController.updateBlog))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(BlogController.deleteBlog))

module.exports = router