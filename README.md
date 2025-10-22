# MMDB My Movie Data Base
https://bachchanthapa.github.io/MMDB/index.html

![MMDB Tree](https://raw.githubusercontent.com/BachchanThapa/MMDB/main/MMDB-Tree.jpg)


## Tools & Workflow Used — MMDB (My Movie Database)


### Development & Workflow
- **VS Code + Live Server** – fast local preview and iteration while building pages.
- **Git & GitHub** – version control; commits for each feature and clear history.
- **Pull Requests / Code Reviews (self-check)** – kept main branch stable and changes focused.
- **Prettier (and basic ESLint rules)** – consistent formatting and simple quality checks.
- **Google Chrome DevTools** – inspected DOM/CSS, monitored network calls, and tested responsive views.

### Data & APIs
- **School Movie API (santosnr6.github.io)** – loaded *5 random trailers* and *Top 20 IMDB* movies for the homepage.
- **OMDb API** – broad search by title and detailed lookup by `imdbID`; powered search results and movie detail pages.
- **Insomnia/Postman** – tested and verified API responses and edge cases before wiring to the UI.
- **Graceful error handling** – `try/catch` + UI messages so failed requests don’t break the page.

### Frontend Tech
- **HTML5 (semantic)** – used `header/nav/main/section/article/footer` for structure and accessibility.
- **CSS3 with Grid & Flexbox** – responsive layout from mobile to desktop; no content overflow.
- **JavaScript (ES Modules)** – clear separation of concerns:
  - `modules/api.js` – all fetch calls (Movie API + OMDb), response parsing, and error handling.
  - `utils/domUtils.js` – safe DOM helpers (create elements, set attributes/alt text).
  - `utils/utils.js` – small pure helpers (formatting, debounce, fallbacks).
  - `components/movieCard.js` – reusable movie card renderer for lists/search results.
  - `modules/caroussel.js` – **left unchanged**; used to render the 5-trailer slider.
  - `storage.js` – favorites stored/retrieved from `localStorage`.
  - `script.js` – page bootstrapping & event wiring.
- **Accessibility checks (WAVE / axe DevTools)** – verified alt text, landmarks, labels, and color contrast.
- **Image fallbacks & placeholders** – show a default poster when OMDb lacks artwork.

### Why this stack helped
This setup let me meet every exam requirement: trailers + Top 20 on the homepage, searchable movies with detail view, a persistent **Favorites** list, robust **error handling**, **responsive** design, and **accessible** markup. Using Insomnia/DevTools improved API reliability and debugging, while modular JS kept the codebase scalable and easy to maintain.



