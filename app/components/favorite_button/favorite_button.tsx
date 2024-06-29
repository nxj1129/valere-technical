import React from 'react';
import { Heart } from "lucide-react";
import { useFavorites } from '@/app/services/favorites_context';

interface FavoriteButtonProps {
  movie: Movie;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movie }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const isFavorite = favorites.some(fav => fav.id === movie.id);

  return (
    <button 
      className="p-1"
      onClick={handleFavoriteClick}
    >
      <Heart 
        size={20} 
        className={`transition-colors duration-200 ${
          isFavorite ? 'text-red-500 fill-red-500' : 'text-white hover:text-red-500'
        }`} 
      />
    </button>
  );
};

export default FavoriteButton;