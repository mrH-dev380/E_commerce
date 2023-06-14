const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const productRoute = require('./productRoute')
const blogRoute = require('./blogRoute')
const categoryRoute = require('./categoryRoute')
const blogCategoryRoute = require('./blogCategoryRoute')
const brandRoute = require('./brandRoute')
const colorRoute = require('./colorRoute')
const couponRoute = require('./couponRoute')
const enquiryRoute = require('./enquiryRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/user', userRoute)
  app.use('/product', productRoute)
  app.use('/blog', blogRoute)
  app.use('/category', categoryRoute)
  app.use('/blogCategory', blogCategoryRoute)
  app.use('/brand', brandRoute)
  app.use('/color', colorRoute)
  app.use('/coupon', couponRoute)
  app.use('/enquiry', enquiryRoute)
}

module.exports = route;
