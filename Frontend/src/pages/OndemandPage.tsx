import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'

export default function OndemandPage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('On-demand'))
  }, [])
  
  return <p>On-demand page</p>
}
