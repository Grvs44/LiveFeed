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
    <Link component={RouteLink} to="950ae0d4-0eb0-4601-a7f5-f07ae9eb98eb">
      Stream 1
    </Link>
  )
}
