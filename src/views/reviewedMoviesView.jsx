import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";


export function ReviewedMoviesView(props) {
  const { reviewedMovies, loading, watchlist, onMovieSelect, onAddToWatchlist } = props;
  const router = useRouter();

  function renderReviewedMovieItem({ item }) {
    if (!item) return null;

    const posterUrl = item.moviePosterPath 
      ? `https://image.tmdb.org/t/p/w200${item.moviePosterPath}`
      : "https://via.placeholder.com/200x300?text=No+Poster";

    const releaseYear = item.movieReleaseDate 
      ? item.movieReleaseDate.substring(0, 4) 
      : "N/A";

    // Get the first comment for display
    const firstComment = item.reviews.find(review => review.comment)?.comment || "No comments yet";
    const isInWatchlist = watchlist.some((m) => m.id === item.movieId);

    function previewMovieACB() {
      onMovieSelect(item);
      router.push("/(tabs)/details");
    }

    function addToWatchlistACB() {
      if (!isInWatchlist) {
        onAddToWatchlist(item);
      } else {
        Alert.alert(
          "Already in Watchlist",
          `"${item.movieTitle}" is already in your watchlist.`,
          [{ text: "OK" }],
          { cancelable: true }
        );
      }
    }

    return (
      <Pressable
        role="button"
        style={styles.movieContainer}
        onPress={previewMovieACB}
      >
        <View style={styles.row}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: posterUrl }} />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.movieName} numberOfLines={2}>
              {item.movieTitle}
            </Text>
            <View style={styles.detailsRow}>
              <Text style={styles.sub}>
                {releaseYear}
              </Text>
            </View>
            
            <Text style={styles.reviewsInfo}>
              {item.ratingCount} rating{item.ratingCount !== 1 ? 's' : ''} • {item.reviews.length} review{item.reviews.length !== 1 ? 's' : ''}
            </Text>
            
            <Text numberOfLines={2} style={styles.comment}>
              "{firstComment}"
            </Text>
            
            <View style={styles.buttonRow}>
              <LinearGradient
                colors={["#4c669f", "#3b5998", "#192f6a"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={[styles.gradientButton, isInWatchlist && styles.disabledButton]}
              >
                <TouchableOpacity 
                  style={styles.gradientInner}
                  onPress={addToWatchlistACB}
                  disabled={isInWatchlist}
                >
                  <MaterialIcons 
                    name={isInWatchlist ? "check" : "add"} 
                    size={16} 
                    color="#fff" 
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.gradientText}>
                    {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0055AA" />
        <Text style={styles.loadingText}>Loading reviewed movies...</Text>
      </View>
    );
  }

  if (reviewedMovies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Movie Reviews Yet</Text>
        <Text style={styles.emptyText}>
          Be the first to rate and review movies! Go to any movie's details page to leave a review.
        </Text>
        <TouchableOpacity 
          style={styles.browseButton}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.browseButtonText}>Browse Movies</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Movies Reviewed by Filmhunt users</Text>
      <FlatList
        data={reviewedMovies}
        renderItem={renderReviewedMovieItem}
        keyExtractor={(item) => item.movieId.toString()}
        numColumns={1}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 40,
    marginBottom: 8,
    marginHorizontal: 16,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 16,
    marginHorizontal: 16,
    textAlign: "center",
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
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#0055AA",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    padding: 10,
    paddingBottom: 80,
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
  ratingGradient: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  ratingTextGradient: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsInfo: {
    color: "#999",
    fontSize: 12,
    marginBottom: 8,
  },
  comment: {
    color: "#aaa",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  gradientButton: {
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  disabledButton: {
    opacity: 0.6,
  },
  gradientInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonIcon: {
    marginRight: 4,
  },
  gradientText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});