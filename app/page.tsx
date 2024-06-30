"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar/navbar";
import TopMovies from "./components/top_movies/top_movies";
import MovieCarousel from "./components/movie_carousel/movie_carousel";
import MovieGenres from "./components/movie_genres/movie_genres";
import FavoriteButton from "./components/favorite_button/favorite_button";
import { FavoritesProvider } from "@/app/services/favorites_context";
import { usePathname, useRouter } from "next/navigation";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const apiKey = process.env.TMDB_API_KEY;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getMovies().then((data) => setMovies(data.results));
  }, []);

  async function getMovies() {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch movies");
    }
    return res.json();
  }

  const handleSelectMovie = (movie: Movie) => {
    router.push(
      `/pages/${movie.id}/movie-details?from=${encodeURIComponent(pathname)}`
    );
  };

  return (
    <FavoritesProvider>
      <div className="bg-black-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Newest Movies</h1>
          <MovieCarousel
            items={movies}
            renderItem={(movie) => (
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded-lg"
                  onClick={() => handleSelectMovie(movie)}
                />
                <div className="absolute top-2 right-2">
                  <FavoriteButton movie={movie} />
                </div>
                <p className="mt-2 text-sm font-semibold text-center">
                  {movie.title}
                </p>
              </div>
            )}
          />
        </div>
        <TopMovies />
        <MovieGenres />
      </div>
    </FavoritesProvider>
  );
}
