import React from 'react'
import { Link } from '@mui/material'
import { useDispatch } from 'react-redux'
import { Link as RouteLink } from 'react-router-dom'
import { setTitle } from '../redux/titleSlice'

export default function LivePage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('Live'))
  }, [])

  return (
    <Link component={RouteLink} to="1">
      Stream 1
    </Link>
  )
}
