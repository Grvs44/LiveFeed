import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'

export default function RecipesPage() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(setTitle('Recipes'))
  }, [])
  
  return <p>Recipe Manager</p>
}
