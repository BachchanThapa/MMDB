// Function to fetch top movies from API
export async function fetchTopMovies() {
    try {
        const response = await fetch('https://santosnr6.github.io/Data/favoritemovies.json');
        if (!response.ok) {
            throw new Error("Failed to fetch movie data");
        }
        return await response.json(); // Return movie data
    } catch (error) {
        console.error("Error fetching movies:", error);
        return []; // Return empty array in case of an error
    }
}


// OMDB API Key /////////////////////////////////////////////////////////////////////////
const OMDB_API_KEY = "144f166d"; 

// Function to search movies from OMDB API
export async function searchMovies(query) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch search results");
        }

        const data = await response.json();
        if (data.Response === "False") {
            return []; // Return empty array if no results
        }

        return data.Search; // Return search results
    } catch (error) {
        console.error("Error searching movies:", error);
        return []; // Return empty array on error
    }
}

// ============================
// 🎬 Fetch Movie Details by IMDb ID
// ============================
export async function fetchMovieDetails(imdbID) {
    const OMDB_API_KEY = "144f166d"; // Your OMDB API Key
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`);
        if (!response.ok) {
            throw new Error("Failed to fetch movie details");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
}