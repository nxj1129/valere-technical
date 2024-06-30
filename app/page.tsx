"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar/navbar";
import TopMovies from "./components/top_movies/top_movies";
import MovieCarousel from "./components/movie_carousel/movie_carousel";
import MovieGenres from "./components/movie_genres/movie_genres";
import FavoriteButton from "./components/favorite_button/favorite_button";
import { FavoritesProvider } from "@/app/services/favorites_context";
import { usePathname, useRouter } from "next/navigation";
import { getNowPlaying } from "./services/tmdb_api";
import Image from "next/image";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getMovies().then((data) => setMovies(data));
  }, []);

  async function getMovies() {
    const res = await getNowPlaying();
    return res;
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
                <Image
                  width={500}
                  height={750}
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
