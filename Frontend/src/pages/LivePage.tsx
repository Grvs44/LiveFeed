import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'

export default function LivePage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('Live'))
  }, [])
  
  return <p>Live page</p>
}
