"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteMovies");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => [...prev, movie]);
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== movieId));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
