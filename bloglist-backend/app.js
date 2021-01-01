const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const resetRouter = require('./controllers/reset')
const mongoose = require('mongoose')
const logger = require('./utils/logger')


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => logger.info('Connected to DB'))
  .catch(err => logger.error(err))

app.use(cors())
app.use(express.json())
//app.use(middleware.requestLogger)
app.use(middleware.tokenHandler)

app.use('/api/blogs', blogsRouter)  
app.use('/api/users', usersRouter)  
app.use('/api/login', loginRouter)
app.use('/api/reset', resetRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app