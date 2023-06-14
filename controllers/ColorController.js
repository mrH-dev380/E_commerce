const Color = require('../models/colorModel')
const validateMongoDbId = require('../utils/validateMongoDbId')

class ColorController {
  // [GET] /color
  async getAllColor(req, res) {
    try {
      const getAllColor = await Color.find()
      res.json(getAllColor)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [GET] /color/:id
  async getColorById(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const color = await Color.findById(id)
      res.json(color)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [POST] /color
  async createColor(req, res) {
    try {
      const newColor = await Color.create(req.body)
      res.json(newColor)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [PUT] /color/:id
  async updateColor(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const updateColor = await Color.findByIdAndUpdate(id, req.body, {
        new: true,
      })
      res.json(updateColor)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /color/:id
  async deleteColor(req, res) {
    const { id } = req.params
    validateMongoDbId(id)
    try {
      const deleteColor = await Color.findByIdAndDelete(id)
      res.json('Delete Successfully')
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ColorController()
