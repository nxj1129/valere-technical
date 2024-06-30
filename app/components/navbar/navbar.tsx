"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Search,
  Heart,
  ChevronDown,
  Home,
  Clapperboard,
  TvMinimalPlay,
  Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SearchResults from "../search_results/search_results";
import { useFavorites } from "@/app/services/favorites_context";
import { searchMovies } from "@/app/services/tmdb_api";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { favorites } = useFavorites();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        searchMovies(query).then(setSearchResults);
      } else {
        setSearchResults([]);
      }
    }, 300),
    [searchMovies]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectMovie = (movie: Movie) => {
    router.push(
      `/pages/${movie.id}/movie-details?from=${encodeURIComponent(pathname)}`
    );
    setShowResults(false);
    setSearchQuery("");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Debounce function
  function debounce<F extends (...args: any[]) => any>(
    func: F,
    wait: number
  ): F {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: Parameters<F>) {
      const context = this;
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func.apply(context, args), wait);
    } as F;
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <div className="text-white flex flex-row items-center cursor-pointer">
            <p
              className="mx-3 text-2xl hover:text-red-500"
              onClick={() => handleNavigation("/")}>
              Valereflix
            </p>
            <Clapperboard
              className="text-red-500"
              size={24}
            />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white md:hidden">
            <Menu size={24} />
          </button>
        </div>

        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row md:items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4`}>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <button
              onClick={() => handleNavigation("/")}
              className={`hover:text-red-500 ${
                pathname === "/" ? "text-red-500 font-bold" : "text-white"
              }`}>
              <p className="flex items-center">
                <Home
                  size={18}
                  className="mr-1"
                />
                Home
              </p>
            </button>
            <button
              onClick={() => handleNavigation("/pages/most-watched")}
              className={`hover:text-red-500 ${
                pathname === "/pages/most-watched"
                  ? "text-red-500 font-bold"
                  : "text-white"
              }`}>
              <p className="flex items-center">
                <TvMinimalPlay
                  size={18}
                  className="mr-1"
                />
                Most Watched
              </p>
            </button>
          </div>
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-500 flex items-center justify-center md:justify-start w-full md:w-auto">
              <Heart
                size={18}
                className="mr-1"
              />
              Favorites
              <ChevronDown
                size={18}
                className="ml-1"
              />
            </button>
            {isOpen && (
              <div className="absolute left-0 md:left-auto right-0 mt-2 w-full md:w-56 bg-gray-700 rounded-md py-1 z-50 max-h-60 overflow-y-auto scrollbar-hide hide-scrollbar cursor-pointer">
                {favorites.length > 0 ? (
                  favorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="flex items-center p-1 hover:bg-gray-600"
                      onClick={() => handleSelectMovie(favorite)}>
                      <Image
                        width={500}
                        height={750}
                        src={`https://image.tmdb.org/t/p/w200${favorite.poster_path}`}
                        alt={favorite.title}
                        className="w-14 h-20 object-cover rounded md flex-shrink-0"
                      />
                      <p className="ml-2 text-white text-xs flex-grow">
                        {favorite.title}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-center py-2">
                    No favorites added yet
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search movies"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowResults(true)}
              className="bg-gray-700 text-white rounded-full py-1 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
            />
            <Search
              size={18}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {showResults && searchResults.length > 0 && (
              <SearchResults
                results={searchResults}
                onSelect={handleSelectMovie}
                onClose={() => setShowResults(false)}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
