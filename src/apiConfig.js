// API key
export const API_KEY = "3d2a031b4cmsh5cd4e7b939ada54p19f679jsn9a775627d767";

function resultsACB(data) {
  return data.results;
}

function gotResponseACB(response) {
  if (response.status !== 200) {
    throw new Error("Error");
  }
  return response.json();
}

function searchMovies(searchParams) {
  const queryString = new URLSearchParams(searchParams).toString();
  const url = `https://api.themoviedb.org/3/search/movie?${queryString}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzZlNDQ2ZTY1ZDBiZWNkMzczNTU0NTlhZDhjNmEzNCIsIm5iZiI6MTc0MzUzNTQ4OC43MDQsInN1YiI6IjY3ZWMzZDgwYzU0NDIzM2Q4ZjJmYzkxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QMHJoTif9UlffXNdBfofjOb5aDI9wVj6qNGcP-saIhA'
    }
  }).then(gotResponseACB)
    .then(resultsACB)
    .catch(err => console.error(err));

    /* {  
      "poster_path": "/IfB9hy4JH1eH6HEfIgIGORXi5h.jpg",  
      "adult": false,  
      "overview": "Jack Reacher must uncover the truth behind a major government conspiracy in order to clear his name. On the run as a fugitive from the law, Reacher uncovers a potential secret from his past that could change his life forever.",  
      "release_date": "2016-10-19",  
      "genre_ids": [  
        53,  
        28,  
        80,  
        18,  
        9648  
      ],  
      "id": 343611,  
      "original_title": "Jack Reacher: Never Go Back",  
      "original_language": "en",  
      "title": "Jack Reacher: Never Go Back",  
      "backdrop_path": "/4ynQYtSEuU5hyipcGkfD6ncwtwz.jpg",  
      "popularity": 26.818468,  
      "vote_count": 201,  
      "video": false,  
      "vote_average": 4.19  
    } */
}

function getMovieDetails(searchParams) {
  const queryString = new URLSearchParams(searchParams).toString();
  const searchUrl = `https://api.themoviedb.org/3/search/movie?${queryString}`;

  return fetch(searchUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzZlNDQ2ZTY1ZDBiZWNkMzczNTU0NTlhZDhjNmEzNCIsIm5iZiI6MTc0MzUzNTQ4OC43MDQsInN1YiI6IjY3ZWMzZDgwYzU0NDIzM2Q4ZjJmYzkxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QMHJoTif9UlffXNdBfofjOb5aDI9wVj6qNGcP-saIhA'
    }
  })
    .then(gotResponseACB)
    .then(data => {
      const movieId = data.results[0]?.id;
      if (!movieId) throw new Error("No movie found");

      const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
      return fetch(detailsUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzZlNDQ2ZTY1ZDBiZWNkMzczNTU0NTlhZDhjNmEzNCIsIm5iZiI6MTc0MzUzNTQ4OC43MDQsInN1YiI6IjY3ZWMzZDgwYzU0NDIzM2Q4ZjJmYzkxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QMHJoTif9UlffXNdBfofjOb5aDI9wVj6qNGcP-saIhA'
        }
      });
    })
    .then(gotResponseACB)
    .catch(err => console.error("Error fetching movie details:", err));
  
}

function getTopRatedMovies() {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';

  return fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzZlNDQ2ZTY1ZDBiZWNkMzczNTU0NTlhZDhjNmEzNCIsIm5iZiI6MTc0MzUzNTQ4OC43MDQsInN1YiI6IjY3ZWMzZDgwYzU0NDIzM2Q4ZjJmYzkxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QMHJoTif9UlffXNdBfofjOb5aDI9wVj6qNGcP-saIhA'
    }
  })
    .then(gotResponseACB)
    .then(resultsACB)
    .catch(err => console.error("Error fetching top rated movies:", err));
}

function getSimilarMovies(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`;

  return fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzZlNDQ2ZTY1ZDBiZWNkMzczNTU0NTlhZDhjNmEzNCIsIm5iZiI6MTc0MzUzNTQ4OC43MDQsInN1YiI6IjY3ZWMzZDgwYzU0NDIzM2Q4ZjJmYzkxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QMHJoTif9UlffXNdBfofjOb5aDI9wVj6qNGcP-saIhA'
    }
  })
    .then(gotResponseACB)
    .then(resultsACB)
    .catch(err => console.error("Error fetching similar movies:", err));
}



globalThis.searchMovies = searchMovies;
globalThis.getMovieDetails = getMovieDetails;

export { searchMovies, getMovieDetails, getTopRatedMovies, getSimilarMovies };


// https://developer.themoviedb.org/reference/movie-details