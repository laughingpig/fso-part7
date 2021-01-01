import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch(action.type) {
    case 'INIT_BLOG':
      return action.data
    case 'NEW_BLOG':
      return [...state, action.data ]
    case 'UPDATE_BLOG':
      return state.map(blog => blog.id === action.data.id ? action.data : blog)
    case 'ADD_LIKE':
      return state.map(blog => blog.id === action.data.id ? { ...blog, likes: blog.likes+1} : blog)  
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.data)
    default:
      return state
  }
}

export const addBlog = (blog) => {
  return {
    type: 'NEW_BLOG',
    data: blog
  }
}

export const updateBlog = (id, comment) => {
  return async dispatch => {
    const blogres = await blogService.newComment( id, comment )
    console.log(blogres)
    const updblog = {
      ...blogres,
      comments: [
        ...(blogres.comments ? blogres.comments : []),
        comment
      ]      
    }
  
    dispatch ({
      type: 'UPDATE_BLOG',
      data: updblog
    })
  }
}

export const deleteBlog = (user, id) => {
  console.log(id)
  return async dispatch => {
    blogService.setToken(user.token)
    await blogService.deleteBlog(id)
    dispatch ({
      type: 'DELETE_BLOG',
      data: id
    })
  }
}


export const initBlog = (blogs) => {
  return {
    type: 'INIT_BLOG',
    data: blogs
  }
}

export const addLike = (user, blog) => {
  return async dispatch => {
    const updatedBlog = {
      _id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes+1
    }
    blogService.setToken(user.token)
    const likedblog = await blogService.updateBlog(blog.id, updatedBlog)
    dispatch ({
      type: 'ADD_LIKE',
      data: likedblog
    })
  }
}

export default blogReducer