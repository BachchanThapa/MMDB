// ==========================
// Import necessary functions
// ==========================
import { fetchTopMovies } from './modules/api.js';
import { renderTrailers } from './modules/caroussel.js';
import { searchMovies } from './modules/api.js';

// ====================================
// Function to load and display 5 random trailers
// ====================================
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

// ====================================
// Function to load and display the top 20 IMDB movies
// ====================================
async function loadTopMovies() {
    try {
        let movies = await fetchTopMovies(); // Fetch movies
        let topMovies = movies.slice(0, 20); // Get top 20 movies

        const cardContainer = document.getElementById("cardContainer"); // Select movie container

        topMovies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            // Set movie poster or placeholder if missing
            const poster = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";

            // Check if the movie is already in favorites
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            let isFavorite = favorites.includes(movie.imdbID);
            let starClass = isFavorite ? "favorite" : ""; // Apply filled style

            // Add movie details including the favorite button
            movieCard.innerHTML = `
                <button class="favorite-btn ${starClass}" data-imdbid="${movie.imdbID}"></button>
                <img src="${poster}" alt="${movie.Title}" class="movie-poster"/>
                <h3 class="movie-title">${movie.Title}</h3>
            `;
            cardContainer.appendChild(movieCard);
        });

        // Attach event listeners to favorite buttons
        document.querySelectorAll(".favorite-btn").forEach(button => {
            button.addEventListener("click", toggleFavorite);
        });
    } catch (error) {
        console.error("Error loading top movies:", error);
    }
}

// ====================================
// Function to toggle favorite status
// ====================================
function toggleFavorite(event) {
    let imdbID = event.target.dataset.imdbid;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(imdbID)) {
        favorites = favorites.filter(id => id !== imdbID); // Remove from favorites
        event.target.classList.remove("favorite"); // Change to outline star
    } else {
        favorites.push(imdbID); // Add to favorites
        event.target.classList.add("favorite"); // Change to yellow filled star
    }

    localStorage.setItem("favorites", JSON.stringify(favorites)); // Save to localStorage
}

// ==========================
// Run the functions only on index.html
// ==========================
if (window.location.pathname.includes("index.html")) {
    loadTrailers();
    loadTopMovies();
}

// ==========================
// Function to handle search submission
// ==========================

// Select search form elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const suggestionBox = document.getElementById("suggestionBox"); // Ensure this exists in HTML

function handleSearch(event) {
    event.preventDefault(); // Prevent page reload

    const query = searchInput.value.trim(); // Get search input
    if (!query) {
        alert("Please enter a movie name"); // Alert if empty search
        return;
    }

    // Redirect to search page with query in URL
    window.location.href = `search.html?query=${encodeURIComponent(query)}`;
}

// Attach event listener to search form
if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
}

// ==========================
// Function to load search results on search.html
// ==========================
async function loadSearchResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query"); // Get search query from URL

    if (!query) return; // Exit if no query

    const cardContainer = document.getElementById("cardContainer");

    try {
        const movies = await searchMovies(query); // Fetch movies from OMDB API

        if (!movies || movies.length === 0) {
            cardContainer.innerHTML = "<p>No results found.</p>"; // Handle no results
            return;
        }

        // Display search results
        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            // Set poster or placeholder if missing
            const poster = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";

            // Check if movie is in favorites
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            let isFavorite = favorites.includes(movie.imdbID);
            let starClass = isFavorite ? "favorite" : ""; // Apply filled style

            movieCard.innerHTML = `
                <button class="favorite-btn ${starClass}" data-imdbid="${movie.imdbID}"></button>
                <img src="${poster}" alt="${movie.Title}" class="movie-poster"/>
                <h3 class="movie-title">${movie.Title}</h3>
            `;
            cardContainer.appendChild(movieCard);
        });

        // Attach event listeners to favorite buttons
        document.querySelectorAll(".favorite-btn").forEach(button => {
            button.addEventListener("click", toggleFavorite);
        });
    } catch (error) {
        console.error("Error loading search results:", error);
    }
}

// ==========================
// Function to show search suggestions dynamically
// ==========================
async function showSuggestions() {
    const query = searchInput.value.trim().toLowerCase(); // Get user input

    if (query.length < 1) {
        suggestionBox.innerHTML = ""; // Clear suggestions if input is too short
        suggestionBox.style.display = "none"; // Hide suggestions box
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=144f166d&s=${query}`);
        const data = await response.json();

        if (!data.Search) {
            suggestionBox.innerHTML = "<p class='no-suggestions'>No suggestions found</p>";
            suggestionBox.style.display = "block"; // Show "No Suggestions Found"
            return;
        }

        // ✅ Only show movies that **START** with the query letters
        const filteredMovies = data.Search.filter(movie =>
            movie.Title.toLowerCase().startsWith(query) // Filter titles that start with input
        );

        if (filteredMovies.length === 0) {
            suggestionBox.innerHTML = "<p class='no-suggestions'>No suggestions found</p>";
            suggestionBox.style.display = "block";
            return;
        }

        // Generate a list of clickable suggestions
        suggestionBox.innerHTML = filteredMovies
            .map(movie => `
                <div class="suggestion-item" data-imdbid="${movie.imdbID}">
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg"}" alt="${movie.Title}" class="suggestion-poster"/>
                    <span>${movie.Title} (${movie.Year})</span>
                </div>
            `)
            .join("");

        suggestionBox.style.display = "block"; // Show suggestions

        // Add click event listeners to suggestions
        document.querySelectorAll(".suggestion-item").forEach(item => {
            item.addEventListener("click", () => {
                window.location.href = `movie.html?imdbID=${item.dataset.imdbid}`; // Redirect to movie page
            });
        });

    } catch (error) {
        console.error("Error fetching search suggestions:", error);
    }
}

// ==========================
// Attach event listener for live search
// ==========================
if (searchInput) {
    searchInput.addEventListener("input", showSuggestions);
}

// ==========================
// Run search function only on search.html
// ==========================
if (window.location.pathname.includes("search.html")) {
    loadSearchResults();
}
