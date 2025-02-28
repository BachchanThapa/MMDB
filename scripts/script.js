// ==========================
// 🌟 Import necessary functions
// ==========================
import { fetchTopMovies, searchMovies } from './modules/api.js';
import { renderTrailers } from './modules/caroussel.js';

// ==========================
// 🎬 Load and Display 5 Random Trailers
// ==========================
async function loadTrailers() {
    try {
        let movies = await fetchTopMovies(); // Fetch movie list
        let randomMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 5); // Pick 5 random movies

        // Render each trailer
        randomMovies.forEach((movie, index) => renderTrailers(movie, index + 1));
    } catch (error) {
        console.error("Error loading trailers:", error);
    }
}

// ==========================
// 🎬 Load and Display Top 20 Movies
// ==========================
async function loadTopMovies() {
    try {
        let movies = await fetchTopMovies(); // Fetch movies
        let topMovies = movies.slice(0, 20); // Get the top 20 movies

        const cardContainer = document.getElementById("cardContainer"); // Movie container

        topMovies.forEach(movie => {
            const movieCard = createMovieCard(movie); // Create a movie card
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

// ==========================
// 🎬 Create Movie Card (Used for Top Movies & Search Results)
// ==========================
function createMovieCard(movie) {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    // Set movie poster or placeholder
    const poster = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";

    // Check if movie is in favorites
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let isFavorite = favorites.includes(movie.imdbID);
    let starClass = isFavorite ? "favorite" : "";

    card.innerHTML = `
        <button class="favorite-btn ${starClass}" data-imdbid="${movie.imdbID}" aria-label="Toggle favorite for ${movie.Title}">
            
        </button>

        <img src="${poster}" alt="${movie.Title}" class="movie-poster"/>
        <h3 class="movie-title"><a href="movie.html?imdbID=${movie.imdbID}">${movie.Title}</a></h3>
    `;

    return card;
}

// ==========================
// ⭐ Toggle Favorite Movie
// ==========================
function toggleFavorite(event) {
    let imdbID = event.target.dataset.imdbid;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(imdbID)) {
        favorites = favorites.filter(id => id !== imdbID); // Remove from favorites
        event.target.classList.remove("favorite"); // Update UI
    } else {
        favorites.push(imdbID); // Add to favorites
        event.target.classList.add("favorite"); // Update UI
    }

    localStorage.setItem("favorites", JSON.stringify(favorites)); // Save updated list
}


// ==========================
// 🔍 Handle Search Submission
// ==========================
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

function handleSearch(event) {
    event.preventDefault(); // Prevent page reload

    const query = searchInput.value.trim(); // Get search input

    try {
        if (!query) {
            throw new Error("Please Write the Movie Name here!"); // Throws an error if input is empty
        }

        // If input is valid, reset styles and go to search results
        searchInput.style.border = ""; 
        searchInput.style.color = ""; 
        searchInput.placeholder = "Search for a movie..."; 

        // Redirect to search page with query
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;

    } catch (error) {
        // Display error inside search box in red
        searchInput.style.border = "3px solid red"; 
        searchInput.value = ""; // Clears the input
        searchInput.placeholder = error.message; // Shows error message in red

        
        searchInput.style.setProperty("caret-color", "black", "important");
    }
}

// Attach event listener to search form
if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
}


// ==========================
// 🔍 Load Search Results on search.html
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
            const movieCard = createMovieCard(movie);
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
// 📌 Live Search Suggestions
// ==========================
const suggestionBox = document.getElementById("suggestionBox");

async function showSuggestions() {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length < 1) {
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=144f166d&s=${query}`);
        const data = await response.json();

        if (!data.Search) {
            suggestionBox.innerHTML = "<p class='no-suggestions'>No suggestions found</p>";
            suggestionBox.style.display = "block";
            return;
        }

        // Filter results that start with the typed letters
        const filteredMovies = data.Search.filter(movie =>
            movie.Title.toLowerCase().startsWith(query)
        );

        if (filteredMovies.length === 0) {
            suggestionBox.innerHTML = "<p class='no-suggestions'>No suggestions found</p>";
            suggestionBox.style.display = "block";
            return;
        }

        // Create clickable suggestions
        suggestionBox.innerHTML = filteredMovies
            .map(movie => `
                <div class="suggestion-item" data-imdbid="${movie.imdbID}">
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg"}" 
                         alt="${movie.Title}" class="suggestion-poster"/>
                    <span>${movie.Title} (${movie.Year})</span>
                </div>
            `)
            .join("");

        suggestionBox.style.display = "block";

        // Add click event listeners to suggestions
        document.querySelectorAll(".suggestion-item").forEach(item => {
            item.addEventListener("click", () => {
                window.location.href = `movie.html?imdbID=${item.dataset.imdbid}`;
            });
        });

    } catch (error) {
        console.error("Error fetching search suggestions:", error);
    }
}

// Attach event listener for live search
if (searchInput) {
    searchInput.addEventListener("input", showSuggestions);
}

// ==========================
// 📌 Run Functions Based on Current Page
// ==========================
if (window.location.pathname.includes("index.html")) {
    loadTrailers();
    loadTopMovies();
}

if (window.location.pathname.includes("search.html")) {
    loadSearchResults();
}

// ✅ Load favorites dynamically
if (window.location.pathname.includes("favorites.html")) {
    import("./modules/favorites.js")
        .then(module => module.loadFavorites())
        .catch(error => console.error("Error loading favorites module:", error));
}
