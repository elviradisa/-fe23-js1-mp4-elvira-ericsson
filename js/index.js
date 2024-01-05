//vad har varit roligast med projektet?
//             att se sidan växa fram och att kunna applicera allt de man lärt sig under kursen
//             kickarna man får när man löser ett problem man suttit med länge
//vad har varit mest utmanande under projektet?
//             tidsplaneringen och att lägga upp strukturen rätt från början,
//             jag kan ha lite svårt att se framfölr mig hur allting ska byggas
//             upp från början
//vad hade du gjort annorulunda?
//            lagt upp min tid bättre och strukturerat projektet bättre så att jag 
//            fått mer tid till css och finslipa koden

//minst ett valfritt bibliotek, ex jquery, anime, underscore


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
        throw ('Something went wrong...')
    }
})
  .then(data => displayMovies(data))
  .catch(displayError);

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
    console.log(urlMovieOrPerson);

    fetch(urlMovieOrPerson, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw (response)
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
        .catch(displayError);
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
        // .map - metod. skapar ny array av 'known-for'-arrayen, för varje objekt returneras
        //        movie-title (Movie) eller movie-name (TV) och listar de separerat med komma

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
                <img src="${imgURL}" alt="Image of ${personName}" class="allImages">
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
                throw ('Something went wrong...')
            }
        })
        .then(response => {
            // .slice - metod. skapar en ny array som innehåller endast elementen från index 0 - 10
            const displayTenMovies = response.results.slice(0, 10);
            // .map - metod. för varje objekt i 'displayTenMovies' anropas 'createMovieHTML'
            const topRatedMoviesHTML = displayTenMovies.map(movie => createMoviesHTML(movie)).join('');
            // .join - metod. efter .map skapat en array med HTML-strängar, 
            //           kombinerar .join de till en enda lång sträng.
            //        '' innebär att strängarna ska sammanfogas, inget ska separera dem
            resultDiv.innerHTML = topRatedMoviesHTML;
        })
        .catch(displayError);
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
                throw ('Something went wrong...')
            }
        })
        .then(response => {
            const displayTenMovies = response.results.slice(0, 10);
            const mostPopularMoviesHTML = displayTenMovies.map(movie => createMoviesHTML(movie)).join('');
            resultDiv.innerHTML = mostPopularMoviesHTML;
        })
        .catch(displayError);
}

function displayError (error) {
    const errorMessage = document.querySelector('.errorMessage');
    console.log(error);
    if (error.message === 404) {
        errorMessage.innerText = 'Movie or person not found... Please try again!'
    } else {
        errorMessage.innerText = 'Something went wrong, try again later!';
    }
}
