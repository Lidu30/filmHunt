import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { ReviewedMoviesView } from "../views/reviewedMoviesView";
import { getMovieDetails } from "../apiConfig";

export const ReviewedMovies = observer(function ReviewedMovies(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviewedMovies() {
      setLoading(true);
      try {
        await props.model.loadReviewedMovies();
      } catch (error) {
        console.error("Error loading reviewed movies:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadReviewedMovies();
  }, []);

  async function handleMovieSelect(movieData) {
    try {
      // Create a movie object that matches the expected format
      const movie = {
        id: movieData.movieId,
        title: movieData.movieTitle,
        poster_path: movieData.moviePosterPath,
        release_date: movieData.movieReleaseDate,
        overview: movieData.movieOverview,
        // We'll get additional details from the API
      };
      
      // Try to get full movie details from API, fallback to our stored data
      let fullMovieDetails;
      try {
        fullMovieDetails = await getMovieDetails(movie.id);
      } catch (error) {
        console.warn("Could not fetch full movie details, using stored data:", error);
        fullMovieDetails = movie;
      }
      
      props.model.setCurrentMovie(fullMovieDetails);
    } catch (error) {
      console.error("Error selecting movie:", error);
    }
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
      loading={loading}
      onMovieSelect={handleMovieSelect}
      onAddToWatchlist={addToWatchlist}
    />
  );
});