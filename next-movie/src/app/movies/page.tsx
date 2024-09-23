"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getMovieDetails } from "@/services/tmdb"; 

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [favMovies, setFavMovies] = useState<string[]>([]); 
  const router = useRouter();
  const { data: session, status} = useSession();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`/api/movies?page=${currentPage}`);
        const data = await res.json();

        const movieDetailsPromises = data.movies.map(async (movie: any) => {
          const movieDetails = await getMovieDetails(movie.movieId);
          return movieDetails;
        });

        
        const movieDetails = await Promise.all(movieDetailsPromises);
        setMovies(movieDetails);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]);

  
  useEffect(() => {
    if (session && session.user) {
      setFavMovies(session.user.favMovies || []);
    }
  }, [session]);

  const toggleFavorite = async (movieId: string) => {
    if (!session || status === "unauthenticated") {
      router.push("/auth/signin"); 
      return;
    }

    let updatedFavMovies;
    if (favMovies.includes(movieId)) {
      // Retirer des favoris
      updatedFavMovies = favMovies.filter((id) => id !== movieId);
    //   await update();
    } else {
      // Ajouter aux favoris
      updatedFavMovies = [...favMovies, movieId];
    //   await update();
    }

    setFavMovies(updatedFavMovies);

    
    await fetch("/api/user/favorites", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    });
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des films</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <div
            key={movie.id}
            className="bg-gray-800 rounded-lg shadow-lg p-4 relative"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded cursor-pointer"
              onClick={() => router.push(`/movies/${movie.id}`)}
            />
            <h2 className="text-lg font-bold text-white mt-2">{movie.title}</h2>
            <p className="text-gray-400">{movie.release_date}</p>

            {/* Icône fav*/}
            <div
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => toggleFavorite(movie.id)}
            >
              {favMovies.includes(movie.id) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="red"
                  viewBox="0 0 24 24"
                  stroke="red"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.172 5.172a4.001 4.001 0 015.656 0L12 8.343l3.172-3.171a4.001 4.001 0 115.656 5.656L12 18l-8.828-8.828a4.001 4.001 0 010-5.656z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.172 5.172a4.001 4.001 0 015.656 0L12 8.343l3.172-3.171a4.001 4.001 0 115.656 5.656L12 18l-8.828-8.828a4.001 4.001 0 010-5.656z"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>


      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
          className={`p-2 bg-purple-600 text-white rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Page précédente
        </button>
        <span className="text-white">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => handlePageChange("next")}
          disabled={currentPage === totalPages}
          className={`p-2 bg-purple-600 text-white rounded ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Page suivante
        </button>
      </div>
    </div>
  );
}
