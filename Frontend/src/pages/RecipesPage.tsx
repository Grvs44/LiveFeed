import React from 'react'
import { useDispatch } from 'react-redux'
import { setTitle } from '../redux/titleSlice'

export default function RecipesPage() {
  const dispatch = useDispatch()
  const { handleStart } = React.useContext();

  React.useEffect(() => {
    dispatch(setTitle('Recipes'))
  }, [])
  
  return <>
    <p>Recipe Manager</p>
    <Button
    onClick={handleStart}
    
  </>
}
