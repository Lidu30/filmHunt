import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ReviewedMoviesView } from "../views/reviewedMoviesView";

export const ReviewedMovies = observer(function ReviewedMovies(props) {

  useEffect(() => {
    // ✅ Only call model method, no business logic
    props.model.loadReviewedMovies();
  }, []);

  async function handleMovieSelect(movieData) {
    props.model.setCurrentMovieFromReview(movieData); 
  }

  function addToWatchlist(movieData) {
    // Convert the review data back to movie format
    const movie = {
      id: movieData.movieId,
      title: movieData.movieTitle,
      poster_path: movieData.moviePosterPath,
      release_date: movieData.movieReleaseDate,
      overview: movieData.movieOverview,
    };
    
    props.model.addToWatchlist(movie);
  }

  return (
    <ReviewedMoviesView
      watchlist={props.model.watchlist}
      reviewedMovies={props.model.reviewedMovies}
      loading={props.model.loadingReviewedMovies}
      onMovieSelect={handleMovieSelect}
      onAddToWatchlist={addToWatchlist}
    />
  );
});