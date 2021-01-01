import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { newNotification } from '../reducers/notifReducer'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notif = useSelector(state => state.notifications)
  const dispatch = useDispatch()
  const color = notif.type === 'error' ? 'danger' : 'success'
  const time = notif.time

  useEffect(() => {
    setTimeout(() => {
      dispatch(newNotification(''))
    }, time)
  }, [dispatch, time])

  return(
    <>
    { (notif.content &&
    <Alert variant={color}>
    {notif.content}
    </Alert> )}
    </>
  )
  }

export default Notification
