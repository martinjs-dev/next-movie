import React from 'react'

const Loading = () => {
  return (
    <div className='absolute left-[50%] -translate-y-1/2 bg-[#0000007a] w-[100%] h-[100%] grid place-items-center'>
       <div className="lds-ripple"><div></div><div></div></div>
    </div>
  )
}

export default Loading