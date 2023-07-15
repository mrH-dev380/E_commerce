const fs = require('fs')
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require('../utils/cloudinary')

class UploadImgController {
  // [POST] /upload-img/
  async uploadImages(req, res) {
    try {
      const uploader = (path) => cloudinaryUploadImg(path, 'images')
      const urls = []
      const files = req.files
      for (const file of files) {
        const { path } = file
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }
      const images = urls.map((file) => {
        return file
      })
      res.json(images)
    } catch (error) {
      throw new Error(error)
    }
  }

  // [DELETE] /upload-img/:id
  async deleteImages(req, res) {
    // id from publicId
    const { id } = req.params
    try {
      const deleted = cloudinaryDeleteImg(id, 'images')
      res.json({ message: 'Deleted' })
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UploadImgController()
