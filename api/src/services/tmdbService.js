const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function searchMovies(query) {
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: process.env.TMDB_API_KEY,
      query,
      language: "pt-BR",
    },
  });

  return response.data.results.map((movie) => ({
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterUrl: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
    releaseDate: movie.release_date || null,
  }));
}

module.exports = { searchMovies };
