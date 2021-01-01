const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (total, item) => {
    return total + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    return max.likes > item.likes ? max : {"title": item.title, "author": item.author, "likes": item.likes}
  }

  return blogs.length === 0
    ? null
    : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  const cba = _(blogs).countBy('author').map((blogs,author) => ({author,blogs}))
  const cba1 = cba.maxBy('blogs')
  return blogs.length === 0 
    ? null
    : cba1
}

const mostLikes = (blogs) => {
  const cba = _(blogs).groupBy('author').map((det,author) => ({author, det})).map(x => ({'author': x.author, 'likes': _.sum(x.det.map(x => x.likes))}))
  return blogs.length === 0 
    ? null
    : cba.maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
