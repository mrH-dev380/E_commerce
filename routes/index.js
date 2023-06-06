const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const productRoute = require('./productRoute')
const blogRoute = require('./blogRoute')

function route(app) {
  app.use('/auth', authRoute)
  app.use('/user', userRoute)
  app.use('/product', productRoute)
  app.use('/blog', blogRoute)
}

module.exports = route;
