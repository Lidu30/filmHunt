import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { WatchListView } from "../views/watchListView";
import { getSimilarMovies } from "../apiConfig";

export const WatchList = observer(function WatchList(props) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      if (props.model.watchlist.length === 0) {
        setRecommendations([]);
        return;
      }
      
      setLoading(true);
      
      try {
        // Get the most recently added movie from watchlist (we can probably come up with a better idea)
        const sourceMovie = props.model.watchlist[props.model.watchlist.length - 1];
        
        // Fetch similar movies
        const similarMovies = await getSimilarMovies(sourceMovie.id);
        
        // Filter out movies already in watchlist
        const watchlistIds = props.model.watchlist.map(m => m.id);
        const filteredRecommendations = similarMovies.results.filter(
          movie => !watchlistIds.includes(movie.id)
        ).slice(0, 8); // Limit to 8 recommendations
        
        setRecommendations(filteredRecommendations);
      } catch (error) {
        console.error("Error getting recommendations:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecommendations();
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
      recommendations={recommendations}
      loadingRecommendations={loading}
      movieChosen={showMovieACB}
      onDeleteMovie={deleteMovieACB}
      onAddToWatchlist={addToWatchlistACB}
    />
  );
});