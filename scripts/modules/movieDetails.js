// Function to fetch t// ============================
// 🎬 Movie Details Fetch & Display
// ============================

import { fetchMovieDetails } from "../modules/api.js"; 

// Function to get movie ID from URL
function getMovieIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("imdbID");
}

// Function to display movie details
async function displayMovieDetails() {
    const movieID = getMovieIDFromURL(); // Get IMDb ID from URL
    if (!movieID) {
        document.getElementById("movieInformation").innerHTML = "<p>Movie not found.</p>";
        return;
    }

    try {
        const movie = await fetchMovieDetails(movieID); // Fetch movie details

        if (!movie || movie.Response === "False") {
            document.getElementById("movieInformation").innerHTML = "<p>Movie details not available.</p>";
            return;
        }

        // Set movie poster or placeholder
        const poster = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";

        // Check if the movie is already in favorites
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let isFavorite = favorites.includes(movie.imdbID);
        let starClass = isFavorite ? "favorite" : "";

        // Movie Details Template
        document.getElementById("movieInformation").innerHTML = `
            <div class="movie-container">
                <img src="${poster}" alt="${movie.Title}" class="movie-poster-large" />
                <div class="movie-info">
                    <h2>${movie.Title}</h2>
                    <p><strong>Rated:</strong> ${movie.Rated} &nbsp; | &nbsp; <strong>Genre:</strong> ${movie.Genre} &nbsp; | &nbsp; <strong>Runtime:</strong> ${movie.Runtime} &nbsp; | &nbsp; <strong>Released:</strong> ${movie.Released}</p>
                    <p><strong>Ratings:</strong> ${movie.imdbRating}/10</p>

                    <h3>Plot</h3>
                    <p>${movie.Plot}</p>

                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <p><strong>Writer:</strong> ${movie.Writer}</p>
                    <p><strong>Actors:</strong> ${movie.Actors}</p>

                    <button class="favorite-btn ${starClass}" data-imdbid="${movie.imdbID}"></button>
                </div>
            </div>
        `;

        // Attach event listener for favorite button
        document.querySelector(".favorite-btn").addEventListener("click", toggleFavorite);
    } catch (error) {
        console.error("Error displaying movie details:", error);
    }
}

// Function to toggle favorite status
function toggleFavorite(event) {
    let imdbID = event.target.dataset.imdbid;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(imdbID)) {
        favorites = favorites.filter(id => id !== imdbID); // Remove from favorites
        event.target.classList.remove("favorite");
    } else {
        favorites.push(imdbID);
        event.target.classList.add("favorite");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Run function when movie.html loads
document.addEventListener("DOMContentLoaded", displayMovieDetails);
