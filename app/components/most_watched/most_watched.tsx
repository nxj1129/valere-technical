'use client'

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

const MostWatched: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const apiKey = process.env.TMDB_API_KEY;


  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchMovies = useCallback(async (pageNumber: number) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
      if (selectedYear) url += `&primary_release_year=${selectedYear}`;
      if (selectedGenre) url += `&with_genres=${selectedGenre}`;
      if (selectedRating) url += `&vote_average.gte=${selectedRating}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      console.log(data);

      if (!data.results || data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevMovies) => 
          pageNumber === 1 ? data.results : [...prevMovies, ...data.results]
        );
        setHasMore(data.page < data.total_pages);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedGenre, selectedRating, apiKey]);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, []);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1);
  }, [selectedYear, selectedGenre, selectedRating, fetchMovies]);

 // Fetch more movies when scrolling to the bottom
 useEffect(() => {
  if (inView && !isLoading) {
    fetchMovies(page);
  }
}, [inView, isLoading, fetchMovies, page]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className='flex flex-row mx-auto'>
        <h1 className="text-3xl font-bold mb-6">Most Watched Movies</h1>
        <div className="mb-4 flex flex-row ml-6 items-baseline">
        <label className="block text-white mx-3">Year:</label>
        <select value={selectedYear} onChange={handleYearChange} className="mb-4 p-2 bg-gray-800 text-white rounded hide-scrollbar scrollbar-hide">
          <option value="">All</option>
          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label className="block text-white mx-3">Genre:</label>
        <select value={selectedGenre} onChange={handleGenreChange} className="mb-4 p-2 bg-gray-800 text-white rounded hide-scrollbar scrollbar-hide">
          <option value="">All</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>

        <label className="block text-white mx-3">Rating:</label>
        <select value={selectedRating} onChange={handleRatingChange} className="mb-4 p-2 bg-gray-800 text-white rounded hide-scrollbar scrollbar-hide">
          <option value="">All</option>
          {Array.from({ length: 10 }, (_, i) => (i + 1).toFixed(1)).map(rating => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
      </div>
        </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link href={`/pages/${movie.id}/movie-details`} key={movie.id}>
            <div key={movie.id} 
               className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer" 
               >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h2 className="text-white text-lg font-semibold">{movie.title}</h2>
            </div>
          </div>
          </Link>
          
        ))}
      </div>
      {isLoading && <div className="text-center mt-4">Loading more movies...</div>}
      {!hasMore && <div className="text-center mt-4">No more movies to load</div>}
      <div ref={ref} style={{ height: '20px' }}></div>
    </div>
  );
};

export default MostWatched;