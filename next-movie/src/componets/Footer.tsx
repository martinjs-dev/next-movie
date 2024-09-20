import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='text-center font-light text-textColor pt-4 text-[13px] md:text-[16px]'>
        Marinos | All rights reserved {new Date().getFullYear()}.
        <p>Made by using{" "}
            <Link
            className="text-white"
            href="https://github.com/Marinos20"
            target='_blank'>
                Marinos team
            </Link>
        </p>
    </div>
  )
}

export default Footer;