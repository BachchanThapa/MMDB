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
