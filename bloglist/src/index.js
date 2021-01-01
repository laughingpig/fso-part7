import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import notifReducer from './reducers/notifReducer'
import blogReducer from './reducers/blogReducer'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import loginReducer from './reducers/loginReducer'
import usersReducer from './reducers/usersReducer'
import {
  BrowserRouter as Router
} from "react-router-dom"
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  blogs: blogReducer,
  notifications: notifReducer,
  login: loginReducer,
  users: usersReducer
})

const store = createStore(reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
  )

ReactDOM.render(<Provider store={store}><Router><App /></Router></Provider>, document.getElementById('root'))