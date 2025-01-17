import React from 'react'

const Loading = () => {
  return (
    <div className='w-full flex justify-center items-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-outline'></div>
    </div>
  )
}

export default Loading