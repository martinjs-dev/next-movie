"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMovieDetails } from "@/services/tmdb"; // Assurez-vous que cette fonction existe

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pour gérer la pagination
  const [totalPages, setTotalPages] = useState(1); // Stocker le nombre total de pages
  const router = useRouter();

  // Fetch des films depuis votre API interne, en ajoutant la pagination
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Récupère les films (IDs TMDb stockés) pour la page courante
        const res = await fetch(`/api/movies?page=${currentPage}`);
        const data = await res.json();

        // Pour chaque ID, on récupère les détails du film depuis TMDb
        const movieDetailsPromises = data.movies.map(async (movie: any) => {
          const movieDetails = await getMovieDetails(movie.movieId);
          return movieDetails;
        });

        // Attend que tous les fetch soient complétés
        const movieDetails = await Promise.all(movieDetailsPromises);
        setMovies(movieDetails);
        setTotalPages(data.totalPages); // Met à jour le nombre total de pages depuis l'API
      } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]); // La page change quand l'utilisateur navigue

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
            key={movie.id} // Utilise l'id TMDb comme clé
            className="bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer"
            onClick={() => router.push(`/movies/${movie.id}`)} // Utilise l'ID TMDb pour la route du film
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto rounded"
            />
            <h2 className="text-lg font-bold text-white mt-2">{movie.title}</h2>
            <p className="text-gray-400">{movie.release_date}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
