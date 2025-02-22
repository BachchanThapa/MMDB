// Import fetchMovieDetails from the API module (adjust the path as needed)
import { fetchMovieDetails } from "./api.js";

/**
 * Toggle the favorite status for a movie on the favorites page.
 * When a movie is unfavorited, remove its card from the display.
 */
export function toggleFavorite(event) {
  const imdbID = event.target.dataset.imdbid;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // If the movie is already in favorites, remove it.
  if (favorites.includes(imdbID)) {
    favorites = favorites.filter(id => id !== imdbID);
    event.target.classList.remove("favorite");
    // Remove the movie card element from the DOM.
    event.target.closest(".movie-card").remove();
  } else {
    // (Typically on favorites page you won't add new favorites,
    // but this branch is here for completeness.)
    favorites.push(imdbID);
    event.target.classList.add("favorite");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

/**
 * Load favorite movies and display them as cards.
 */
export async function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = ""; // Clear any existing content

  // If there are no favorites, show a message.
  if (favorites.length === 0) {
    cardContainer.innerHTML = "<p>No favorite movies yet.</p>";
    return;
  }

  // Loop through favorite IMDb IDs and fetch details for each movie.
  for (const imdbID of favorites) {
    try {
      const movie = await fetchMovieDetails(imdbID);
      if (movie) {
        // Create a movie card element.
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        // Use the movie poster if available, otherwise use a placeholder.
        const poster = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";

        // Build the inner HTML for the movie card.
        movieCard.innerHTML = `
          <button class="favorite-btn favorite" data-imdbid="${movie.imdbID}"></button>
          <img src="${poster}" alt="${movie.Title}" class="movie-poster"/>
          <h3 class="movie-title">
            <a href="movie.html?imdbID=${movie.imdbID}">${movie.Title}</a>
          </h3>
        `;
        cardContainer.appendChild(movieCard);
      }
    } catch (error) {
      console.error("Error loading favorite movie:", error);
    }
  }

  // Attach event listeners to the favorite buttons for toggling.
  document.querySelectorAll(".favorite-btn").forEach(button => {
    button.addEventListener("click", toggleFavorite);
  });
}
