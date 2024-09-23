// import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='text-center font-light text-textColor pt-4 text-[13px] md:text-[16px]'>
        Next Movie | All rights reserved {new Date().getFullYear()}.
        
    </div>
  )
}

export default Footer;