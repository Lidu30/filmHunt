import { observer } from "mobx-react-lite";
import { WatchListView } from "../views/watchListView";

export const WatchList = observer(function WatchList(props) {
  function showMovieACB(movie) {
    console.log("Show movie: ", movie);
    props.model.setCurrentMovie(movie);
  }

  function deleteMovieACB(movieId) {
    console.log("Delete movie: ", movieId);
    // Call the model method to remove the movie
    props.model.removeFromWatchlist(movieId);
  }

  
  return (
    <WatchListView 
      watchList={props.model.watchlist}
      movieChosen={showMovieACB}
      onDeleteMovie={deleteMovieACB}
    />
  );
});