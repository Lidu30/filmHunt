import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { DetailsView } from "src/views/detailsView";
import { EmptyDetailsView } from "src/views/emptyDetailsView";
import { SuspenseView } from "src/views/suspenseView";

export const Details = observer(function Details(props) {
  const movieId = props.model.currentMovie?.id;

  if (!movieId) {
    return <EmptyDetailsView />;
  }

  function addToWatchListACB() {
    console.log("Adding movie to watchlist:", props.model.currentMovie);
    props.model.addToWatchlist(props.model.currentMovie);
    console.log("Watchlist:", props.model.watchlist);
  }

  async function handleSubmitReview(rating, comment) {
    try {
      await props.model.submitMovieReview(rating, comment);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error; // Re-throw to let the view handle the error
    }
  }

  return (
    <DetailsView
      movie={props.model.currentMovie}
      movieGenres={props.model.currentMovieGenres.join(" | ")}
      movieCast={props.model.currentMovieCast}
      streamingPlatforms={props.model.currentMoviePlatforms.join("\n")}
      addingToWatchList={addToWatchListACB}
      inWatchList={props.model.watchlistHas(movieId)}
      currentMovieReviews={props.model.currentMovieReviews}
      currentMovieAverageRating={props.model.currentMovieAverageRating}
      onSubmitReview={async (rating, comment) => {
        try {
          await props.model.submitMovieReview(rating, comment);
        } catch (error) {
          console.error("Error submitting review:", error);
          throw error;
        }
      }}
    />
  );
});
