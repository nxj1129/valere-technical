import MovieDetails from "@/app/components/movie_details/movie_details";
import Navbar from "@/app/components/navbar/navbar";
import { FavoritesProvider } from "@/app/services/favorites_context";

export default function MovieDetailsPage({ params }: { params: { id: string } }) {
    return (
        <FavoritesProvider>
        <div className="bg-black-100 min-h-screen">
        <Navbar/>
        <MovieDetails params={params}/>
        </div>
        </FavoritesProvider>
    );
}