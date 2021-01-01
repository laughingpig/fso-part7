import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  const sorted = request.data.sort((a,b) => b.likes - a.likes)
  return sorted
}

const newBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const newComment = async (id, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(baseUrl+'/'+id+'/comment', {comment: comment}, config)
  return response.data
}

const updateBlog = async (id, blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(baseUrl+'/'+id, blog, config)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(baseUrl+'/'+id, config)
  return response.data
}

export default { getAll, newBlog, updateBlog, deleteBlog, setToken, newComment }