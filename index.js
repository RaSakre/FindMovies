let moviesData = [];
const URL = "https://api.kinopoisk.dev/v1.4/movie/search?";

const movieForm = document.querySelector(".movie-form");
const moviesList = document.querySelector(".movies-list");
const preloader = document.getElementById('preloader');


function showPreloader() {
    preloader.style.display = 'flex';
}


function hidePreloader() {
    preloader.style.display = 'none';
}

const movieOrSeries = {
    'movie': 'Фильм',
    'series': 'Сериал',
    'cartoon': 'Мультфильм',
}

const fetchMovies = (name) => {
    return fetch(`${URL}page=1&limit=10&query=${name}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "WGX9TC4-YGV42F2-K418JBP-T9CNZ0K",
        },
    });
};

function getMovieType(movie) {
    for (let type in movieOrSeries) {
        if (type === movie.type || movie.type.includes(type)) {
            return movieOrSeries[type];
        }
    }
}

function getMovieGenres(movie) {
    if (movie.genres.length > 2) {
        return `<li class='movie-genre'>${movie.genres[0].name}</li>
        <li class='movie-genre'>${movie.genres[1].name}</li>
        <li class='movie-genre'>+${movie.genres.length -2}</li>
        `
    } else {
        return movie.genres.map(genre => `<li class='movie-genre'>${genre.name}</li>`).join('')
    }
}


function renderMovies() {
    moviesData.forEach((movie) => {
        const li = document.createElement("li");
        li.className = "movies-item";
        li.innerHTML = `
    <a class="movie-card" href="https://www.kinopoisk.ru/film/${movie.id}/">
        <div class="movie-card-upper">
        <div class='movie-type'>${getMovieType(movie)}</div>
        <div class="movie-image-wrapper">
            <img src="${movie.poster.url ?? 'https://kinopoiskapiunofficial.tech/images/posters/kp_small/630256.jpg?q_auto,f_auto,w_auto,dpr_auto'}" alt="${movie.name}" class="movie-image">
        </div>
            <div class="movie-ratings">
                <span class="movie-rating">
                    <img width = '20px'; height = '20px' src="./images/kp.svg" alt="KP">
                        ${movie.rating.kp.toFixed(1)}
                </span>
                <span class="movie-rating">
                    <img width = '20px'; height = '20px' src="./images/IMDB_Logo.svg" alt="IMDB">
                        ${movie.rating.imdb.toFixed(1)}
                </span>
            </div>
    </div>
    <div class="movie-card-lower">
        <h3 class="movie-title">${movie.name}</h3>
        <p class="movie-year">${movie.year}</p>
        <ul class="movie-genres">
            ${getMovieGenres(movie)}
        </ul>
    </div>
    </a>
`;
        moviesList.appendChild(li);
    });
}

movieForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const movieInput = document.querySelector(".find-movie__input");
    if (!movieInput.value.trim()) return
    showPreloader()
    moviesData = []
    try {
        const response = await fetchMovies(movieInput.value.trim());
        const data = await response.json();
        data.docs.forEach(movie => moviesData.push(movie));
        moviesList.innerHTML = ``
        renderMovies()
    } catch (error) {
        console.error("Ошибка при загрузке фильмов:", error);
        moviesList.innerHTML = "<li>Произошла ошибка при загрузке фильмов</li>";
    }
    hidePreloader()
    movieForm.reset();

});


