const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const CouponController = require('../controllers/CouponController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, isAdmin, asyncHandler(CouponController.getAllCoupon))
router.get('/:id', authMiddleware, isAdmin, asyncHandler(CouponController.getCouponById))
router.post('/', authMiddleware, isAdmin, asyncHandler(CouponController.createCoupon))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(CouponController.updateCoupon))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(CouponController.deleteCoupon))

module.exports = router