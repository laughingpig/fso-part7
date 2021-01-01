import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog test', () => {
  let component
  const addLikeHandler = jest.fn()
  const deleteBlogHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Test Blog title',
      author: 'Test Blog author',
      likes: 3,
      url: 'https://www.blog.com',
      user: {
        username: 'swalling',
        name: 'Shiluti Walling'
      }
    }

    component = render(
      <Blog blog={blog} addLike={addLikeHandler} deleteBlog={deleteBlogHandler} />
    )
  })

  test('title and author visible', () => {
    const div = component.container.querySelector('.bloghead')
    expect(div).toHaveTextContent('Test Blog title')
    expect(div).toHaveTextContent('Test Blog author')
  })

  test('url and likes visible when show clicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const bod = component.container.querySelector('.blogbod')
    expect(bod).toHaveTextContent('3')
    expect(bod).toHaveTextContent('https://www.blog.com')
    expect(bod).toHaveStyle('display: block')
  })

  test('clicking like button twice calls event handler twice', () => {
    const button = component.container.querySelector('.likebtn')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(addLikeHandler.mock.calls).toHaveLength(2)
  })
})