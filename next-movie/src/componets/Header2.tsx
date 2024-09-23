// src/componets/Header.tsx

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-600">
          <Link href="/">Next Movie</Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="hover:text-purple-600 transition duration-300"
          >
            Accueil
          </Link>
          <Link
            href="/movies"
            className="hover:text-purple-600 transition duration-300"
          >
            Films
          </Link>

          {/* Affiche les liens uniquement si l'utilisateur est connecté */}
          {status === "authenticated" && (
            <>
              <Link
                href="/user/my-favorites"
                className="hover:text-purple-600 transition duration-300"
              >
                Mes Favoris
              </Link>
              <Link
                href="/user/profile"
                className="hover:text-purple-600 transition duration-300"
              >
                Profil
              </Link>
            </>
          )}
          {/* Ajoutez d'autres liens ici si nécessaire */}
        </nav>

        {/* Search Bar */}
        <div className="flex items-center space-x-3">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="px-3 py-2 rounded-md bg-gray-700 text-white outline-none"
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-md bg-purple-600 hover:bg-purple-800"
            >
              <AiOutlineSearch size={20} />
            </button>
          </form>

          {/* User Actions */}
          <div className="ml-4">
            {status === "loading" ? (
              <p>Chargement...</p>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <FaUserCircle size={28} className="text-white" />
                <span>Bienvenue, {session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="ml-4 px-4 py-2 bg-purple-800 rounded-md hover:bg-purple-600 transition duration-300"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-800 transition duration-300"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
