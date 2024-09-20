import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HeaderProps {
  onSidebarOpen: () => void;
}



const Header: React.FC<HeaderProps> = ({ onSidebarOpen }) => {
  const [showSetting, setShowSetting] = useState(false);
  const router = useRouter()

  async function getUserConnected() {
    const userIid = localStorage.getItem('userId')
    if (!userIid) {
      router.push('/auth/login')
    }
    if(userIid) {
      const {data} = await axios.get('/api/user', {params : {id : userIid}})
      if (data.error) {
        router.push('/auth/login')
      }
    }
    
  }
  function handleShowSetting() {
    setShowSetting(s => !s)
  }

  function handleLogout() {
    localStorage.removeItem('userId')
    router.push('/auth/login')
  }

  useEffect(() => {
    getUserConnected()
  }, [])
 
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
      <div className="flex items-center">
        <button
          onClick={onSidebarOpen}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M4 12H20M4 18H11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <div className="relative mx-4 lg:mx-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L15 15M17 10C17 14.4183 13.4183 18 9 18C4.58172 18 1 14.4183 1 10C1 5.58172 4.58172 2 9 2C13.4183 2 17 5.58172 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
          <input
            type="text"
            className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 relative">
        <button onClick={handleShowSetting} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-user"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        {showSetting && <div className="absolute top-10 -left-[60px] bg-white z-10 p-5 shadow flex flex-col gap-3">
          <div onClick={() => router.push('/profile/admin')} className="cursor-pointer hover:underline">Profile</div>
          <div onClick={handleLogout}  className="cursor-pointer hover:underline">Logout</div>
        </div>}
      </div>
    </header>
  );
};

export default Header;
