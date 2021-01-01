const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const passwordHash = await bcrypt.hash(body.password, 10)

  const newUser = User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await newUser.save()

  response.json(savedUser)
})

usersRouter.get('/:id', async (request, response) => {
  const Users = await User.findById(request.params.id).populate('blogs',{title:1, author:1, likes:1, url:1})
  response.json(Users)
})


usersRouter.get('/', async (request, response) => {
  const allUsers = await User.find({}).populate('blogs',{title:1, author:1, likes:1, url:1})
  response.json(allUsers)
})

module.exports = usersRouter