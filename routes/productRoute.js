const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')

router.get('/:id', asyncHandler(ProductController.getProduct))
router.get('/', asyncHandler(ProductController.getAllProduct))
router.post('/create-product', authMiddleware, isAdmin, asyncHandler(ProductController.createProduct))
router.put('/wishlist', authMiddleware, asyncHandler(ProductController.addToWishlist))
router.put('/rating', authMiddleware, asyncHandler(ProductController.rating))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(ProductController.updateProduct))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(ProductController.deleteProduct))

module.exports = router
