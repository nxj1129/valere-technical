'use client';

import { useState, useEffect } from "react";
import FavoriteButton from "../favorite_button/favorite_button";

const MovieDetails: React.FC<any> = ({ params }) => { 

  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = process.env.TMDB_API_KEY;
  const movieId = params.id;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCast = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
              }
              const data = await response.json();
              console.log(data);
              setCast(data.cast);
        } catch (error) {
          console.error('Error fetching cast:', error);
        } finally {
            setIsLoading(false);
          }
    }

    if (movieId) {
      fetchMovieDetails();
      fetchCast();
    }
  }, [movieId]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!movie) {
    return <div className="container mx-auto px-4 py-8">Movie not found</div>;
  }

  
    return(
        <div className="container mx-auto px-4 py-8">
        <img className="w-full rounded-lg opacity-70" src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} />

        <div className="flex flex-col md:flex-row pt-5">
            
          <div className="md:w-1/5">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="w-full rounded-lg"
            />
          </div>
          <div className="md:w-2/3 md:pl-8 mt-4 md:mt-0">
            <div className="flex flex-row">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <FavoriteButton movie={movie}/>
            </div>
            <p className="text-gray-300 mb-4">{movie.overview}</p>
            <div className="mb-4">
              <span className="font-semibold">Release Date:</span> {movie.release_date}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Rating:</span> {movie.vote_average.toFixed(1)}/10
            </div>
            <div className="mb-4">
              <span className="font-semibold">Genres:</span>{' '}
              {movie.genres.map((genre: any) => genre.name).join(', ')}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Duration:</span>{' '}
              {movie.runtime} minutes
            </div>
            <div className="mb-4">
              <span className="font-semibold">Country:</span>{' '}
              {movie.production_countries.map((country: any) => country.name).join(', ')}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Cast:</span>{' '}
              {cast?.slice(0, 3).map((members: any) => members.name).join(', ')}
            </div>
          </div>
        </div>
      </div>          
    );
}

export default MovieDetails;