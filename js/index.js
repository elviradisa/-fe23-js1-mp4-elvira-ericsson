/*
* Elvira Ericsson
* Slutprojekt FE23
*
* The Movie Database
* Uses The Movie Database API - https://www.themoviedb.org/
*
* Fetches top rated movies
* Fetches most popular movies
* Fetches movies and people in the movie business matching a user search
* User can search by movie or person
*
* Info displayed for each searched movie:
*  - title
*  - release date
*  - description
* Info displayed for each searched person:
*  - name
*  - department
*  - list of which movies/TV they are known for
*/

const BEARER_KEY= `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTVmYzE0ODI0MDliYjkwN2YxMTYyNWZkOGQ4YTRjYiIsInN1YiI6IjY1ODAwNTQyMjI2YzU2MDdmZTllMjQ2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TyCnk5WZxRyhHuUzXvloHUkQtKFLcCclGitWEz-DGG0`;

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${BEARER_KEY}`
    }
};

const h1Animation = {
    targets: '.h1Animation',
    translateY: '20px',
    delay: anime.stagger(200),
    borderRadius: '50%',
    direction: 'alternate',
    easing: 'linear',
    loop: true,
}
anime(h1Animation);
//https://animejs.com/documentation/#staggeringBasics

const urlMoviesDiscover = 'https://api.themoviedb.org/3/discover/movie';

fetch(urlMoviesDiscover, options)
  .then(response => {
    if(response.ok) {
        return response.json();
    } else {
        throw new Error (response.status)
    }
})
  .then(data => displayMovies(data))
  .catch(error => {
    displayError(error)
});

function createMoviesHTML (movie) {
    const imgPath = movie.poster_path;
    const imgURL = `https://image.tmdb.org/t/p/w500${imgPath}`;
    const movieName = movie.title;
    const releaseDate = movie.release_date;

    return `
    <li class="movieList">
        <img src="${imgURL}" alt="Image of ${movieName}" class="allImages">
        <h2 class="movieTitle">${movieName}</h2>
        <p class="movieReleaseDate">${releaseDate}</p>
    </li>
    `;
}
  
function displayMovies (data) {
    const allMovies = data.results;
    let allMoviesHTML = '';

    allMovies.forEach(movie => {
        allMoviesHTML += createMoviesHTML(movie);
    });

    document.querySelector('.results').innerHTML = allMoviesHTML;
}

const form = document.querySelector('#form');
const resultDiv = document.querySelector('.results');
const errorMessage = document.querySelector('.errorMessage');
errorMessage.innerHTML = '';

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const checkbox = document.querySelector('input[name="movieOrPerson"]:checked').value;
    const searchInput = document.querySelector('#searchInput').value;
    let urlMovieOrPerson;

    if (checkbox === 'movie') {
        urlMovieOrPerson = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchInput)}&include_adult=false&language=en-US&page=1`;
    } else if (checkbox === 'person') {
        urlMovieOrPerson = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(searchInput)}&include_adult=false&language=en-US&page=1`;
    }

    fetch(urlMovieOrPerson, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error (response.status)
            }
        })
        .then(data => {
            console.log(data);
            if (data.results.length === 0) {
                throw new Error (checkbox === 'movie' ? 'Movies not found' : 'Person not found');
            }

            if (checkbox === 'movie') {
                resultDiv.innerHTML = searchMovieHTML(data.results);
            } else if (checkbox === 'person') {
                resultDiv.innerHTML = searchPersonHTML(data.results);
            } 
        })
        .catch(error => {
            displayError(error)
        });
    form.reset();    
});

const standbyImage = 'img/standby-image.jpeg';

function searchMovieHTML (movies) {

    let movieHTML = '';

    movies.forEach(movie => {
        const imgPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : standbyImage;
        const movieTitle = movie.title;
        const releaseDate = movie.release_date;
        const movieOverview = movie.overview;

        movieHTML += `
            <li class="movieList">
                <img src="${imgPath}" alt="Image of ${movieTitle}" class="allImages">
                <h2 class="movieTitle">${movieTitle}</h2>
                <p class="movieOverview">${movieOverview}</p>
                <p class="movieReleaseDate">${releaseDate}</p>
            </li>
        `;
    });
    return movieHTML;
}


function searchPersonHTML (people) {

    let personHTML = '';

    people.forEach(person => {
        const imgPath = person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : standbyImage;
        const personName = person.name;
        const knownForDepartment = person.known_for_department;

        let movie = [];
        let tv = [];

        for (const movieOrTv of person.known_for) {
            if (movieOrTv.media_type === 'movie') {
                movie.push(movieOrTv.title);
            } else if (movieOrTv.media_type === 'tv') {
                tv.push(movieOrTv.name);
            }
        }

        const movieList = movie.join('<br>Movie: ');
        const tvList = tv.join('<br>TV: ');

        personHTML += `
            <li class="personList">
                <img src="${imgPath}" alt="Image of ${personName}" class="allImages">
                <h2 class="personName">${personName}</h2>
                <p class="knownForDepartment">${knownForDepartment}</p>
                <p class="knownFor">Movie: ${movieList}</p>
                <p class="knownFor">TV: ${tvList}</p>
            </li>
        `;
    });
    return personHTML;
}

const topRatedButton = document.querySelector('#topRated');
topRatedButton.addEventListener('click', fetchTopRatedMovies)

function fetchTopRatedMovies () {
    const urlTopRatedMovies = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`;
    const resultDiv = document.querySelector('.results');

    resultDiv.innerHTML = '';

    fetch(urlTopRatedMovies, options)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error (response.status)
            }
        })
        .then(response => {
            const displayTenMovies = response.results.slice(0, 10);
            const topRatedMoviesHTML = displayTenMovies.map(movie => createMoviesHTML(movie)).join('');
            resultDiv.innerHTML = topRatedMoviesHTML;
        }) 
        .catch(error => {
            displayError(error)
        });
}

const mostPopularButton = document.querySelector('#mostPopular');
mostPopularButton.addEventListener('click', fetchMostPopularMovies)

function fetchMostPopularMovies () {
    const urlMostPopularMovies = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
    const resultDiv = document.querySelector('.results');

    resultDiv.innerHTML = '';

    fetch(urlMostPopularMovies, options)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error (response.status)
            }
        })
        .then(response => {
            const displayTenMovies = response.results.slice(0, 10);
            const mostPopularMoviesHTML = displayTenMovies.map(movie => createMoviesHTML(movie)).join('');
            resultDiv.innerHTML = mostPopularMoviesHTML;
        })
        .catch(error => {
            displayError(error)
        });
}

function displayError (error) {
    const errorMessage = document.querySelector('.errorMessage');
    let message;

    if (error.message === 'Movies not found' || error.message === 'Person not found') {
        message = 'Movie or person not found, try again!';
        console.log(error.message);
    } else {
        message = 'Network error... try again later!';
    }
    errorMessage.textContent = message;
}
