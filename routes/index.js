const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const productRoute = require('./productRoute')
const blogRoute = require('./blogRoute')
const categoryRoute = require('./categoryRoute')
const blogCategoryRoute = require('./blogCategoryRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/user', userRoute)
  app.use('/product', productRoute)
  app.use('/blog', blogRoute)
  app.use('/category', categoryRoute)
  app.use('/blogCategory', blogCategoryRoute)
}

module.exports = route;
