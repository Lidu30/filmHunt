import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const SwipeableMovieCard = ({ movie, onAddToWatchlist, isInWatchlist, onPress }) => {
  const translateX = useSharedValue(0);
  const swipeThreshold = 100;

  const panGesture = Gesture.Pan()
    .activeOffsetX(15) 
    .failOffsetY([-15, 15]) 
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value > swipeThreshold) {
        runOnJS(onAddToWatchlist)(movie);
      }
      translateX.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: isInWatchlist ? 0.5 : 1,
  }));
  
  const posterUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={onPress} 
          style={{ flexDirection: "row", flex: 1 }}
        >
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {movie?.title || "Unknown Title"}
            </Text>
            <View style={styles.detailsRow}>
              <Text style={styles.sub}>
                {movie?.release_date ? movie.release_date.substring(0, 4) : "N/A"}
              </Text>
              <LinearGradient
                colors={['#4c669f','#3b5998','#192f6a']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.ratingGradient}
              >
                <Text style={styles.ratingTextGradient}>
                  ⭐ {movie?.vote_average ? (Math.round(movie.vote_average * 10) / 10) : "?"}
                </Text>
              </LinearGradient>
            </View>
            <Text numberOfLines={2} style={styles.overview}>
              {movie?.overview || "No overview available."}
            </Text>
            {isInWatchlist && (
              <LinearGradient
                colors={['#4c669f','#3b5998','#192f6a']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.watchlistGradient}
              >
                <Text style={styles.watchlistTextGradient}>In Watchlist</Text>
              </LinearGradient>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  poster: {
    width: 110,
    height: 165,
    backgroundColor: "#1a1a1a",
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
    position: "relative",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 8,
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
  watchlistGradient: {
    position: 'absolute',
    top: 2.5,
    right: 6,
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: 1,
    paddingHorizontal: 6,
  },
  watchlistTextGradient: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingGradient: {
    borderRadius: 6,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 6,
    backgroundColor: 'transparent',
  },
  ratingTextGradient: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});