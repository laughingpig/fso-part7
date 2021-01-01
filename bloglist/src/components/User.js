import React from 'react'

const User = ({name, blogs}) => {
  const blogList = blogs.map(blog => {
    return (
      <li>
      {blog.title}
      </li>
    )
  })

  return (
    <>
    <h3>{name}</h3>
    {blogList}
    </>
  )
}

export default User
