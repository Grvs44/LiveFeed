import React from 'react'
import { Button, Container } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useStartStreamMutation } from '../redux/apiSlice'
import { setTitle } from '../redux/titleSlice'

export default function RecipesPage() {
  const dispatch = useDispatch()
  const [startStream] = useStartStreamMutation()
  const handleStart = async () => {
    const stream = await startStream({ recipeName: 'hello' }).unwrap()
    console.log('started stream:')
    console.log(stream)
  }

  React.useEffect(() => {
    dispatch(setTitle('Recipes'))
  }, [])

  return (
    <Container>
      <p>Recipe Manager</p>
      <Button onClick={handleStart}>Start</Button>
    </Container>
  )
}
