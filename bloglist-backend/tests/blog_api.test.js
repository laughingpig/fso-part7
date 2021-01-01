const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
const initialBlogs = helper.initialBlogs
let auth = {}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let singleBlog of initialBlogs) {
    const blog = new Blog(singleBlog)
    await blog.save()
  }

  const login = {"username": "swalling2", "name": "Shiluti2", "password": "abcd1234"}
  const user = await api.post('/api/users').send(login)
  auth = await api.post('/api/login').send({"username": "swalling2", "password": "abcd1234"})
})

test('returns the correct number of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('contains an id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('adding a new post works', async () => {
  const listWithOneBlog = {title: 'Go To Statement ', author: 'Edsger W. Dijkstraa', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 2}
  const resp = await api.post('/api/blogs').send(listWithOneBlog).set('Authorization', 'bearer '+auth.body.token)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length+1)
})

test('adding a new post fails without authorization', async () => {
  const listWithOneBlog = {title: 'Go To Statement ', author: 'Edsger W. Dijkstraa', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 2}
  const resp = await api.post('/api/blogs').send(listWithOneBlog)
  expect(resp.status).toBe(401)
})

test('missing likes defaults to 0', async () => {
  const listWithOneBlog = {_id: '5a422aa71b54a676234d17ea', title: 'Go To Statement ', author: 'Edsger W. Dijkstraa', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',  __v: 0}
  const resp = await api.post('/api/blogs').send(listWithOneBlog)
  const response = await api.get('/api/blogs')
  const likes = response.body.map(blog => blog.likes)
  expect(likes.every(l => (!isNaN(l) && l >= 0))).toBe(true)
})

test('missing title of url returns 400 Bad request', async () => {
  const listWithOneBlog = {_id: '5a422aa71b54a676234d17ea', author: 'Edsger W. Dijkstraa', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',  __v: 0}
  const resp = await api.post('/api/blogs').send(listWithOneBlog)
  expect(resp.status).toBe(400)
})

test('delete a blog', async() => {
  const listWithOneBlog = {title: 'Go To Statement ', author: 'Edsger W. Dijkstraa', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', likes: 2}
  const resp = await api.post('/api/blogs').send(listWithOneBlog).set('Authorization', 'bearer '+auth.body.token)

  const idToDelete = resp.body.id;
  const resp1 = await api.delete('/api/blogs/'+idToDelete).set('Authorization', 'bearer '+auth.body.token)
  expect(resp1.status).toBe(200)
})


test('update a blog', async() => {
  const idToDelete = initialBlogs[0]._id;
  const newBlog = {title:"New title"}
  const resp = await api.put('/api/blogs/'+idToDelete).send(newBlog)
  
  const response = await api.get('/api/blogs')
        
})

afterAll(() => {
  mongoose.connection.close()
}) 


