// ==========================
// 🎬 Create a Movie Card Element
// ==========================
// This function generates a movie card with an image, title, and link to details.
export function createMovieCard(movie) {
  // Create main card container
  const card = document.createElement("div");
  card.classList.add("movie-card");

  // Create movie poster
  const img = document.createElement("img");
  img.src = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg"; // Use placeholder if no poster
  img.alt = movie.Title; // Accessibility for screen readers
  img.classList.add("movie-poster");

  // Create movie title container
  const title = document.createElement("h3");
  title.classList.add("movie-title");

  // Create clickable title link
  const titleLink = document.createElement("a");
  titleLink.href = `movie.html?imdbID=${movie.imdbID}`; // Links to movie details page
  titleLink.textContent = movie.Title; // Displays movie title
  titleLink.classList.add("movie-link");

  // Append elements together
  title.appendChild(titleLink); // Add link inside title
  card.appendChild(img); // Add image to card
  card.appendChild(title); // Add title to card

  return card; // Return the complete movie card
}
