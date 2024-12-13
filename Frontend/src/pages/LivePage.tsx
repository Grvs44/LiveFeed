import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'
import { Link } from '@mui/material'
import { Link as RouteLink } from 'react-router-dom'

export default function LivePage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('Live'))
  }, [])
  
  return <Link component={RouteLink} to="1">Stream 1</Link>
}
