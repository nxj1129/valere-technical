'use client';

import MostWatched from "@/app/components/most_watched/most_watched";
import Navbar from "@/app/components/navbar/navbar";
import { FavoritesProvider } from '@/app/services/favorites_context';


export default function MostWatchedPage() {

    return(
      <FavoritesProvider>
      <div className="bg-black-100 min-h-screen">
      <Navbar />
      <MostWatched />
      </div>
      </FavoritesProvider>
    );
}