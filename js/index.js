//vad har varit toligast med projketet?
//vad har varit mest lärande?
//vad hade du gjort annorulunda?

//minst ett valfritt bibliotek, ex jquery, anime, underscore

//innerHTML är okej i JS-filen



const BEARER_KEY= `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNTVmYzE0ODI0MDliYjkwN2YxMTYyNWZkOGQ4YTRjYiIsInN1YiI6IjY1ODAwNTQyMjI2YzU2MDdmZTllMjQ2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TyCnk5WZxRyhHuUzXvloHUkQtKFLcCclGitWEz-DGG0`;

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${BEARER_KEY}`
    }
};

const urlMoviesDiscover = 'https://api.themoviedb.org/3/discover/movie';

fetch(urlMoviesDiscover, options)
  .then(response => {
    if(response.ok) {
        return response.json();
    } else {
        errorMessage.innerHTML = 'Something went wrong...';
    }
})
  .then(data => displayMovies(data))
  .catch(error => {
    console.error(error);
    errorMessage.innerHTML = 'Network error...';
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
    console.log(urlMovieOrPerson);

    fetch(urlMovieOrPerson, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                displayError
            }
        })
        .then(data => {
            console.log(data);

            if (checkbox === 'movie') {
                resultDiv.innerHTML = searchMovieHTML(data.results);
            } else if (checkbox === 'person') {
                resultDiv.innerHTML = searchPersonHTML(data.results);
            } 
        })
        .catch(
            errorMessage.innerHTML = 'Something went wrong...'
        );
    form.reset();    
});

function searchMovieHTML (movies) {

    let movieHTML = '';

    movies.forEach(movie => {
        const imgPath = movie.poster_path;
        const imgURL = `https://image.tmdb.org/t/p/w500${imgPath}`;
        const movieTitle = movie.title;
        const releaseDate = movie.release_date;
        const movieOverview = movie.overview;

        movieHTML = `
            <li class="movieList">
                <img src="${imgURL}" class="allImages">
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
        const imgPath = person.profile_path;
        const imgURL = `https://image.tmdb.org/t/p/w500${imgPath}`;
        const personName = person.name;
        const knownForDepartment = person.known_for_department;
        const knownFor = person.known_for.map(movie => movie.title || movie.name).join(', ');

        personHTML += `
            <li class="personList">
                <img src="${imgURL}" alt="Image of ${personName}" class="allImages">
                <h2 class="personName">${personName}</h2>
                <p class="knownForDepartment">${knownForDepartment}</p>
                <p class="knownFor">Known for:  ${knownFor}</p>
            </li>
        `;
    });
    return personHTML;
}

const topRatedButton = document.querySelector('#topRated');
topRatedButton.addEventListener('click', function() {
    fetchTopRatedMovies();
})

function fetchTopRatedMovies () {
    const urlTopRatedMovies = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`;
    const resultDiv = document.querySelector('.results');
    const errorMessage = document.querySelector('.errorMessage');
    resultDiv.innerHTML = '';
    errorMessage.innerHTML = '';

    fetch(urlTopRatedMovies, options)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                errorMessage.innerHTML = 'Something went wrong...';
            }
        })
        .then(response => {
            const showTenMovies = response.results.slice(0, 10);
            const topRatedMoviesHTML = showTenMovies.map(movie => createMoviesHTML(movie)).join('');
            resultDiv.innerHTML = topRatedMoviesHTML;
        })
        .catch(error => {
            console.error(error);
            errorMessage.innerHTML = 'Network error...';
        });
}

const mostPopularButton = document.querySelector('#mostPopular');
mostPopularButton.addEventListener('click', function() {
    fetchMostPopularMovies();
})

function fetchMostPopularMovies () {
    const urlMostPopularMovies = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
    const resultDiv = document.querySelector('.results');
    const errorMessage = document.querySelector('.errorMessage');
    resultDiv.innerHTML = '';
    errorMessage.innerHTML = '';

    fetch(urlMostPopularMovies, options)
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw ('Something went wrong...')
            }
            
        })
        .then(response => {
            const showTenMovies = response.results.slice(0, 10);
            const mostPopularMoviesHTML = showTenMovies.map(movie => createMoviesHTML(movie)).join('');
            resultDiv.innerHTML = mostPopularMoviesHTML;
        })
        .catch(
            errorMessage.innerHTML = 'Network error...'
        );
}

function displayError (error) {
    const errorMessage = document.querySelector('.errorMessage');

    if (error.message.includes('null') || error.message === '404') {
        errorMessage.textContent = 'Movie or person not found, try again!'
    } else {
        errorMessage.textContent = `Error: ${error.message}`;
    }
}
