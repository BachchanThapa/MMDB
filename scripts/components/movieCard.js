export function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = movie.Poster !== "N/A" ? movie.Poster : "./res/missing-poster.svg";
  img.alt = movie.Title;
  img.classList.add("movie-poster");

  const title = document.createElement("h3");
  title.classList.add("movie-title");
  
  const titleLink = document.createElement("a");
  titleLink.href = `movie.html?imdbID=${movie.imdbID}`;
  titleLink.textContent = movie.Title;
  titleLink.classList.add("movie-link");

  title.appendChild(titleLink);
  card.appendChild(img);
  card.appendChild(title);

  return card;
}
