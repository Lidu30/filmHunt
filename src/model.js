import { getAllGenreNames, getCast, getStreamingPlatforms } from './apiConfig'

const model = {
// user info for authentication
  userDetails: {
    id: null,
    name: "",
    email: "", // email is the username for the login
    phone: "",
  },
  watchlist: [],
  rating: [],
  currentMovie: null,
  currentMovieGenres: [],
  currentMovieCast: [],
  currentMoviePlatforms: [],
  currentMoviePromiseState: {},
  ready: false,
  genres: [],
 
  async setCurrentMovie(movie) {
    this.currentMovie = movie;
    this.currentMovieGenres = this.getGenreNames(movie.genre_ids)
    this.currentMovieCast = await getCast(movie.id)
    this.currentMoviePlatforms = await getStreamingPlatforms(movie.id)
    // console.log("LOOK AT THIS:", this.currentMoviePlatforms)
    // console.log(this.currentMovie);
  },


  // setUsername(username) {
  //   this.username = String(username);
  //   /* setUserDetails(details); */
  //   console.log(this);
  // },

  // setUserDetails(details) {
  //   this.userDetails = { ...this.userDetails, ...details };
  //   /*  model.setUserDetails({ id: "12345", phone: "1234567" });
  //   u set it like this 
  //   we'll assign the id ourselves */
  // },

  setUserDetails(userData) {
    if (userData) {
      this.userDetails = {
        id: userData.id ?? this.userDetails.id,
        email: userData.email ?? this.userDetails.email,
        name: userData.name ?? this.userDetails.name,
        phone: userData.phone ?? this.userDetails.phone,
      };
      this.ready = !!this.userDetails.id;
    } else {
      this.userDetails = { id: null, name: "", email: "", phone: "" };
      this.ready = false;
    }
    console.log("User updated:", this.userDetails);
  },
  
  /* setUserEmail(email) {
    this.userDetails.email = email;
  },

  setPhone(phone) {
    this.userDetails.phone = phone;
  }, */

  addToWatchlist(movie) {
    if (!this.watchlistHas(movie.id)) {
      this.watchlist = [...this.watchlist, movie];
      console.log("Movie added to watchlist:", movie.title);
      // we can tell the user that the movie has already been added
    } else {
      console.log("Movie already in watchlist:", movie.title);
    }
  },

  removeFromWatchlist(movieId) {
    this.watchlist = this.watchlist.filter((movie) => movie.id !== movieId);
  },

  watchlistHas(movieId){
    return this.watchlist.some((movie) => movie.id === movieId);
  },

  async loadAllGenres() {
    try {
      const response = await getAllGenreNames();
      this.genres = response.genres || [];
    } catch (err) {
      console.error("Failed to load genres:", err);
    }
  },

  getGenreNames(ids = []) {
    if (!Array.isArray(ids)) return [];
  
    return ids
      .map((id) => this.genres.find((genre) => genre.id === id))
      .filter(Boolean) // remove undefined values
      .map((genre) => genre.name);
  },

  /*
  currentMovieEffect() {
    if (!this.currentMovie) {
      this.currentMoviePromiseState = { promise: null, data: null, error: null }
      return;
    }
    const moviePromise = getAdditionalMovieDetails(this.currentMovie)
    resolvePromise(moviePromise, this.currentMoviePromiseState)
  },
  */
};

export { model };
export default model;
