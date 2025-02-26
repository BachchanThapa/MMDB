// ==========================
// 🎬 API Helper Functions
// ==========================

// OMDB API Key
const OMDB_API_KEY = "144f166d";

// Fetch top recommended movies from a custom API
export async function fetchTopMovies() {
    try {
        const response = await fetch("https://santosnr6.github.io/Data/favoritemovies.json");

        if (!response.ok) {
            throw new Error("Failed to fetch movie data");
        }

        return await response.json(); // Return movie list

    } catch (error) {
        console.error("Error fetching movies:", error);
        return []; // Return an empty array on error
    }
}

// ==========================
// 🔍 Search Movies by Name (OMDB API)
// ==========================
export async function searchMovies(query) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`);

        if (!response.ok) {
            throw new Error("Failed to fetch search results");
        }

        const data = await response.json();

        return data.Response === "True" ? data.Search : []; // Return search results or empty list

    } catch (error) {
        console.error("Error searching movies:", error);
        return []; // Return an empty array on error
    }
}

// ==========================
// 🎬 Fetch Movie Details by IMDb ID
// ==========================
export async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`);
        const data = await response.json();

        return data.Response === "True" ? data : null; // Return movie details or null

    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null; // Return null on error
    }
}
