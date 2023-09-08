const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/all-user', asyncHandler(UserController.getAllUser))
router.get(
  '/wishlist',
  authMiddleware,
  asyncHandler(UserController.getWishlist)
)
router.get('/cart', authMiddleware, asyncHandler(UserController.getUserCart))
router.get(
  '/order',
  authMiddleware,
  asyncHandler(UserController.getAllUserOrder)
)
router.get('/order/:id', authMiddleware, asyncHandler(UserController.getOrder))
router.get(
  '/all-orders',
  authMiddleware,
  isAdmin,
  asyncHandler(UserController.getAllOrder)
)
router.get(
  '/pre-order',
  authMiddleware,
  asyncHandler(UserController.getPreOrder)
)
router.get(
  '/:id',
  authMiddleware,
  isAdmin,
  asyncHandler(UserController.getUser)
)
router.post('/cart', authMiddleware, asyncHandler(UserController.userCart))
router.post(
  '/cart/apply-coupon',
  authMiddleware,
  asyncHandler(UserController.applyCoupon)
)
router.post(
  '/cart/remove-coupon',
  authMiddleware,
  asyncHandler(UserController.removeCoupon)
)
router.post(
  '/cart/create-order',
  authMiddleware,
  asyncHandler(UserController.createOrder)
)
router.post(
  '/delete-address',
  authMiddleware,
  asyncHandler(UserController.deleteAddress)
)
router.post('/pre-order', authMiddleware, asyncHandler(UserController.preOder))
router.put(
  '/add-address',
  authMiddleware,
  asyncHandler(UserController.addAddress)
)
router.put('/update', authMiddleware, asyncHandler(UserController.updateUser))
router.put(
  '/order/update-order/:id',
  authMiddleware,
  isAdmin,
  asyncHandler(UserController.updateOrderStatus)
)
router.put(
  '/block-user/:id',
  authMiddleware,
  isAdmin,
  asyncHandler(UserController.blockUser)
)
router.put(
  '/unblock-user/:id',
  authMiddleware,
  isAdmin,
  asyncHandler(UserController.unblockUser)
)
router.delete(
  '/empty-cart',
  authMiddleware,
  asyncHandler(UserController.emptyCart)
)
router.delete(
  '/pre-order',
  authMiddleware,
  asyncHandler(UserController.deletePreOrder)
)
router.delete('/:id', asyncHandler(UserController.deleteUser))

module.exports = router
