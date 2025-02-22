// ============================
// 🎬 Movie Details Fetch & Display
// ============================

import { fetchMovieDetails } from "../modules/api.js"; // ✅ Import API module

// ============================
// 🔎 Helper Function: Extract Movie ID from URL
// ============================
function getMovieIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("imdbID");
}

// ============================
// 🎬 Function to Format Plot (Show "More" Toggle)
// ============================
function formatPlotText(plot) {
    const maxWords = 50; // ✅ Limit to first 50 words
    const words = plot.split(" ");

    if (words.length > maxWords) {
        const shortPlot = words.slice(0, maxWords).join(" ") + "...";
        return `
            <span class="short-plot">${shortPlot}</span>
            <span class="full-plot hidden">${plot}</span>
            <a href="#" class="more-link" data-expanded="false">Read more</a>
        `;
    }
    return plot; // ✅ If short, return full text
}

// ============================
// 🎬 Fetch and Display Movie Details
// ============================
async function displayMovieDetails() {
    const movieID = getMovieIDFromURL();
    console.log("Movie ID from URL:", movieID); // ✅ Debugging step

    // ✅ If no movie ID found, show error
    if (!movieID) {
        document.getElementById("movieInformation").innerHTML = "<p>Movie not found.</p>";
        return;
    }

    try {
        // ✅ Fetch movie details from API
        const movie = await fetchMovieDetails(movieID);
        console.log("Fetched Movie Data:", movie); // ✅ Debugging API response

        // ✅ If movie data is not available, show error
        if (!movie || movie.Response === "False") {
            document.getElementById("movieInformation").innerHTML = "<p>Movie details not available.</p>";
            return;
        }

        // ✅ Retrieve favorites from localStorage
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let isFavorite = favorites.includes(movie.imdbID);
        let starClass = isFavorite ? "favorite" : ""; // ✅ Check if movie is in favorites

        // ✅ Inject Correct HTML Structure
        document.getElementById("movieInformation").innerHTML = `
        <div class="movie-detail-wrapper">
            <!-- ⭐ FAVORITE BUTTON (Inside Wrapper, Top-Right) -->
            <div class="favorite-container">
                <button class="favorite-btn ${starClass}" id="favoriteButton" data-imdbid="${movie.imdbID}"></button>
            </div>

            <!-- 🎬 LEFT SIDE: Movie Poster & Title -->
            <div class="movie-left">
                <h1 class="movie-detail-title">${movie.Title}</h1>
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg"}" 
                     alt="${movie.Title}" class="movie-detail-poster">
            </div>

            <!-- 📜 RIGHT SIDE: Movie Info -->
            <div class="movie-info">
                <hr class="section-divider"> <!-- ✅ Divider for better layout -->
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

                <hr class="section-divider"> <!-- ✅ NEW: Final line before Director/Writer/Actors -->

                <!-- ✅ Structured layout for proper alignment -->
                <div class="movie-meta">
                    <div class="meta-item"><strong>Director:</strong> <span>${movie.Director}</span></div>
                    <div class="meta-item"><strong>Writer:</strong> <span>${movie.Writer}</span></div>
                    <div class="meta-item"><strong>Actors:</strong> <span>${movie.Actors}</span></div>
                </div>
            </div>
        </div>
    `;

        // ✅ Attach event listener for favorite button
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
        // ✅ Remove from favorites
        favorites = favorites.filter(id => id !== imdbID);
        event.target.classList.remove("favorite"); // ✅ Update UI
    } else {
        // ✅ Add to favorites
        favorites.push(imdbID);
        event.target.classList.add("favorite"); // ✅ Update UI
    }

    // ✅ Save updated favorites list to localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ============================
// Toggle "Read more / Read less" for Plot
// ============================
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("more-link")) {
        event.preventDefault();
        const moreLink = event.target;
        const isExpanded = moreLink.getAttribute("data-expanded") === "true";
        // The structure is: [short-plot] [full-plot] [more-link]
        const shortPlotElem = moreLink.previousElementSibling.previousElementSibling;
        const fullPlotElem = moreLink.previousElementSibling;

        if (!isExpanded) {
            shortPlotElem.classList.add("hidden"); // Hide short plot
            fullPlotElem.classList.remove("hidden"); // Show full plot
            moreLink.textContent = " Read less";
            moreLink.setAttribute("data-expanded", "true");
        } else {
            shortPlotElem.classList.remove("hidden"); // Show short plot
            fullPlotElem.classList.add("hidden"); // Hide full plot
            moreLink.textContent = " Read more";
            moreLink.setAttribute("data-expanded", "false");
        }
    }
});

// ✅ Run function when `movie.html` loads
document.addEventListener("DOMContentLoaded", displayMovieDetails);
