'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BASE_URL } from '@/utils/Const';
import { useSession } from 'next-auth/react';

export default function AdminMovies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle pour la pagination
  const [totalPages, setTotalPages] = useState(1); // Nombre total de pages pour la pagination
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirection si non connecté ou si l'utilisateur n'est pas admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session && !session.user.isAdmin) {
      router.push('/403');
    }
  }, [session, status, router]);
  


  // Fetch les films stockés dans la base de données et leurs détails via TMDb
  useEffect(() => {
    const fetchMovies = async (page: number) => {
      try {
        const res = await fetch(`/api/movies?page=${page}`);
        const { movies: moviesData, totalPages } = await res.json();

        const movieDetails = await Promise.all(
          moviesData.map(async (movie: any) => {
            const movieRes = await axios.get(`${BASE_URL}/movie/${movie.movieId}`, {
              params: {
                api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
              },
            });

            const commentsRes = await fetch(`/api/comments?movieId=${movie.movieId}`);
            const commentsData = await commentsRes.json();

            return {
              ...movieRes.data,
              commentCount: commentsData.length, // Nombre de commentaires
            };
          })
        );

        setMovies(movieDetails);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des films', error);
        setLoading(false);
      }
    };

    fetchMovies(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setLoading(true); 
  };

  // Supprimre un film
  const handleDeleteMovie = async (movieId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      try {
        const res = await fetch('/api/movies', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ movieId }),
        });
  
        if (res.ok) {
          const data = await res.json();
          alert(data.message);
          
          setMovies(movies.filter((movie) => movie.id !== movieId));
        } else {
          const errorData = await res.json();
          alert(errorData.error);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du film', error);
        alert('Erreur lors de la suppression du film');
      }
    }
  };


  return (
    <div className="p-4 mx-12">
      <h1 className="text-2xl font-bold mb-6">Liste des films</h1>
      {loading ? (
        <p>Chargement des films...</p>
      ) : (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left">Titre</th>
                <th className="p-2 text-left">Date de sortie</th>
                <th className="p-2 text-left">Note</th>
                <th className="p-2 text-left">Genre</th>
                <th className="p-2 text-left">Commentaires</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie: any) => {
                const movieGenres = movie.genres
                  .map((genre: any) => genre.name)
                  .join(', ');

                return (
                  <tr key={movie.id} className="border-t">
                    <td className="p-2 text-left">
                      <a
                        href={`/movies/${movie.id}`}
                        className="text-white hover:text-purple-300"
                      >
                        {movie.title}
                      </a>
                    </td>
                    <td className="p-2 text-left">{movie.release_date}</td>
                    <td className="p-2 text-left">{movie.vote_average}</td>
                    <td className="p-2 text-left">{movieGenres}</td>
                    <td className="p-2 text-left">{movie.commentCount}</td>
                    <td className="p-2 text-left">
                      <button
                        className="p-2 bg-red-600 text-white rounded"
                        onClick={() => handleDeleteMovie(movie.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>


          <div className="flex justify-between items-center mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:bg-gray-500"
            >
              Précédent
            </button>
            <p>Page {currentPage} sur {totalPages}</p>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:bg-gray-500"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}
