"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Navbar = () => {

    const [input, setInput] = useState("")
    const router = useRouter()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setInput("");
        router.push(`/search/${input}?page=1`);
    }
  return (
    <div className=" bg-primary">
        <div className="flex justify-between items-center py-4 px-2 md:px-10">
            <Link className="hidden md:block" href="/discover/now_playing">
                <h2 className='text-[30px]'>Marinoverse</h2>
            </Link>
        </div>
    </div>
  )
}

export default Navbar