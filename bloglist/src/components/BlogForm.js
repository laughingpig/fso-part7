import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const BlogForm = ( { processBlogForm } ) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  return (
    <Form onSubmit={(event) => processBlogForm(event, title, author, url)}>
      <h3>create new</h3>
      <Form.Label>title:</Form.Label> 
      <Form.Control value={title} name="title" type="text" onChange={({ target }) => setTitle(target.value)} className="title" />
      
      <Form.Label>author:</Form.Label> 
      <Form.Control type="text" name="author" value={author} onChange={({ target }) => setAuthor(target.value)} className="author" />
      
      <Form.Label>url:</Form.Label>
      <Form.Control type="text" name="url" value={url} onChange={({ target }) => setUrl(target.value)} className="url" />
      <br />
      <Button variant="primary" type="submit"id="blogform">Submit</Button>
      <br />
    </Form>
  )
}

export default BlogForm