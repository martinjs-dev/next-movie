import { CiImageOff } from "react-icons/ci";

import React from 'react'

const CardSkeleton = ({error}: {error?:boolean}) => {
  return (
    <div 
className={`h-[450px] md:h-[335px] w-[100px] grid place-items-center bg-primary ${!error && "CardSkeleton"}`}>
    {error && <CiImageOff size={56}/>}
</div>
  )
}

export default CardSkeleton