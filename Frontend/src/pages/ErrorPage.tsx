import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error: any = useRouteError()
  console.error(error)
  return (
    <p>
      {error.statusText} {error.message}
    </p>
  )
}
