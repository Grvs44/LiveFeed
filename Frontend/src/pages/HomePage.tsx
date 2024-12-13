import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'

export default function HomePage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('LiveFeed'))
  }, [])
  
  return <p>Home page</p>
}
