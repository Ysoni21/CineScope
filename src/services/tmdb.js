const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrendingMovies() {
    try{
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        console.log("Fetched trending movies:", data);
        return data.results;
    } catch (error){
        console.error('Failed to fetch the trending movies:', error);
        return[];
    }
}

export async function fetchMovieTrailer(movieId) {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}