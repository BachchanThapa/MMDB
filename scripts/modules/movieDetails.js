// ============================
// 🎬 Import API Helper
// ============================
import { fetchMovieDetails } from "../modules/api.js";

// ============================
// 🔍 Extract Movie ID from URL
// ============================
function getMovieIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("imdbID");
}

// ============================
// 🎬 Format Plot Text with "Read More" Toggle
// ============================
function formatPlotText(plot) {
    const maxWords = 50;
    const words = plot.split(" ");

    if (words.length > maxWords) {
        return `
            <span class="short-plot">${words.slice(0, maxWords).join(" ")}...</span>
            <span class="full-plot hidden">${plot}</span>
            <a href="#" class="more-link" data-expanded="false">Read more</a>
        `;
    }
    return plot;
}

// ============================
// 🎬 Fetch and Display Movie Details
// ============================
async function displayMovieDetails() {
    const movieID = getMovieIDFromURL();
    if (!movieID) {
        document.getElementById("movieInformation").innerHTML = "<p>Movie not found.</p>";
        return;
    }

    try {
        const movie = await fetchMovieDetails(movieID);
        if (!movie) {
            document.getElementById("movieInformation").innerHTML = "<p>Movie details not available.</p>";
            return;
        }

        // Retrieve favorites from localStorage
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let isFavorite = favorites.includes(movie.imdbID);
        let starClass = isFavorite ? "favorite" : "";

        // Insert Movie Details
        document.getElementById("movieInformation").innerHTML = `
            <div class="movie-detail-wrapper">
                <div class="favorite-container">
                    <button class="favorite-btn ${starClass}" id="favoriteButton" data-imdbid="${movie.imdbID}"></button>
                </div>
                <div class="movie-left">
                    <h1 class="movie-detail-title">${movie.Title}</h1>
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg"}" 
                         alt="${movie.Title}" class="movie-detail-poster">
                </div>
                <div class="movie-info">
                    <hr class="section-divider">
                    <p class="movie-stats">
                        <strong>Rated:</strong> ${movie.Rated} | 
                        <strong>Genre:</strong> ${movie.Genre} | 
                        <strong>Runtime:</strong> ${movie.Runtime} | 
                        <strong>Released:</strong> ${movie.Released}
                    </p>
                    <hr class="section-divider">
                    <p class="movie-rating"><strong>Ratings:</strong> ${movie.imdbRating}/10</p>
                    <hr class="section-divider">
                    <h3 class="section-title">Plot</h3>
                    <p class="movie-plot">${formatPlotText(movie.Plot)}</p>
                    <hr class="section-divider">
                    <div class="movie-meta">
                        <div class="meta-item"><strong>Director:</strong> <span>${movie.Director}</span></div>
                        <div class="meta-item"><strong>Writer:</strong> <span>${movie.Writer}</span></div>
                        <div class="meta-item"><strong>Actors:</strong> <span>${movie.Actors}</span></div>
                    </div>
                </div>
            </div>
        `;

        // Attach favorite button event listener
        document.getElementById("favoriteButton").addEventListener("click", toggleFavorite);

    } catch (error) {
        console.error("Error displaying movie details:", error);
        document.getElementById("movieInformation").innerHTML = "<p>Error loading movie details.</p>";
    }
}

// ============================
// ⭐ Toggle Favorite Movie
// ============================
function toggleFavorite(event) {
    let imdbID = event.target.dataset.imdbid;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(imdbID)) {
        favorites = favorites.filter(id => id !== imdbID);
        event.target.classList.remove("favorite");
    } else {
        favorites.push(imdbID);
        event.target.classList.add("favorite");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ============================
// 📜 Toggle "Read More" for Plot
// ============================
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("more-link")) {
        event.preventDefault();
        const moreLink = event.target;
        const isExpanded = moreLink.getAttribute("data-expanded") === "true";
        const shortPlotElem = moreLink.previousElementSibling.previousElementSibling;
        const fullPlotElem = moreLink.previousElementSibling;

        if (!isExpanded) {
            shortPlotElem.classList.add("hidden");
            fullPlotElem.classList.remove("hidden");
            moreLink.textContent = " Read less";
            moreLink.setAttribute("data-expanded", "true");
        } else {
            shortPlotElem.classList.remove("hidden");
            fullPlotElem.classList.add("hidden");
            moreLink.textContent = " Read more";
            moreLink.setAttribute("data-expanded", "false");
        }
    }
});

// ============================
// 🚀 Run on Page Load
// ============================
document.addEventListener("DOMContentLoaded", displayMovieDetails);
