// ============================
// 🎬 Movie Details Fetch & Display
// ============================

import { fetchMovieDetails } from "../modules/api.js"; // ✅ Corrected Import Path

// ✅ Ensure script runs
console.log("🔹 movieDetails.js is running...");

// Function to get movie ID from URL
function getMovieIDFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("imdbID");
}






// Function to display movie details
async function displayMovieDetails() {
    const movieID = getMovieIDFromURL();
    console.log("Movie ID from URL:", movieID); // ✅ Debugging step

    if (!movieID) {
        document.getElementById("movieInformation").innerHTML = "<p>Movie not found.</p>";
        return;
    }

    try {
        const movie = await fetchMovieDetails(movieID);
        console.log("Fetched Movie Data:", movie); // ✅ Debugging API response

        if (!movie || movie.Response === "False") {
            document.getElementById("movieInformation").innerHTML = "<p>Movie details not available.</p>";
            return;
        }

        // ✅ Inject Correct HTML Structure
        document.getElementById("movieInformation").innerHTML = `
        <div class="movie-detail-wrapper">
            <div class="movie-left">
                <div class="movie-title-container">  <!-- ✅ New container for title -->
                    <h1 class="movie-title">${movie.Title}</h1>
                </div>
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg"}" 
                     alt="${movie.Title}" class="movie-detail-poster">
            </div>
            
            <div class="movie-info">
                <p class="movie-stats">
                    <strong>Rated:</strong> ${movie.Rated} | <strong>Genre:</strong> ${movie.Genre} | 
                    <strong>Runtime:</strong> ${movie.Runtime} | <strong>Released:</strong> ${movie.Released}
                </p>
                <p class="movie-rating"><strong>Ratings:</strong> ${movie.imdbRating}/10</p>
    
                <hr class="section-divider">  <!-- ✅ White Line Above Plot -->
    
                <h3 class="section-title">Plot</h3>
                <p class="movie-plot">${movie.Plot}</p>
    
                <hr class="section-divider">  <!-- ✅ White Line Below Plot -->
    
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Writer:</strong> ${movie.Writer}</p>
                <p><strong>Actors:</strong> ${movie.Actors}</p>
            </div>
        </div>
    `;
    






    } catch (error) {
        console.error("Error displaying movie details:", error);
        document.getElementById("movieInformation").innerHTML = "<p>Error loading movie details.</p>";
    }
}

// ✅ Run function when movie.html loads
document.addEventListener("DOMContentLoaded", displayMovieDetails);
