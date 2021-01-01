const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name:1})
  response.json(blogs)
})

blogsRouter.put('/:id/comment', async(request, response) => {
  if (typeof request.body.comment === 'undefined' || request.body.comment === '') {
    response.status(400).send('Bad request')
  }  
  else {
  const blog = await Blog.findById(request.params.id)
  const updatedBlog = {
    ...blog.body,
    comments: [
      ...(blog.comments ? blog.comments : []),
      request.body.comment
    ]
  }
  const res = await Blog.findByIdAndUpdate(request.params.id, updatedBlog).populate('user', {username:1, name:1})
  response.status(200).json(res)
  }
})

blogsRouter.post('/', async (request, response) => {
  if (isNaN(request.body.likes) || request.body.likes < 0) {
    request.body.likes = 0
  }
  if (typeof request.body.title === 'undefined' || request.body.title === '' || typeof request.body.url === 'undefined' || request.body.url === '') {
    response.status(400).send('Bad request')
  }
  const body = request.body
  if(!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } 
  else {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    user: user._id
  })
  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  if(!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const deleteUser = await Blog.findById(request.params.id)
    if(deleteUser && deleteUser.user.toString() === user._id.toString()) {
      const res = await Blog.findByIdAndDelete(request.params.id)
      response.status(200).json(res)
    }
    else {
      return response.status(401).json({ error: 'unauthorised request' })
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  if (isNaN(request.body.likes) || request.body.likes < 0) {
    request.body.likes = 0
  }
  if (typeof request.body.title === 'undefined' || request.body.title === '' || typeof request.body.url === 'undefined' || request.body.url === '') {
    response.status(400).send('Bad request')
  }
  const body = request.body
  if(!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } 
  else {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const res = await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(200).json(res)
  }
})

module.exports = blogsRouter