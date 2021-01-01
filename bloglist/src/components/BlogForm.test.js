import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('BlogForm test', () => {
  let component
  const processBlogForm = jest.fn()

  beforeEach(() => {
    component = render(
      <BlogForm processBlogForm={processBlogForm} />
    )
  })

  test('new blog', () => {
    const title = component.container.querySelector('.title')
    const author = component.container.querySelector('.author')
    const url = component.container.querySelector('.url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'Blog Test' }
    })
    fireEvent.change(author, {
      target: { value: 'Author Test' }
    })
    fireEvent.change(url, {
      target: { value: 'https://www.google.com' }
    })
    fireEvent.submit(form)
    expect(title).toHaveValue('Blog Test')
    expect(author).toHaveValue('Author Test')
    expect(url).toHaveValue('https://www.google.com')
    expect(processBlogForm.mock.calls).toHaveLength(1)
  })
})