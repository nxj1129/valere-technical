import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface SearchResultsProps {
  results: Movie[];
  onSelect: (movie: Movie) => void;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0) {
          onSelect(results[selectedIndex]);
        } else {
          router.push('/search');
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onSelect, onClose, router]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="absolute z-20 w-full bg-gray-800 rounded-md shadow-lg mt-1 max-h-96 overflow-y-auto hide-scrollbar">
      {results.map((movie, index) => (
        <div
          key={movie.id}
          ref={(el: HTMLDivElement | null) => {
            resultRefs.current[index] = el;
          }}
          className={`flex items-center p-2 cursor-pointer ${
            index === selectedIndex ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => onSelect(movie)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
            alt={movie.title}
            className="w-12 h-18 object-cover rounded mr-2"
          />
          <span className="text-white">{movie.title}</span>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;