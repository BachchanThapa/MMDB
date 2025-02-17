// Import necessary functions from modules
import { fetchTopMovies } from './modules/api.js';
import { renderTrailers } from './modules/caroussel.js';

// Function to load and display 5 random trailers
async function loadTrailers() {
    try {
        let movies = await fetchTopMovies(); // Fetch movies from API
        let shuffledMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 5); // Pick 5 random movies

        shuffledMovies.forEach((movie, index) => {
            renderTrailers(movie, index + 1); // Render each trailer
        });
    } catch (error) {
        console.error("Error loading trailers:", error);
    }
}

// Function to load and display the top 20 IMDB movies
async function loadTopMovies() {
    try {
        let movies = await fetchTopMovies(); // Fetch movies
        let topMovies = movies.slice(0, 20); // Get top 20 movies

        const cardContainer = document.getElementById("cardContainer"); // Select movie container

        topMovies.forEach(movie => {
            // Create a movie card element
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            // Set movie poster or placeholder if missing
            const poster = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";

            // Add movie details
            movieCard.innerHTML = `
                <img src="${poster}" alt="${movie.Title}" class="movie-poster"/>
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-rating">⭐ ${movie.imdbRating}</p>
            `;
            cardContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error("Error loading top movies:", error);
    }
}

// Run the functions only on index.html
if (window.location.pathname.includes("index.html")) {
    loadTrailers();
    loadTopMovies();
}
