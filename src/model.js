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
  reviewedMovies: [],
  currentMovieReviews: [],
  currentMovieAverageRating: null,
 
  async setCurrentMovie(movie) {
    this.currentMovie = movie;
    console.log("set current movie to", movie)
    this.currentMovieGenres = this.getGenreNames(movie.genres)
    this.currentMovieCast = await getCast(movie.id)
    this.currentMoviePlatforms = await getStreamingPlatforms(movie.id)
    // console.log("LOOK AT THIS:", this.currentMoviePlatforms)
    // console.log(this.currentMovie);
    await this.loadCurrentMovieReviews()
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


   async loadCurrentMovieReviews() {
    if (!this.currentMovie) {
      this.currentMovieReviews = []
      this.currentMovieAverageRating = null
      return
    }

    try {
      const { getMovieReviews, getAverageRatingForMovie } = await import('./firestoreModel')
      this.currentMovieReviews = await getMovieReviews(this.currentMovie.id)
      this.currentMovieAverageRating = await getAverageRatingForMovie(this.currentMovie.id)
    } catch (error) {
      console.error("Error loading movie reviews:", error)
      this.currentMovieReviews = []
      this.currentMovieAverageRating = null
    }
  },

  async loadReviewedMovies() {
    try {
      const { getAllReviewedMovies } = await import('./firestoreModel')
      this.reviewedMovies = await getAllReviewedMovies()
    } catch (error) {
      console.error("Error loading reviewed movies:", error)
      this.reviewedMovies = []
    }
  },

  async submitMovieReview(rating, comment) {
    if (!this.currentMovie || !this.userDetails.id) {
      throw new Error("No current movie or user not logged in")
    }

    try {
      const { submitMovieReview } = await import('./firestoreModel')
      await submitMovieReview(
        this.currentMovie.id,
        this.currentMovie,
        this.userDetails.id,
        this.userDetails.name,
        rating,
        comment
      )
      
      // Reload reviews for current movie
      await this.loadCurrentMovieReviews()
      
      // Reload all reviewed movies
      await this.loadReviewedMovies()
    } catch (error) {
      console.error("Error submitting movie review:", error)
      throw error
    }
  },

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
      //.map((id) => this.genres.find((genre) => genre.id === id))
      //.filter(Boolean) // remove undefined values
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
 clearModel(){
    this.userDetails = { id: null, name: "", email: "", phone: "" };
    this.watchlist = [];
    this.rating = [];
    this.currentMovie = null;
    this.currentMovieGenres = [];
    this.currentMovieCast = [];
    this.currentMoviePlatforms = [];
    this.currentMoviePromiseState = {};
    this.reviewedMovies = [];
    this.currentMovieReviews = [];
    this.currentMovieAverageRating = null;
 }
};

export { model };
export default model;
