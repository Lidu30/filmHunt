# vt25-Project - FilmHunt

### Project description
FilmHunt is an app where users can search for movie suggestions personalized to their interests. Each user has a watchlist, where they can add movies they want to watch, as well as a watched list so they can keep track of the movies they’ve already seen. To add a film to their watchlist, the user can either search for a specific film directly or browse through a database of movies with ratings, genre as well as information about the cast and what streaming platforms the film is available on. A synopsis of each movie will also be included.

### Current progress
We have a skeleton for the homepage, user watchlist and movie details, as well as a page for logging in. The homepage shows a search bar and a list of top-rated movies, but the user can't submit a search word yet. The watchlist is hardcoded with one movie because the function for adding a movie to the watchlist is not yet implemented, and the details page is also based on one predecided movie because the options on the homepage cannot be selected yet. The login is not completely functionnal either yet.

### What we still plan to do
We plan on implementing the missing functions mentioned above, as well as making the pages look more cohesive. Depending on the time we have, we would also like to implement some additional features.

### File structure
Our file structure is very similar to the one in the labs of the course, there is a folder for all the presenters and another for all the views. We also have an `app` folder with files for the layout and tabs for each page.
`apiConfig.js` contains all API calls, `bootstrapping. js` makes the model reactive and connects to Firestore and `model.js` contains the model structure and necessary functions. 
