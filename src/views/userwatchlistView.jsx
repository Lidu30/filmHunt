import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RatingStar } from "../components/RatingStar";

const WatchlistItem = ({
  item,
  onPress,
  onAddToWatchlist,
  isInWatchlist,
}) => {
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Poster";

  return (
    <Pressable style={styles.movieContainer} onPress={() => onPress(item)}>
      <View style={styles.row}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: posterUrl }} style={styles.image} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.movieName} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.sub}>
              {item.release_date?.substring(0, 4) || "N/A"}
            </Text>
            <Text style={styles.ratingText}>
              ⭐ {item.vote_average?.toFixed(1) || "?"}
            </Text>
          </View>
          <Text style={styles.overview} numberOfLines={3}>
            {item.overview || "No overview available."}
          </Text>
          <TouchableOpacity
            onPress={() => onAddToWatchlist(item)}
            style={[
              styles.addButton,
              isInWatchlist ? styles.addButtonDisabled : styles.addButtonEnabled,
            ]}
            disabled={isInWatchlist}
          >
            <MaterialIcons 
              name={isInWatchlist ? "check" : "add"} 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.addButtonText}>
              {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export const UserWatchlistView = ({
  loading,
  userName,
  watchlistItems,
  onMovieSelect,
  onBack,
  onAddToWatchlist,
  showFeedback,
  toggleFeedback,
  rating,
  setRating,
  comment,
  setComment,
  onSubmitFeedback,
  feedbackList,
  averageRating,
  isInWatchlist,
}) => {
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0055AA" />
        <Text style={styles.loadingText}>Loading watchlist...</Text>
      </View>
    );
  }

  if (!watchlistItems?.length) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="movie" size={64} color="#666" />
        <Text style={styles.emptyTitle}>
          {userName ? `${userName}'s watchlist is empty` : "Watchlist is empty"}
        </Text>
        <Text style={styles.emptySubtitle}>
          No movies have been added to this watchlist yet.
        </Text>
     <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButtonSmall}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.watchlistHeader}>
          {userName ? `${userName}'s Watchlist` : "Watchlist"}
        </Text>
        <TouchableOpacity 
          onPress={toggleFeedback} 
          style={styles.reviewButton}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={showFeedback ? "close" : "rate-review"} 
            size={24} 
            color="#f1c40f" 
          />
        </TouchableOpacity>
      </View>

      {averageRating !== null && (
        <View style={styles.avgRatingContainer}>
          <Text style={styles.avgRatingText}>
            Average Rating: ⭐ {averageRating.toFixed(1)} (
            {feedbackList?.length || 0} review
            {feedbackList?.length !== 1 ? "s" : ""})
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
                onPress={() => {
                  console.log("Star clicked:", value); 
                  setRating(value);
                }}
              />
            ))}
          </View>
          <Text style={styles.debugText}>Current rating: {rating}</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Leave a comment..."
            placeholderTextColor="#aaa"
            multiline
            value={comment}
            onChangeText={(text) => {
              console.log("Comment changed:", text); 
              setComment(text);
            }}
            maxLength={500}
          />
          <Text style={styles.debugText}>Comment length: {comment.length}</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              onPress={() => {
                setRating(0);
                setComment("");
                toggleFeedback();
              }}
              style={[styles.cancelButton]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmitFeedback}
              disabled={!rating || rating === 0 || !comment || !comment.trim()}
              style={[
                styles.submitButton,
                (!rating || rating === 0 || !comment || !comment.trim()) && styles.submitButtonDisabled,
              ]}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={watchlistItems}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <WatchlistItem
            item={item}
            onPress={onMovieSelect}
            onAddToWatchlist={onAddToWatchlist}
            isInWatchlist={isInWatchlist(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50, 
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  watchlistHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  backButtonSmall: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
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
    marginBottom: 8,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 24,
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
    paddingBottom: 70,
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
    alignItems: "flex-start",
  },
  imageContainer: {
    width: 80,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
    marginBottom: 12,
  },
  ratingText: {
    color: "#FFC107",
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  addButtonEnabled: {
    backgroundColor: "#0055AA",
  },
  addButtonDisabled: {
    backgroundColor: "#444",
  },
  addButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  feedbackForm: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  feedbackLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "600",
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "flex-start",
  },
  feedbackInput: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    minHeight: 80,
    marginBottom: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#444",
  },
  feedbackButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  submitButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
  },
  submitButtonDisabled: {
    backgroundColor: "#2c3e50",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  avgRatingContainer: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 6,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  avgRatingText: {
    color: "#f1c40f",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default UserWatchlistView;