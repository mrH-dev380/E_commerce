const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const BlogCategoryController = require('../controllers/BlogCategoryController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', asyncHandler(BlogCategoryController.getAllBlogCategory))
router.get('/:id', asyncHandler(BlogCategoryController.getBlogCategoryById))
router.post('/', authMiddleware, isAdmin, asyncHandler(BlogCategoryController.createBlogCategory))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(BlogCategoryController.updateBlogCategory))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(BlogCategoryController.deleteBlogCategory))

module.exports = router