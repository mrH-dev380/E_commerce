const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.post('/register', asyncHandler(AuthController.register))
router.post('/login', asyncHandler(AuthController.login))
router.get('/refresh-token', asyncHandler(AuthController.refreshToken))
router.get('/logout', asyncHandler(AuthController.logout))

module.exports = router
