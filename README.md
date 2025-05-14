# vt25-Project - FilmHunt

### BUGS
- ~~currentMovie not being added correctly to watchlist from detailsView~~
- logout button
- scrolling on homepage
- dark background for user pages
- subheader for first movies displayed on homepage?
- navigation bar should be the same everywhere
- document for user reviews

### Project description
FilmHunt is an app where users can search for movie suggestions personalized to their interests. Each user has a watchlist, where they can add movies they want to watch, as well as a watched list so they can keep track of the movies they’ve already seen. To add a film to their watchlist, the user can either search for a specific film directly or browse through a database of movies with ratings, genre, as well as information about the cast and what streaming platforms the film is available on. A synopsis of each movie will also be included. 

### Current progress
We have a skeleton for the homepage, user watchlist, and movie details, and a page for logging in. The homepage shows a search bar and a list of top-rated movies from the API we're using, but the user can't submit a search word yet. The watchlist is hardcoded with one movie because the function for adding a movie to the watchlist is not yet implemented, and the details page is also based on one predetermined movie because the options on the homepage cannot be selected yet. The login is not functional yet. We're almost done with the base of the app and how the features look like, but we now have to implement the functionality of it. 

### What we still plan to do
We now plan on adding the functionality of the app that's mentioned above, as well as making the pages look more cohesive. So our main tasks right now will be to add navigation between the pages, create authentication, and initialise storage for each user on Firestore. If we have time, we would also like to implement some additional features. These extra features include personalised recommendations based on previous searches or genre, so an option to browse through, endless movies on the homepage, etc. We're also thinking of adding user reviews so people can see what other people have said about a movie or a show. If time permits, also a way where users can see each other's watchlists and watched lists.

### File structure
Our file structure is very similar to the one in the labs of the course, there is a folder for all the presenters and another for all the views. We also have an `app` folder with files for the layout and tabs for each page.
`apiConfig.js` contains all API calls, `bootstrapping. js` makes the model reactive and connects to Firestore, and `model.js` contains the model structure and necessary functions. It follows the basic convention of expo and react native framework.
