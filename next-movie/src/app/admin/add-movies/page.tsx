'use client';

import { useState, useEffect } from 'react';
import { searchMovies } from '@/services/tmdb';
import axios from 'axios';
import { BASE_URL } from '@/utils/Const';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MovieSearch() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [existingMovies, setExistingMovies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [discover, setDiscover] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();


//   console.log(session.user)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session && !session.user.isAdmin) {
        console.log(session.user)
      router.push('/403'); 
    }
  }, [session, status, router]);


  // Genres depuis TMDB
  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: { api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY },
      });
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  // Films dans la base de données
  useEffect(() => {
    const fetchExistingMovies = async () => {
      const res = await fetch('/api/movies');
      const data = await res.json();
      console.log(data.movies)
      const existingMovieIds = data.movies.map((movie: any) => movie.movieId);
      setExistingMovies(existingMovieIds);
    };
    fetchExistingMovies();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const results = await searchMovies(query);
    setMovies(results);
    setLoading(false);
  };

  // Recherche Discover
  const handleDiscoverChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDiscover(e.target.value);
    const res = await axios.get(`${BASE_URL}/movie/${e.target.value}`, {
      params: { api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY },
    });
    setMovies(res.data.results);
  };

  // Recherche par genre
  const handleGenreChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
    const res = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
        with_genres: e.target.value,
      },
    });
    setMovies(res.data.results);
  };

  const handleCheckboxChange = (movieId: string) => {
    if (selectedMovies.includes(movieId)) {
      setSelectedMovies(selectedMovies.filter((id) => id !== movieId));
    } else {
      setSelectedMovies([...selectedMovies, movieId]);
    }
  };

  const handleAddMovie = async (movieId: string) => {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movieIds: [movieId] }),
    });

    if (res.ok) {
      alert('Film ajouté avec succès');
      setExistingMovies([...existingMovies, movieId]);
    } else {
      alert('Erreur lors de l’ajout du film');
    }
  };

  return (
    <div className="p-4">
      {/* Formulaire de recherche avec Discover et Genres */}
      <form
        onSubmit={handleSearch}
        className="flex justify-between items-center"
      >
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher des films..."
            className="p-2 border border-gray-300 rounded text-black"
          />
          <button type="submit" className="p-2 bg-purple-600 text-white ml-2">
            Rechercher
          </button>
        </div>
        <div className="">
        {/* Select pour Discover */}
        <select
          value={discover}
          onChange={handleDiscoverChange}
          className="p-2 border border-gray-300  rounded ml-4 text-black"
        >
          <option value="">Discover</option>
          <option value="now_playing">Now Playing</option>
          <option value="top_rated">Top Rated</option>
          <option value="popular">Popular</option>
          <option value="upcoming">Upcoming</option>
        </select>

        {/* Select pour Genres */}
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          className="p-2 border border-gray-300 rounded ml-4 text-black"
        >
          <option value="">Select Genre</option>
          {genres.map((genre: any) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select></div>
      </form>

      {loading && <p>Recherche en cours...</p>}

      <div className="mt-4">
        {movies.length > 0 && (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className=" text-left">Sélection</th>
                <th className="p-2 text-left">Titre</th>
                <th className="p-2 text-left">Date de sortie</th>
                <th className="p-2 text-left">Note</th>
                <th className="p-2 text-left">Genre</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.slice(0, 50).map((movie: any) => {
                const isMoviePresent = existingMovies.includes(movie.id.toString());
                const movieGenres = movie.genre_ids
                  .map((id: number) => genres.find((g: any) => g.id === id)?.name)
                  .filter(Boolean)
                  .join(', ');

                return (
                  <tr
                    key={movie.id}
                    className={`border-t cursor-pointer ${
                      isMoviePresent ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => !isMoviePresent && handleCheckboxChange(movie.id)}
                  >
                    <td className="p-2 text-left">
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(movie.id)}
                        checked={selectedMovies.includes(movie.id)}
                        disabled={isMoviePresent} 
                      />
                    </td>
                    <td className="p-2 text-left">{movie.title}</td>
                    <td className="p-2 text-left">{movie.release_date}</td>
                    <td className="p-2 text-left">{movie.vote_average}</td>
                    <td className="p-2 text-left">{movieGenres}</td>
                    <td className="p-2 text-left">
                      <button
                        className={`p-2 bg-purple-600 text-white rounded ${
                      isMoviePresent ? 'bg-gray-400' : ''
                    }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddMovie(movie.id);
                        }}
                        disabled={isMoviePresent}
                      >
                        Ajouter
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedMovies.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => handleAddMovie(selectedMovies.join(','))}
            className="p-2 bg-purple-600 text-white rounded"
          >
            Ajouter les films sélectionnés
          </button>
        </div>
      )}
    </div>
  );
}
