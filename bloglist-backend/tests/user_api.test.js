const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)
const newuser = {"username": "abc", "name": "Austin Butler", "password": "abcd"}

beforeEach(async () => {
  await User.deleteMany({})
  await api.post('/api/users').send(newuser)
})

test('username with < 3 characters fails', async () => {
  const newuser1 = {"username": "ab", "name": "Austin Butler", "password": "abcd"}
  const response = await api.post('/api/users').send(newuser1)
  expect(response.status).toEqual(400)
  expect(response.body.error).toContain('User validation failed')
})


test('username with >= 3 characters to pass', async () => {
  const newuser1 = {"username": "abcd", "name": "Austin Butler", "password": "abcd"}
  const response = await api.post('/api/users').send(newuser1)
  expect(response.status).toEqual(200)

  const resp = await helper.usersInDb()
  expect(resp).toHaveLength(2)
})

test('username that is not unique fails', async () => {
  const newuser1 = {"username": "abc", "name": "Austin Butler", "password": "abcd"}
  const response = await api.post('/api/users').send(newuser1)
  expect(response.status).toEqual(400)

  const resp = await helper.usersInDb()
  expect(resp).toHaveLength(1)
})