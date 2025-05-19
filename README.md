# vt25-Project - FilmHunt

### Project description
FilmHunt is an app where users can search for movie suggestions personalized to their interests. Each user has a watchlist, where they can add movies they want to watch. To add a film to their watchlist, the user can either search for a specific film directly or browse through a database of movies. For each movie, the user can see information such as a synopsis, movie rating, genres, cast, as well as which streaming platforms the film is available on (in Sweden). Watchlists are public, so users can browse through other users' watchlists and from there add movies to their own watchlist.

### App description
There is a tab for the homepage, user watchlist, other users' watchlists, movie details, and a page for logging in and signing up. The homepage shows a search bar and a list of top-rated movies from the API we're using where the user can either click on a movie to see details or swipe right to add directly to their watchlist. The watchlist tab shows movies that the user has added to their watchlist, and the details tab shows all the details of the latest selected movie from the homepage or watchlist tab. The tab for other users' watchlists lets the user select which watchlist to see. The login displays a field for username and password, and the signup displays the same fields in addition to a name field, phone number and password confirmation. 

### Project setup
To setup the project, simply run the commands `npm install` and the `npm run dev`

### File structure
Our file structure is very similar to the one in the labs of the course, there is a folder for all the presenters and another for all the views. We also have an `app` folder with files for the layout and tabs for each page.
`apiConfig.js` contains all API calls, `bootstrapping. js` makes the model reactive and connects to Firestore, and `model.js` contains the model structure and necessary functions. It follows the basic convention of expo and react native framework.

### 3rd party components
There are a couple third party components in this project:
- the add button for the recommended movies in `views/watchlistView`
- useSafeAreaInsets, LinearGradient in `components/CustomTabBar`
- Ionicons, MaterialIcons, MaterialCommunityIcon in `(tabs)/_layout.jsx`
