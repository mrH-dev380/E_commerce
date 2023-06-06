const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const productRoute = require('./productRoute')
const blogRoute = require('./blogRoute')
const categoryRoute = require('./categoryRoute')
const blogCategoryRoute = require('./blogCategoryRoute')
const brandRoute = require('./brandRoute')
const colorRoute = require('./colorRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/user', userRoute)
  app.use('/product', productRoute)
  app.use('/blog', blogRoute)
  app.use('/category', categoryRoute)
  app.use('/blogCategory', blogCategoryRoute)
  app.use('/brand', brandRoute)
  app.use('/color', colorRoute)

}

module.exports = route;
