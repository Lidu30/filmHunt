import { useState, useEffect } from "react";
import { useRouter } from "expo-router"; 
import {
  getWatchlistById,
  getFeedbackForWatchlist,
  submitWatchlistFeedback,
  getAverageRatingForWatchlist,
} from "../firestoreModel";
import { UserWatchlistView } from "../views/userwatchlistView";
import { observer } from "mobx-react-lite";
import { reactiveModel } from "../bootstrapping";
import { getMovieDetails } from "../apiConfig";
import Toast from "react-native-toast-message";

export const UserWatchlist = observer(function UserWatchlist(props) {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const userId = props.userId || props.route?.params?.userId;
  const userName = props.userName || props.route?.params?.userName;
  const currentUserId =
    props.currentUserId || reactiveModel.currentUser?.id || "";
  const currentUserName =
    props.currentUserName || reactiveModel.currentUser?.name || "";

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [watchlist, feedback, avg] = await Promise.all([
          getWatchlistById(userId),
          getFeedbackForWatchlist(userId),
          getAverageRatingForWatchlist(userId),
        ]);

        if (isMounted) {
          setWatchlistItems(watchlist || []);
          setFeedbackList(feedback || []);
          setAvgRating(avg || null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (isMounted) {
          Toast.show({
            type: "error",
            text1: "Failed to load watchlist",
            text2: error.message,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  function handleMovieSelect(movie) {
    getMovieDetails(movie.id)
      .then((details) => {
        reactiveModel.setCurrentMovie(details);
        // nvigate to movie details if needed
        // router.push(`/movie/${movie.id}`);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        Toast.show({
          type: "error",
          text1: "Failed to load movie details",
        });
      });
  }

  function handleAddToWatchlist(movie) {
    if (!reactiveModel.watchlist.some((m) => m.id === movie.id)) {
      reactiveModel.addToWatchlist(movie);
      Toast.show({
        type: "success",
        text1: `"${movie.title}" added to your watchlist.`,
      });
    } else {
      Toast.show({
        type: "info",
        text1: `"${movie.title}" is already in your watchlist.`,
      });
    }
  }

  function handleSubmitFeedback() {
    console.log("Submit feedback called", { rating, comment: comment.trim() }); // Debug log

    if (!rating || rating === 0) {
      Toast.show({
        type: "error",
        text1: "Please select a rating",
      });
      return;
    }

    if (!comment || !comment.trim()) {
      Toast.show({
        type: "error",
        text1: "Please write a comment",
      });
      return;
    }

    if (!userId || !currentUserId) {
      Toast.show({
        type: "error",
        text1: "User information missing",
      });
      return;
    }

    submitWatchlistFeedback(userId, currentUserId, {
      commenterName: currentUserName,
      rating,
      comment: comment.trim(),
      timestamp: new Date(),
    })
      .then(() => {
        return Promise.all([
          getFeedbackForWatchlist(userId),
          getAverageRatingForWatchlist(userId),
        ]);
      })
      .then(([feedback, avg]) => {
        setFeedbackList(feedback);
        setAvgRating(avg);
        // Reset form
        setRating(0);
        setComment("");
        setShowFeedback(false);
        Toast.show({
          type: "success",
          text1: "Feedback submitted!",
        });
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        Toast.show({
          type: "error",
          text1: "Failed to submit feedback",
          text2: error.message,
        });
      });
  }

  function isInWatchlist(movieId) {
    return reactiveModel.watchlist.some((movie) => movie.id === movieId);
  }

  function handleBack() {
    console.log("Back button pressed");
    props.onBack?.();
  }

  function toggleFeedback() {
    console.log("Toggle feedback pressed, current state:", showFeedback);
    setShowFeedback(!showFeedback);
  }

  return (
    <UserWatchlistView
      userId={userId}
      userName={userName}
      watchlistItems={watchlistItems}
      loading={loading}
      feedbackList={feedbackList}
      averageRating={avgRating}
      onMovieSelect={handleMovieSelect}
      onAddToWatchlist={handleAddToWatchlist}
      onSubmitFeedback={handleSubmitFeedback}
      onBack={handleBack}
      isInWatchlist={isInWatchlist}
      showFeedback={showFeedback}
      toggleFeedback={toggleFeedback}
      rating={rating}
      setRating={setRating}
      comment={comment}
      setComment={setComment}
    />
  );
});
