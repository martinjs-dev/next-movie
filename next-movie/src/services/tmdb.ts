import axios from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL


export const searchMovies = async (query: string) => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      query: query,
      api_key: API_KEY,
    },
  })
  return response.data.results
}


export const getMovieDetails = async (movieId: any) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: API_KEY,
    },
  })
  return response.data
}

export const getGenres = async () => {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
      },
    })
    return response.data.genres
  }
  