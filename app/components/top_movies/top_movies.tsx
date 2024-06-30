"use client";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import FavoriteButton from "../favorite_button/favorite_button";
import { useRouter } from "next/navigation";
import {
  getTopMoviesForProvider,
  getWatchProviders,
} from "@/app/services/tmdb_api";

const TopMovies: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    getWatchProviders()
      .then((data) => {
        setProviders(data || []);

        const netflixProvider = data.find(
          (provider: Provider) => provider.provider_name === "Netflix"
        );
        if (netflixProvider) {
          setSelectedProvider(netflixProvider);
          getTopMoviesForProvider(netflixProvider.provider_id)
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

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider);
    getTopMoviesForProvider(provider.provider_id)
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching top movies for provider:", error);
      });
    setIsOpen(false);
  };

  const handleSelectMovie = (movie: Movie) => {
    router.push(`/pages/${movie.id}/movie-details`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row items-center">
        <h1 className="text-3xl font-bold mb-6">Top 3 Movies</h1>
        <div className="relative text-2xl mx-5 mb-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className="text-white hover:text-red-500 flex items-center">
            {selectedProvider?.provider_name || "Providers"}
            <ChevronDown
              size={18}
              className="ml-1"
            />
          </button>
          {isOpen && (
            <div className="absolute mt-2 w-60 h-48 bg-gray-800 text-white rounded-md py-1 overflow-y-auto hide-scrollbar scrollbar-hide z-10">
              {providers.map((provider) => (
                <p
                  className="text-xl mx-1 cursor-pointer hover:text-red-500"
                  key={provider.provider_id}
                  onClick={() => handleProviderClick(provider)}>
                  {provider.provider_name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        {selectedProvider && (
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative">
                  <div className="w-full h-72 flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto object-cover"
                      onClick={() => handleSelectMovie(movie)}
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton movie={movie} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-center">
                    {movie.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMovies;
