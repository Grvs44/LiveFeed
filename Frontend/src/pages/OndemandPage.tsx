import React from 'react'
import { Link } from '@mui/material'
import { useDispatch } from 'react-redux'
import { Link as RouteLink } from 'react-router-dom'
import { setTitle } from '../redux/titleSlice'

export default function OndemandPage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('On-demand'))
  }, [])

  return (
    <Link component={RouteLink} to="1">
      Porridge
    </Link>
  )
}
