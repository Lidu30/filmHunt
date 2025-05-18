import { useState, useEffect } from "react";
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

export const UserWatchlist = observer(function UserWatchlist(props) {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  const userId = props.userId || props.route?.params?.userId;
  const userName = props.userName || props.route?.params?.userName;
  const currentUserId = props.currentUserId || null;
  const currentUserName = props.currentUserName || "";

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
          getAverageRatingForWatchlist(userId)
        ]);
        
        if (isMounted) {
          setWatchlistItems(watchlist || []);
          setFeedbackList(feedback || []);
          setAvgRating(avg || null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
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
    try {
      getMovieDetails(movie.id)
        .then(details => {
          reactiveModel.setCurrentMovie(details);
        })
        .catch(error => {
          console.error("Error fetching movie details:", error);
        });
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  }

  function handleAddToWatchlist(movie) {
    props.onAddToWatchlist?.(movie);
  }

  function handleSubmitFeedback(rating, comment) {
    if (!userId || !currentUserId || !rating || !comment.trim()) return;

    submitWatchlistFeedback(userId, currentUserId, {
      commenterName: currentUserName,
      rating,
      comment,
      timestamp: new Date()
    })
      .then(() => {
        return Promise.all([
          getFeedbackForWatchlist(userId),
          getAverageRatingForWatchlist(userId)
        ]);
      })
      .then(([feedback, avg]) => {
        setFeedbackList(feedback);
        setAvgRating(avg);
      })
      .catch(error => {
        console.error("Error submitting feedback:", error);
      });
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
      onBack={props.onBack}
    />
  );
});