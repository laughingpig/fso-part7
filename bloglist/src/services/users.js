import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  const sorted = request.data.sort((a,b) => b.likes - a.likes)
  return sorted
}

const getUser = async (id) => {
  const request = await axios.get(baseUrl+'/'+id)
  return request
}

export default { getAll, setToken, getUser }
