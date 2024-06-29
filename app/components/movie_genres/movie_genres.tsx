'use client';

import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MovieCarousel from '../movie_carousel/movie_carousel';

const MovieGenres: React.FC = () => {

const [genres, setGenres] = useState<Genre[]>([]);
const [movies, setMovies] = useState<any[]>([]);
const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
const [isOpen, setIsOpen] = useState(false);

const apiKey = process.env.TMDB_API_KEY;



    async function getGenres() {
        const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
        if (!res.ok) {
        throw new Error('Failed to fetch movies by genre');
        }
        const data = await res.json();
        console.log('genres', data)
        return data.genres;
    }



    async function getMoviesByGenre(genreId: number) {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${1}&sort_by=popularity.desc`);
        if (!res.ok) {
          throw new Error('Failed to fetch movies by genre');
        }
        const data = await res.json();
        console.log(data)
        return data.results;
    }

    const handleGenreClick = (genre: Genre) => {
        setSelectedGenre(genre);
        getMoviesByGenre(genre.id).then(data => {
          setMovies(data);
        }).catch(error => {
          console.error('Error fetching top movies for provider:', error);
        });
        setIsOpen(false);  // Close the dropdown
      };



  useEffect(() => {
    getGenres().then(data => {
        setGenres(data || []);
  
        // Find Action genre
        const actionGenre = data.find((genre: Genre) => genre.name === 'Action');
        if (actionGenre) {
          setSelectedGenre(actionGenre);
          getMoviesByGenre(actionGenre.id).then(movies => {
            setMovies(movies);
          }).catch(error => {
            console.error('Error fetching top movies for Netflix:', error);
          });
        }
  
      }).catch(error => {
        console.error('Error fetching watch providers:', error);
      });

  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex flex-row items-center'>
        <h1 className="text-3xl font-bold mb-6">Movies by Genre</h1>
        <div className="relative text-2xl mx-5 mb-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className="text-white hover:text-red-500 flex items-center"
          >
            {selectedGenre?.name || 'Genres'}
            <ChevronDown size={18} className="ml-1" />
          </button>
          {isOpen && (
            <div className="absolute mt-2 w-60 h-48 bg-gray-800 text-white rounded-md shadow-lg py-1 overflow-y-auto hide-scrollbar scrollbar-hide z-50">
            {genres.map((genre) => (
                <p
                  className="text-xl mx-1 cursor-pointer hover:text-red-500"
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                >
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
            <>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                className="w-full h-72 object-cover rounded-lg shadow-md"
              />
              <p className="mt-2 text-sm font-semibold text-center">{movie.title}</p>
            </>
          )}
        />
        )}
      </div>
    </div>
  );
};

export default MovieGenres;