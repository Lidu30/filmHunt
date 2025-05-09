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
  ready: false,
 
  setCurrentMovie(movie) {
    this.currentMovie = movie;
    console.log(this);
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
