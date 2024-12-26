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
    <Link component={RouteLink} to="62e85472-da95-4702-96f2-8a081b100db5">
      Stream 1
    </Link>
  )
}
