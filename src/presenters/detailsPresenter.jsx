import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { DetailsView } from "src/views/detailsView";
import { EmptyDetailsView } from "src/views/emptyDetailsView";
import { SuspenseView } from "src/views/suspenseView";

export const Details = observer(function Details(props) {
  const movieId = props.model.currentMovie?.id;
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!movieId) {
    return <EmptyDetailsView />;
  }

  function addToWatchListACB() {
    console.log("Adding movie to watchlist:", props.model.currentMovie);
    props.model.addToWatchlist(props.model.currentMovie);
    console.log("Watchlist:", props.model.watchlist);
  }

  const handleSubmitReview = async () => {
    setSubmittingReview(true);
    try {
      await props.model.submitMovieReview(rating, comment);
      // Reset form state
      setRating(0);
      setComment("");
      setShowReviewForm(false);
      // You could show success message here or let model handle it
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error state
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
    if (!showReviewForm) {
      setRating(0);
      setComment("");
    }
  };

  const handleSetRating = (value) => {
    setRating(value);
  };

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
      showReviewForm={showReviewForm}
      rating={rating}
      comment={comment}
      submittingReview={submittingReview}
      onSubmitReview={handleSubmitReview}
      onToggleReviewForm={toggleReviewForm}
      onSetRating={handleSetRating}
      onCommentChange={setComment}
    />
  );
});
