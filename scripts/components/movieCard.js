// Create a movie card component to display movie details

export function createMovieCard(movie) {
  // Create a container div for the movie card
  const card = document.createElement("div");
  card.classList.add("movie-card");

  // Create an image element for the movie poster
  const img = document.createElement("img");
  img.src = movie.Poster !== "N/A" ? movie.Poster : "./res/logo.png"; // Use default image if no poster
  img.alt = movie.Title;

  // Create a title element
  const title = document.createElement("h3");
  title.textContent = movie.Title;

  // Create a button to view details
  const detailsBtn = document.createElement("button");
  detailsBtn.textContent = "View Details";
  detailsBtn.addEventListener("click", () => {
    window.location.href = `movie.html?id=${movie.imdbID}`;
  });

  // Append elements to the card
  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(detailsBtn);

  return card;
}
