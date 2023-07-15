const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const UploadImgController = require('../controllers/UploadImgController')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImage')

router.post(
  '/',
  authMiddleware,
  isAdmin,
  uploadPhoto.array('images', 10),
  productImgResize,
  asyncHandler(UploadImgController.uploadImages)
)
router.delete(
  '/delete-photo/:id',
  authMiddleware,
  isAdmin,
  asyncHandler(UploadImgController.deleteImages)
)

module.exports = router
