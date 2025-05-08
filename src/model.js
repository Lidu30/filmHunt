const model = {
  watchlist: [],
  rating: [],
  username: "",
  userDetails: {
    id: "",
    name: "",
    email: "",
    phone: "",
  },
  currentMovie: [],
  // to track the login/authentication state
  user: null,
  
  setUser(user) {
    this.user = user;
  },

  setCurrentMovie(movie) {
    this.currentMovie = movie;
    console.log(this);
  },

  setUsername(username) {
    this.username = String(username);
    /* setUserDetails(details); */
    console.log(this);
  },

  setUserDetails(details) {
    this.userDetails = { ...this.userDetails, ...details };
    /*  model.setUserDetails({ id: "12345", phone: "1234567" });
    u set it like this 
    we'll assign the id ourselves */
  },

  /* setUserEmail(email) {
    this.userDetails.email = email;
  },

  setPhone(phone) {
    this.userDetails.phone = phone;
  }, */

  addToWatchlist(movieId) {
    this.watchlist = [...this.watchlist, movieId];
  },

  removeFromWatchlist(movieId) {
    this.watchlist = this.watchlist.filter((movie) => movie.id !== movieId);
  },

  watchlistHas(movieId){
    return this.watchlist.some((movie) => movie.id === movieId);
  }
};

export { model };
export default model;
