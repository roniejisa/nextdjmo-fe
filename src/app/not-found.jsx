import ErrorPage from '@/components/404/ErrorPage'
import LinkCustom from '@/packages/translation/Link'
import React from 'react'

const NotFound = () => {
  return (
    <ErrorPage href="/" number={4}/>
  )
}

export default NotFound