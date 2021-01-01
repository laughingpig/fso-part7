const loginReducer = (state = null, action) => {
  switch(action.type) {
    case 'LOGIN':
      return action.data
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export const loginUser = (content) => {
  return {
    type: 'LOGIN',
    data: content
  }
}

export const logoutUser = () => {
  return {
    type: 'LOGOUT'
  }
}


export default loginReducer