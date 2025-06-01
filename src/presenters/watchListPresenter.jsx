import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { WatchListView } from "../views/watchListView";


export const WatchList = observer(function WatchList(props) {
  useEffect(() => {
    // ✅ Only call model method, no business logic
    props.model.loadRecommendations();
  }, [props.model.watchlist]);


  function showMovieACB(movie) {
    console.log("Show movie: ", movie);
    props.model.setCurrentMovie(movie);
  }

  function deleteMovieACB(movieId) {
    console.log("Delete movie: ", movieId);
    // Call the model method to remove the movie
    props.model.removeFromWatchlist(movieId);
  }

  function addToWatchlistACB(movie) {
    props.model.addToWatchlist(movie);
  }

  
  return (
    <WatchListView 
      watchList={props.model.watchlist}
      recommendations={props.model.recommendations}
      loadingRecommendations={props.model.loadingRecommendations}
      movieChosen={showMovieACB}
      onDeleteMovie={deleteMovieACB}
      onAddToWatchlist={addToWatchlistACB}
    />
  );
});