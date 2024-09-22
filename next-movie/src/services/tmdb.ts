import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.TMDB_API_URL

// Fonction pour rechercher des films par titre
export const searchMovies = async (query: string) => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query: query,
    },
  })
  return response.data.results
}

// Fonction pour obtenir les détails d'un film par son ID
export const getMovieDetails = async (movieId: number) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: API_KEY,
    },
  })
  return response.data
}
