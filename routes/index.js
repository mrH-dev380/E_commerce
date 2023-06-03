const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const productRoute = require('./productRoute');

function route(app) {
  app.use('/auth', authRoute);
  app.use('/user', userRoute);
  app.use('/product', productRoute)
}

module.exports = route;
