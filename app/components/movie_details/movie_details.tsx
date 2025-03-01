"use client";

import { useState, useEffect } from "react";
import FavoriteButton from "../favorite_button/favorite_button";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCastMembers, getMovieDetails } from "@/app/services/tmdb_api";
import Image from "next/image";

const MovieDetails: React.FC<any> = ({ params }) => {
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/";
  const movieId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [movieData, castData] = await Promise.all([
          getMovieDetails(movieId),
          getCastMembers(movieId),
        ]);
        setMovie(movieData);
        setCast(castData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleBack = () => {
    router.push(fromPath);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!movie) {
    return <div className="container mx-auto px-4 py-8">Movie not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 text-white hover:text-red-500 flex-row">
        <p className="flex items-center">
          <ArrowLeft size={18} /> Back
        </p>
      </button>
      <Image
        width={900}
        height={1000}
        alt="banner"
        className="w-full rounded-lg opacity-70"
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
      />

      <div className="flex flex-col md:flex-row pt-5">
        <div className="md:w-1/5">
          <Image
            width={500}
            height={750}
            alt="poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-full rounded-lg"
          />
        </div>
        <div className="md:w-2/3 md:pl-8 mt-4 md:mt-0">
          <div className="flex flex-row">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <div className="ml-3 mt-1">
              <FavoriteButton movie={movie} />
            </div>
          </div>
          <p className="text-gray-300 mb-4">{movie.overview}</p>
          <div className="mb-4">
            <span className="font-semibold">Release Date:</span>{" "}
            {formatReleaseDate(movie.release_date)}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Rating:</span>{" "}
            {movie.vote_average.toFixed(1)}/10
          </div>
          <div className="mb-4">
            <span className="font-semibold">Genres:</span>{" "}
            {movie.genres.map((genre: any) => genre.name).join(", ")}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Duration:</span> {movie.runtime}{" "}
            minutes
          </div>
          <div className="mb-4">
            <span className="font-semibold">Country:</span>{" "}
            {movie.production_countries
              .map((country: any) => country.name)
              .join(", ")}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Cast:</span>{" "}
            {cast
              ?.slice(0, 3)
              .map((members: any) => members.name)
              .join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
