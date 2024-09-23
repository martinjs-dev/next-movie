'use client';

import { useState, useEffect } from 'react';
import { getMovieDetails } from '@/services/tmdb'; 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MyFavoritePage() {
  const { data: session, status } = useSession();
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (session?.user.favMovies) {
        console.log(session?.user.favMovies)
        const movieDetailsPromises = session.user.favMovies.map(async (movieId: string) => {
          const movieDetails = await getMovieDetails(movieId); 
          return movieDetails;
        });

        const movies = await Promise.all(movieDetailsPromises);
        setFavoriteMovies(movies);
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [session]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Mes Films Favoris</h1>

      {favoriteMovies.length > 0 ? (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left">Titre</th>
              <th className="p-2 text-left">Date de sortie</th>
              <th className="p-2 text-left">Note</th>
              <th className="p-2 text-left">Genre</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {favoriteMovies.map((movie: any) => {
              const movieGenres = movie.genres
                .map((genre: any) => genre.name)
                .join(', ');

              return (
                <tr key={movie.id} className="border-t">
                  <td className="p-2 text-left">{movie.title}</td>
                  <td className="p-2 text-left">{movie.release_date}</td>
                  <td className="p-2 text-left">{movie.vote_average}</td>
                  <td className="p-2 text-left">{movieGenres}</td>
                  <td className="p-2 text-left">
                    <button
                      className="p-2 bg-red-600 text-white rounded"
                      onClick={() => handleRemoveFromFavorites(movie.id)}
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Aucun film favori ajouté.</p>
      )}
    </div>
  );
}


const handleRemoveFromFavorites = async (movieId: string) => {
  const res = await fetch('/api/user/favorites', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ movieId }),
  });

  if (res.ok) {
    alert('Film retiré des favoris avec succès');
    window.location.reload(); 
  } else {
    alert('Erreur lors de la suppression du film des favoris');
  }
};
