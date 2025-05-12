import { observer } from "mobx-react-lite";
import { WatchListView } from "src/views/watchListView";

export const WatchList = observer(function WatchList(props) {
  function showMovieACB(movie) {
    console.log("Show movie: ", movie);
    props.model.setCurrentMovie(movie.id);
  }

  function deleteMovieACB(movieId) {
    console.log("Delete movie: ", movieId);
    // Call the model method to remove the movie
    props.model.removeFromWatchlist(movieId);
  }

  
  if (props.model.watchList && props.model.watchList.length > 0) {
    return (
      <WatchListView 
        watchList={props.model.watchList} 
        movieChosen={showMovieACB}
        onDeleteMovie={deleteMovieACB}
      />
    );
  }
  
  // For testing with a single hardcoded movie 
  const sampleMovie = {
    id: 1,
    title: "The Gray Man",
    poster_path: "/13r9I5FgITGstkzo7l4CL4GmM5c.jpg", // Sample TMDB poster path
    whereToWatch: "Netflix",
    rating: 4.5
  };
  
  return (
    <WatchListView 
      movie={sampleMovie}
      movieChosen={showMovieACB}
      onDeleteMovie={deleteMovieACB}
    />
  );
});