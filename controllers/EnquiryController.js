const Enquiry = require('../models/enquiryModel')
const { validateMongoDbId } = require('../utils/validateMongoDbId')

class EnquiryController {
  // [GET] /enquiry
  async getAllEnquiry(req, res) {
    try {
      const getAllEnquiry = await Enquiry.find()
      res.json(getAllEnquiry)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /Enquiry/:id
  async getEnquiryById(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const enquiry = await Enquiry.findById(id)
      res.json(enquiry)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /Enquiry
  async createEnquiry(req, res) {
    try {
      const newEnquiry = await Enquiry.create(req.body)
      res.json(newEnquiry)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /Enquiry/:id
  async updateEnquiry(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
        new: true,
      })
      res.json(updateEnquiry)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /Enquiry/:id
  async deleteEnquiry(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const deleteEnquiry = await Enquiry.findByIdAndDelete(id)
      res.json('Delete Successfully')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new EnquiryController()
