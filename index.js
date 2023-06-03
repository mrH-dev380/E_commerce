const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const dbConnect = require('./config/dbConnect')
const route = require('./routes')
const { notFound, errorHandler } = require('./middlewares/errorHandle')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const PORT = process.env.PORT || 4000

const app = express() // init app
dbConnect() // connect to database

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

route(app) // Route init

app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
