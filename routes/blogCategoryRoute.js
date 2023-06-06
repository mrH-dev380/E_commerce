const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const BlogCategoryController = require('../controllers/BlogCategoryController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', asyncHandler(BlogCategoryController.getAllCategory))
router.get('/:id', asyncHandler(BlogCategoryController.getCategoryById))
router.post('/', authMiddleware, isAdmin, asyncHandler(BlogCategoryController.createCategory))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(BlogCategoryController.updateCategory))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(BlogCategoryController.deleteCategory))

module.exports = router