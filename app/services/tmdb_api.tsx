const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const READ_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

const headers = {
  Authorization: `Bearer ${READ_ACCESS_TOKEN}`,
  accept: "application/json",
};

async function fetchFromTMDB(endpoint: string) {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, { headers });
  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

export async function getNowPlaying(): Promise<Movie[]> {
  const data = await fetchFromTMDB("/movie/now_playing?language=en-US&page=1");
  return data.results;
}

export async function getWatchProviders(): Promise<Provider[]> {
  const data = await fetchFromTMDB(
    "/watch/providers/movie?language=en-US&watch_region=HR"
  );
  return data.results;
}

export async function getTopMoviesForProvider(
  providerId: number
): Promise<Movie[]> {
  const data = await fetchFromTMDB(
    `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_watch_providers=${providerId}&watch_region=HR`
  );
  return data.results.slice(0, 3);
}

export async function getMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB("/movie/now_playing?language=en-US&page=1");
  return data.results;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];
  const data = await fetchFromTMDB(
    `/search/movie?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`
  );
  return data.results;
}

export async function getGenres(): Promise<Genre[]> {
  const data = await fetchFromTMDB("/genre/movie/list?language=en-US");
  return data.genres;
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  const data = await fetchFromTMDB(
    `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`
  );
  return data.results;
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  const data = await fetchFromTMDB(`/movie/${movieId}?language=en-US`);
  return data;
}

export async function getCastMembers(movieId: number): Promise<CastMember[]> {
  const data = await fetchFromTMDB(`/movie/${movieId}/credits?language=en-US`);
  return data.cast;
}

export async function discoverMovies(options: {
  page?: number;
  year?: string;
  genre?: string;
  rating?: string;
}): Promise<{
  results: Movie[];
  page: number;
  total_pages: number;
}> {
  const { page = 1, year, genre, rating } = options;
  let endpoint = `/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
  if (year) endpoint += `&primary_release_year=${year}`;
  if (genre) endpoint += `&with_genres=${genre}`;
  if (rating) endpoint += `&vote_average.gte=${rating}`;

  return fetchFromTMDB(endpoint);
}
