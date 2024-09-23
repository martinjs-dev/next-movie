// "use client"
// import axios from "axios";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// export default function MovieCard({ poster, title, releaseDate, movieId, movie }) {
//   const [showInfos, setShowInfos] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const router = useRouter();


//   const addToDatabase = async () => {
//     if (!userId) {
//       router.push("/auth/login");
//     }
//     const payload = {
//       userId: userId,
//       movieId: movieId,
//     };
//     const { data } = await axios.post("/api/user", payload);
//     if (data.error) {
//       router.push("/auth/login");
//     }
//   };

//   const routeToSingle = async () => {
//     router.push(`movie/${movie}`)
//   }

//   return (
//     <div className="card cursor-pointer mb-5 shadow-[0px_4px_16px_px_#367E08] h-[400px] w-[280px] group gap-[0.5em] rounded relative flex justify-end flex-col p-[1.5em] z-[1] overflow-hidden">
//       <div onClick={routeToSingle} className="absolute top-0 left-0 h-full w-full bg-[#111111]">
//         <img
//           className="rounded-t-lg"
//           src={`https://image.tmdb.org/t/p/original/${poster}`}
//           alt=""
          
//         />
//       </div>
     
//       <p className="font-nunito block text-white font-light relative h-[0em] group-hover:h-[9em] leading-[1.2em] duration-500 overflow-hidden">
//       <div className="px-5 py-5 bg-white">
//           <a href="#">
//             <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title?.slice(0,15)}</h5>
//           </a>
//           <div className="flex items-center mt-2.5 mb-5">
//             <div className="flex items-center space-x-1 rtl:space-x-reverse">
//               <svg
//                 className="w-4 h-4 text-yellow-300"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 22 20"
//               >
//                 <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//               </svg>
//               <svg
//                 className="w-4 h-4 text-yellow-300"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 22 20"
//               >
//                 <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//               </svg>
//               <svg
//                 className="w-4 h-4 text-yellow-300"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 22 20"
//               >
//                 <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//               </svg>
//               <svg
//                 className="w-4 h-4 text-yellow-300"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 22 20"
//               >
//                 <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//               </svg>
//               <svg
//                 className="w-4 h-4 text-gray-200 dark:text-gray-600"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 22 20"
//               >
//                 <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//               </svg>
//             </div>
//             <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
//               5.0
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="font-bold text-gray-900 dark:text-white">
//               {releaseDate}
//             </span>
//             <p
//               onClick={addToDatabase}
//               className="text-white cursor-pointer  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[12px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//             >
//               favorite
//             </p>
//           </div>
//          </div>
//       </p>
//     </div>
//   );
// }
