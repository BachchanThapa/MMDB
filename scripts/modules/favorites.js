// ==========================
// 🎬 Import API Helper
// ==========================
import { fetchMovieDetails } from "./api.js";

// ==========================
// ⭐ Toggle Favorite Movie
// ==========================
export function toggleFavorite(event) {
    const imdbID = event.target.dataset.imdbid;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(imdbID)) {
        favorites = favorites.filter(id => id !== imdbID); // Remove from favorites
        event.target.classList.remove("favorite");
        event.target.closest(".movie-card").remove(); // Remove the movie card from the UI
    } else {
        favorites.push(imdbID); // Add to favorites
        event.target.classList.add("favorite");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// ==========================
// 🎬 Load and Display Favorite Movies
// ==========================
export async function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = ""; // Clear any existing content

    if (favorites.length === 0) {
        cardContainer.innerHTML = "<p>No favorite movies yet.</p>"; // Show message if empty
        return;
    }

    // Fetch and display favorite movies
    for (const imdbID of favorites) {
        try {
            const movie = await fetchMovieDetails(imdbID);
            if (movie) {
                const movieCard = createMovieCard(movie);
                cardContainer.appendChild(movieCard);
            }
        } catch (error) {
            console.error("Error loading favorite movie:", error);
        }
    }

    // Attach event listeners to favorite buttons
    document.querySelectorAll(".favorite-btn").forEach(button => {
        button.addEventListener("click", toggleFavorite);
    });
}

// ==========================
// 🎬 Create Movie Card for Favorites
// ==========================
function createMovieCard(movie) {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const poster = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";

    card.innerHTML = `
        <button class="favorite-btn favorite" data-imdbid="${movie.imdbID}" aria-label="Toggle favorite for ${movie.Title}">
            
        </button>
        <img src="${poster}" alt="${movie.Title}" class="movie-poster"/>
        <h3 class="movie-title">
            <a href="movie.html?imdbID=${movie.imdbID}">${movie.Title}</a>
        </h3>
    `;

    return card;
}
