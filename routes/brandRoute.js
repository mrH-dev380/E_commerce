const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const BrandController = require('../controllers/BrandController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', asyncHandler(BrandController.getAllBrand))
router.get('/:id', asyncHandler(BrandController.getBrandById))
router.post('/', authMiddleware, isAdmin, asyncHandler(BrandController.createBrand))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(BrandController.updateBrand))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(BrandController.deleteBrand))

module.exports = router