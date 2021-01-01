import React, {useState} from 'react'
import {updateBlog, addLike, deleteBlog} from '../reducers/blogReducer'
import { useDispatch, useSelector } from 'react-redux'
import { newNotification } from '../reducers/notifReducer'
import { Redirect, useHistory } from 'react-router'
import { ListGroup, Form, Button } from 'react-bootstrap'

const Blog = ({ user, match }) => {
  const blogs = useSelector(state => state.blogs)
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  if(blogs.length === 0) {
    return null
  }  
  let blog = blogs.find(blog => blog.id === (match.params.id))
  if(!blog) {
    return <Redirect to='/' />
  }
  const processForm = (event) => {
    event.preventDefault()
    setComment('')
    dispatch(updateBlog(blog.id, comment))
  }

  const processLike = (blog) => {
    try {
      dispatch(addLike(user, blog))
      dispatch(newNotification('added like.', 'success', 10000))  
    }
    catch (error) {
      dispatch(newNotification('error liking.', 'error', 10000))        
    }
  }  

  const processDelete = (blog) => {
    try {
      dispatch(deleteBlog(user, blog.id))
      dispatch(newNotification('deleted blog.', 'success', 10000))  
      history.push('/')
    }
    catch (error) {
      dispatch(newNotification('error deleting.', 'error', 10000))  
    }
  }
  
  return (
    <div>
      <h3 className='bloghead'>{blog.title} - {blog.author}</h3>
        <div className='blogbod'>
          <br />
          {blog.url}<br />
          {user ? <>likes <span className='likesval'>{blog.likes}</span> <button onClick={() => processLike(blog)} className='likebtn'>like</button><br /></> : null}
          added by {blog.user.username}
          {user && (blog.user === user.id || blog.user.id === user.id) ?  <> <br /><button onClick={() => processDelete(blog)}>remove</button> </>  : ''}
          <br /><br />
          <h4>comments</h4>
          <Form onSubmit={processForm}>
            <Form.Group>
            <Form.Control size="sm" value={comment} name="comment" id="comment" type="text" onChange={({ target }) => setComment(target.value)} />
            </Form.Group>          
            <Button variant="primary" type="submit">add comment</Button>
          </Form>
          <br />

          <ListGroup>
          {blog.comments.map((comment,i) => {
            return (
              <ListGroup.Item key={i}>{comment}</ListGroup.Item>
            )
          })}
          </ListGroup>
        </div>
    </div>
  )
}

export default Blog
