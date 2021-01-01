import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import usersService from './services/users'
import User from './components/User'
import { useDispatch, useSelector } from 'react-redux'
import { newNotification } from './reducers/notifReducer'
import { initBlog, addBlog } from './reducers/blogReducer'
import { initUsers } from './reducers/usersReducer'
import { loginUser, logoutUser } from './reducers/loginReducer'
import {
  Switch, Route, useRouteMatch, Link
} from "react-router-dom"
import { Button, Form, Navbar, Nav, Card } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.login)
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()

  const processForm = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login( { username, password } )
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      dispatch(loginUser(user))
      setUsername('')
      setPassword('')
      dispatch(newNotification('logged in successfully.', 'success', 10000))
    }
    catch(err) {
      dispatch(newNotification('wrong username or password.', 'error', 10000))
    }
  }

  const processBlogForm = async (event, title, author,url) => {
    event.preventDefault()

    try {
      blogService.setToken(user.token)
      blogService.newBlog( { title, author, url } ).then(returnedBlog => {
        dispatch(addBlog(returnedBlog))
        dispatch(newNotification('new blog added.', 'success', 10000))
      })
    }
    catch(err) {
      dispatch(newNotification('error adding blog.', 'error', 10000))
    }
  }

  const loginForm = () => (
    <Form onSubmit={processForm}>
      <h2>login to application</h2>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control value={username} name="username" id="username" type="text" onChange={({ target }) => setUsername(target.value)} />
        
        <Form.Label>password:</Form.Label>
        <Form.Control type="password" name="password" id="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        <br />
        <Button variant="primary" type="submit">Submit</Button>
        <br />
      </Form.Group>
    </Form>
  )

  const logout = () => {
    dispatch(logoutUser())
    window.localStorage.removeItem('loggedUser')
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      dispatch(initBlog( blogs ))
    )
  }, [dispatch])

  useEffect(() => {
    const user = window.localStorage.getItem('loggedUser')
    if(user) {
      dispatch(loginUser(JSON.parse(user)))
    }
  }, [dispatch])


  useEffect(() => {
    usersService.getAll().then(users =>
      dispatch(initUsers( users ))
    )
  }, [dispatch])  

  const match = useRouteMatch('/users/:id') || null
  const matchedUser = match 
    ? users.find(user => user.id === (match.params.id))
    : null
  

  const match1 = useRouteMatch('/blogs/:id') || null   
    
  return (
    <div className='container'>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>Blog App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Blogs</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
          <Navbar.Text className="mr-sm-2">{user !== null ? <>{user.username} logged in <button onClick={logout}>Logout</button></> : null}</Navbar.Text>

        </Navbar.Collapse>
      </Navbar>

      <Notification />

      <Switch>

      <Route path="/users/:id">
        {matchedUser ? <User username={matchedUser.username} name={matchedUser.name} blogs={matchedUser.blogs} /> : null}
      </Route>

      <Route path="/users">
        <Users />
      </Route>

      <Route path="/blogs/:id">
        {match1 ? <Blog user={user} match={match1} /> : null}
      </Route>

      <Route path="/">
      { user === null ? loginForm() :
      <>
          <br />
          <Togglable buttonLabel='Add new blog'>
            <BlogForm processBlogForm={processBlogForm} />
          </Togglable>
      </>
      }
      <br />
      <div id="bloglist">
      {blogs.map(blog =>
        <Card key={blog.id}>
          <Card.Body>
            <Link to={`/blogs/${blog.id}`} key={blog.id}>{blog.title}</Link>
          </Card.Body>
        </Card>
      )}
      </div>
      </Route>
      </Switch>      
    </div>
  )
}

export default App