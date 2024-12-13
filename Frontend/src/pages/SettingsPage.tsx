import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'

export default function SettingsPage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('Settings'))
  }, [])
  
  return <p>Settings page</p>
}
