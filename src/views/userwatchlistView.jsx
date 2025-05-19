import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useCallback, memo } from "react";
import { reactiveModel } from "../bootstrapping";

const WatchlistItem = memo(({ item, onMovieSelect }) => {

    const router = useRouter();
  if (!item) return null;

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Poster";

  const releaseYear = item.release_date
    ? item.release_date.substring(0, 4)
    : "N/A";

  const handlePreviewMovie = useCallback(() => {
    onMovieSelect(item);
    router.push("/(tabs)/details");
  }, [item, onMovieSelect]);

  const handleAddToWatchlist = useCallback(() => {
    if (!reactiveModel.watchlist.some((m) => m.id === item.id)) {
      reactiveModel.addToWatchlist(item);
    } else {
      Alert.alert(
        "Already in Watchlist",
        `"${item.title}" is already in your watchlist.`,
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  }, [item]);

  return (
    <Pressable
      role="button"
      style={styles.movieContainer}
      onPress={handlePreviewMovie}
    >
      <View style={styles.row}>
        <View style={styles.imageContainer}>
          <Image 
            style={styles.image} 
            source={{ uri: posterUrl }} 
            cachePolicy="memory" // to avoid refetching
            transition={200}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.movieName} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.sub}>{releaseYear}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐{" "}
                {item.vote_average
                  ? Math.round(item.vote_average * 10) / 10
                  : "?"}
              </Text>
            </View>
          </View>
          <Text numberOfLines={3} style={styles.overview}>
            {item.overview || "No overview available."}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToWatchlist} 
          >
            <MaterialIcons
              name="add"
              size={16}
              color="white"
              style={styles.addIcon}
            />
            <Text style={styles.addButtonText}>Add to My Watchlist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
});

const RatingStar = memo(({ filled, onPress, value }) => (
  <TouchableOpacity onPress={() => onPress(value)}>
    <MaterialIcons
      name={filled ? "star" : "star-border"}
      size={28}
      color="#f1c40f"
    />
  </TouchableOpacity>
));

export function UserWatchlistView({
  userId,
  userName,
  watchlistItems,
  loading,
  feedbackList,
  averageRating,
  onMovieSelect,
  onAddToWatchlist,
  onSubmitFeedback, 
  onBack,
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSetRating = useCallback((value) => {
    setRating(value);
  }, []);

  const handleSubmitFeedback = useCallback(() => {
    if (rating && comment.trim()) {
      onSubmitFeedback?.(rating, comment);
      setRating(0);
      setComment("");
      setShowFeedback(false);
    }
  }, [rating, comment, onSubmitFeedback]);

  const toggleFeedback = useCallback(() => {
    setShowFeedback(prev => !prev);
  }, []);

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack]);

  const keyExtractor = useCallback((item) => 
    item && item.id ? item.id.toString() : Math.random().toString()
  , []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0055AA" />
        <Text style={styles.loadingText}>Loading watchlist...</Text>
      </View>
    );
  }

  if (watchlistItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          {userName || "This user"}'s watchlist is empty
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButtonSmall}
          onPress={handleBackPress}
        >
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.watchlistHeader}>
          {userName ? `${userName}'s Watchlist` : "User Watchlist"}
        </Text>

        <TouchableOpacity onPress={toggleFeedback}>
          <MaterialIcons name="rate-review" size={24} color="#f1c40f" />
        </TouchableOpacity>
      </View>

      {averageRating !== null && (
        <View style={styles.avgRatingContainer}>
          <Text style={styles.avgRatingText}>
            Average Rating: ⭐ {averageRating.toFixed(1)} ({feedbackList?.length || 0} review{feedbackList?.length !== 1 ? 's' : ''})
          </Text>
        </View>
      )}

      {showFeedback && (
        <View style={styles.feedbackForm}>
          <Text style={styles.feedbackLabel}>Rate this watchlist:</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingStar 
                key={value} 
                filled={rating >= value}
                onPress={handleSetRating}
                value={value}
              />
            ))}
          </View>
          <TextInput
            placeholder="Leave a comment..."
            placeholderTextColor="#888"
            style={styles.feedbackInput}
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!rating || !comment.trim()) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmitFeedback}
            disabled={!rating || !comment.trim()}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={watchlistItems}
        renderItem={({ item }) => (
          <WatchlistItem
            item={item}
            onMovieSelect={onMovieSelect}
          />
        )}
        keyExtractor={keyExtractor}
        numColumns={1}
        contentContainerStyle={styles.list}
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  watchlistHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 16,
    flex: 1,
    textAlign: "center",
    marginRight: 30,
  },
  backButtonSmall: {
    padding: 8,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#0055AA",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    padding: 10,
    paddingBottom:70,
  },
  movieContainer: {
    backgroundColor: "#222",
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 120,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  movieName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sub: {
    color: "#bbb",
    fontSize: 14,
  },
  overview: {
    marginTop: 5,
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
  },
  ratingContainer: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  ratingText: {
    color: "#FFC107",
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#0055AA",
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    marginRight: 6,
  },
  addButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  feedbackForm: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
  },
  feedbackLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  feedbackInput: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    minHeight: 60,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#2c3e50",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  avgRatingContainer: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  avgRatingText: {
    color: "#f1c40f",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});