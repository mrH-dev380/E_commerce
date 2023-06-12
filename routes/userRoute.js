const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')

router.get('/all-user', asyncHandler(UserController.getAllUser))
router.get('/wishlist', authMiddleware, asyncHandler(UserController.getWishlist))
router.get('/cart', authMiddleware, asyncHandler(UserController.getUserCart))
router.get('/:id', authMiddleware, isAdmin, asyncHandler(UserController.getUser))
router.post('/cart', authMiddleware, asyncHandler(UserController.userCart))
router.put('/save-address', authMiddleware, asyncHandler(UserController.saveAddress))
router.put('/update', authMiddleware, asyncHandler(UserController.updateUser))
router.put('/block-user/:id', authMiddleware, isAdmin, asyncHandler(UserController.blockUser))
router.put('/unblock-user/:id', authMiddleware, isAdmin, asyncHandler(UserController.unblockUser))
router.delete('/:id', asyncHandler(UserController.deleteUser))

module.exports = router;