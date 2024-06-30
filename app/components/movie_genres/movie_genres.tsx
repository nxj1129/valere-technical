"use client";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import MovieCarousel from "../movie_carousel/movie_carousel";
import FavoriteButton from "../favorite_button/favorite_button";
import { useRouter } from "next/navigation";
import { getGenres, getMoviesByGenre } from "@/app/services/tmdb_api";
import Image from "next/image";

const MovieGenres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleGenreClick = (genre: Genre) => {
    setSelectedGenre(genre);
    getMoviesByGenre(genre.id)
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching top movies for provider:", error);
      });
    setIsOpen(false);
  };

  useEffect(() => {
    getGenres()
      .then((data) => {
        setGenres(data || []);

        const actionGenre = data.find(
          (genre: Genre) => genre.name === "Action"
        );
        if (actionGenre) {
          setSelectedGenre(actionGenre);
          getMoviesByGenre(actionGenre.id)
            .then((movies) => {
              setMovies(movies);
            })
            .catch((error) => {
              console.error("Error fetching top movies for Netflix:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching watch providers:", error);
      });
  }, []);

  const handleSelectMovie = (movie: Movie) => {
    router.push(`/pages/${movie.id}/movie-details`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row items-center">
        <h1 className="text-3xl font-bold mb-6">Genres</h1>
        <div className="relative text-2xl mx-5 mb-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className="text-white hover:text-red-500 flex items-center">
            {selectedGenre?.name || "Genres"}
            <ChevronDown
              size={18}
              className="ml-1"
            />
          </button>
          {isOpen && (
            <div className="absolute mt-2 w-60 h-48 bg-gray-800 text-white rounded-md py-1 overflow-y-auto hide-scrollbar scrollbar-hide z-50">
              {genres.map((genre) => (
                <p
                  className="text-xl mx-1 cursor-pointer hover:text-red-500"
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}>
                  {genre.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        {selectedGenre && (
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
        )}
      </div>
    </div>
  );
};

export default MovieGenres;
