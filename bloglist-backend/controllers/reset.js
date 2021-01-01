const resetRouter = require('express').Router()
const User = require('../models/user')
const Blogs = require('../models/blog')

resetRouter.post('/', async(request, response) => {
  await User.deleteMany({})
  await Blogs.deleteMany({})

  response.status(204).end()
})

module.exports = resetRouter