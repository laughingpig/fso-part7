import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initUsers } from '../reducers/usersReducer'
import usersService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  const dispatch = useDispatch()
  const users1 = useSelector(state => state.users)

  useEffect(() => {
    usersService.getAll().then(users => {
      dispatch(initUsers( users ))
    })
  }, [dispatch])  

  const output = users1.map(user => {
    return (
    <tr key={user.id}>
      <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
      <td>{user.blogs.length}</td>
    </tr>
    )
  })

  return (
    <>
    <h3>Users</h3>
    <table>
      <tbody>
      <tr>
        <td></td>
        <td>blogs created</td>
      </tr>
      {output}
      </tbody>      
    </table>
    </>
  )
}

export default Users
