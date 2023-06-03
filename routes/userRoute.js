const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')

router.get('/all-user', asyncHandler(UserController.getAllUser))
router.get('/:id', authMiddleware, isAdmin, asyncHandler(UserController.getUser))
router.put('/:id', authMiddleware, asyncHandler(UserController.updateUser))
router.delete('/:id', asyncHandler(UserController.deleteUser))
router.put('/block-user/:id', authMiddleware, isAdmin, asyncHandler(UserController.blockUser))
router.put('/unblock-user/:id', authMiddleware, isAdmin, asyncHandler(UserController.unblockUser))

module.exports = router;