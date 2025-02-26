// ==========================
// 🎬 Render Movie Trailers in Carousel
// ==========================
// This function dynamically creates and adds a trailer to the carousel.
export function renderTrailers(movie, num) {
    // Create an iframe element for the trailer
    const iFrameRef = document.createElement("iframe");
    iFrameRef.classList.add("trailers__video", `trailers__video-${num}`);
    iFrameRef.src = movie.Trailer_link; // Set trailer link
    document.querySelector(".trailers__container").appendChild(iFrameRef); // Add to the carousel

    // Select all trailer elements
    const trailerList = document.querySelectorAll(".trailers__video");
    const trailerArray = Array.from(trailerList); // Convert NodeList to array

    // Attach event listeners to navigation arrows
    document.querySelectorAll(".trailers__arrow").forEach(arrow => {
        arrow.addEventListener("click", (event) => {
            changeTrailer(event, trailerList, trailerArray);
        });
    });
}

// ==========================
// 🎬 Change Trailer in the Carousel
// ==========================
// This function shifts the trailers left or right when arrows are clicked.
function changeTrailer(event, trailerList, trailerArray) {
    // Shift trailers based on arrow direction
    if (event.target.dataset.direction === "right") {
        trailerArray.push(trailerArray.shift()); // Move first item to the end
    } else if (event.target.dataset.direction === "left") {
        trailerArray.unshift(trailerArray.pop()); // Move last item to the start
    }

    // Remove old trailer positions
    trailerList.forEach(item => {
        item.classList.remove(
            "trailers__video-1",
            "trailers__video-2",
            "trailers__video-3",
            "trailers__video-4",
            "trailers__video-5"
        );
    });

    // Assign new positions to the trailers
    trailerArray.slice(0, 5).forEach((item, i) => {
        item.classList.add(`trailers__video-${i + 1}`);
    });
}
