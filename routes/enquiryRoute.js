const asyncHandler = require('express-async-handler')
const express = require('express')
const router = express.Router()
const EnquiryController = require('../controllers/EnquiryController')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get('/', asyncHandler(EnquiryController.getAllEnquiry))
router.get('/:id', asyncHandler(EnquiryController.getEnquiryById))
router.post('/', asyncHandler(EnquiryController.createEnquiry))
router.put('/:id', authMiddleware, isAdmin, asyncHandler(EnquiryController.updateEnquiry))
router.delete('/:id', authMiddleware, isAdmin, asyncHandler(EnquiryController.deleteEnquiry))

module.exports = router