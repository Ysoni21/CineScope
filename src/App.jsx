import React, { useEffect, useState } from "react";
import { fetchTrendingMovies, fetchMovieTrailer } from "./services/tmdb";
import FilterBar from "./components/FilterBar";
import "./styles/global.css";

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = "Enter your Api key here";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [filters, setFilters] = useState({
    genre: null,
    year: null,
    language: null,
    type: null,
  });
  const [genres, setGenres] = useState([]);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    async function getMovies() {
      try {
        setLoading(true);

        const type = filters.type || "movie"; // default to movie
        let url = "";

        if (query) {
          // Search endpoint
          url = `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(
            query
          )}`;
        } else {
          // Discover endpoint (with filters)
          const params = new URLSearchParams({
            api_key: API_KEY,
            sort_by: "popularity.desc",
          });

          if (filters.genre) {
            // find genre id from genre name
            const genreObj = genres.find((g) => g.name === filters.genre);
            if (genreObj) params.append("with_genres", genreObj.id);
          }
          if (filters.year) {
            if (type === "movie") {
              params.append("primary_release_year", filters.year);
            } else {
              params.append("first_air_date_year", filters.year);
            }
          }
          if (filters.language) {
            params.append("with_original_language", filters.language.code);
          }

          url = `https://api.themoviedb.org/3/discover/${type}?${params.toString()}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.results) {
          const fullRowCount = Math.floor(data.results.length / 5) * 5;
          setMovies(data.results.slice(0, fullRowCount));
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    getMovies();
  }, [query, filters, genres]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        if (!res.ok) throw new Error("Failed to load genres");
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

  const handleWatchTrailer = async (movieId) => {
    try {
      const trailerUrl = await fetchMovieTrailer(movieId);
      if (trailerUrl) {
        setSelectedTrailer(trailerUrl);
      } else {
        alert("Trailer not available.");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };

  const closeTrailer = () => setSelectedTrailer(null);

  const handleSearchClick = () => {
    setQuery(searchTerm.trim());
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            setQuery("");
            setSearchTerm("");
            setFilters({ genre: null, year: null, language: null, type: null });
          }}
          title="Go back to homepage"
        >
          CineScope 🎬
        </h1>
        <p>Explore movies and shows from all around the world</p>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
            className="search-input"
          />
          <button onClick={handleSearchClick} className="search-button">
            Search
          </button>
        </div>

        {/* Filters */}
        <FilterBar onFilterChange={handleFilterChange} />
      </header>

      <section className="movie-section">
        <h2 className="trending-title">
          {query ? `Search Results for "${query}"` : "Movies & TV Shows"}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <ul className="movie-grid">
            {movies.map((movie) => (
              <li key={movie.id} className="movie-card">
                <img
                  src={
                    movie.poster_path
                      ? `${BASE_IMAGE_URL}${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title || movie.name}
                />
                <p className="movie-title">{movie.title || movie.name}</p>
                <button
                  className="trailer-btn"
                  onClick={() => handleWatchTrailer(movie.id)}
                >
                  Watch Trailer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <div className="modal-overlay" onClick={closeTrailer}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={selectedTrailer}
              title="Movie Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <button className="close-btn" onClick={closeTrailer}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
