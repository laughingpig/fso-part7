const notifReducer = (state = {content: '', type: '', time: 0}, action) => {
  switch(action.type) {
    case 'NEW_NOTIFICATION':
      return action.data
    default:
      return state
  }
}

export const newNotification = (content, type, time) => {
  return {
    type: 'NEW_NOTIFICATION',
    data: {content, type, time}
  }
}

export default notifReducer