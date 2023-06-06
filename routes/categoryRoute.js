const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const ProdCategoryController = require('../controllers/ProdCategoryController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', asyncHandler(ProdCategoryController.getAllCategory))
router.get('/:id', asyncHandler(ProdCategoryController.getCategoryById))
router.post('/', authMiddleware, isAdmin, asyncHandler(ProdCategoryController.createCategory))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(ProdCategoryController.updateCategory))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(ProdCategoryController.deleteCategory))

module.exports = router