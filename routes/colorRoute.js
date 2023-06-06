const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const ColorController = require('../controllers/ColorController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', asyncHandler(ColorController.getAllColor))
router.get('/:id', asyncHandler(ColorController.getColorById))
router.post('/', authMiddleware, isAdmin, asyncHandler(ColorController.createColor))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(ColorController.updateColor))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(ColorController.deleteColor))

module.exports = router