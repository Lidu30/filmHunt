import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { searchMovies } from "../apiConfig"; 
import { router } from "expo-router";
import model from "../model";
import { reactiveModel } from "../bootstrapping";

export const HomepageView = observer(({ 
  moviesarray = [], 
  isLoading, 
  loadingMore, 
  fetchMoreMovies, 
  addToWatchlist,
  currentPage = 1,
  totalPages = 1,
  onMovieSelect
}) => {
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchLoadingMore, setSearchLoadingMore] = useState(false);

  function goToDetails(movie) {
    console.log("Navigating to movie details:", movie);
    onMovieSelect(movie)
    
    router.push("./details");
    /* getMovieDetails(movie); */    
  }

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchCurrentPage(1);
    }
  };

  const handleSearch = async (page = 1) => {
    if (searchQuery.trim() === "") return;

    if (page === 1) {
      setIsSearching(true);
      setIsLoadingSearch(true);
      setSearchResults([]);
    } else {
      setSearchLoadingMore(true);
    }

    try {
      console.log("searching movies for:", searchQuery, "page:", page);
      const response = await searchMovies({
        query: searchQuery,
        include_adult: false,
        language: "en-US",
        page: page,
      });

      if (response && Array.isArray(response)) {
        if (page === 1) {
          setSearchResults(response);
        } else {
          setSearchResults((prev) => [...prev, ...response]);
        }
        setSearchTotalPages(Math.min(10, Math.ceil(response.length / 20) + page));
      } else if (response && response.results) {
        if (page === 1) {
          setSearchResults(response.results);
        } else {
          setSearchResults((prev) => [...prev, ...response.results]);
        }
        setSearchTotalPages(response.total_pages || 1);
      }
      setSearchCurrentPage(page);
    } catch (error) {
      console.error("Search error:", error);
      if (page === 1) {
        setSearchResults([]);
      }
    } finally {
      setIsLoadingSearch(false);
      setSearchLoadingMore(false);
    }
  };

  const loadMoreResults = async () => {
    console.log("Load more clicked");
    if (isSearching) {
      if (searchCurrentPage < searchTotalPages && !searchLoadingMore && !isLoadingSearch) {
        console.log("Loading more search results, page:", searchCurrentPage + 1);
        await handleSearch(searchCurrentPage + 1);
      }
    } else {
      if (!loadingMore && typeof fetchMoreMovies === 'function') {
        console.log("Loading more movies from main list");
        await fetchMoreMovies();
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setSearchCurrentPage(1);
  };

  const handleAddToWatchlist = (movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist((prev) => [...prev, movie]);
        addToWatchlist(movie);
    } else {
      console.log(`${movie.title} is already in your watchlist.`);
      Alert.alert(
      "Already in Watchlist",
      `"${movie.title}" is already in your watchlist.`,
      [{ text: "OK" }],
      { cancelable: true }
    );
    }
    
  };

  const moviesToDisplay = isSearching ? searchResults : moviesarray;
  const displayCurrentPage = isSearching ? searchCurrentPage : currentPage;
  const displayTotalPages = isSearching ? searchTotalPages : totalPages;
  const isCurrentlyLoading = isSearching ? isLoadingSearch : isLoading;
  const isCurrentlyLoadingMore = isSearching ? searchLoadingMore : loadingMore;
  const hasMorePages = isSearching 
    ? searchCurrentPage < searchTotalPages 
    : currentPage < totalPages;

  console.log("Current page:", displayCurrentPage, "Total pages:", displayTotalPages);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Find Movie</Text>

        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search movies..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onSubmitEditing={() => handleSearch(1)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.iconButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => handleSearch(1)}
            style={styles.searchButton}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {isCurrentlyLoading && !isCurrentlyLoadingMore && (
          <ActivityIndicator
            size="large"
            color="#3498db"
            style={styles.loader}
          />
        )}

        {isSearching && !isLoadingSearch && (
          <View style={styles.resultsInfo}>
            {searchResults.length > 0 ? (
              <Text style={styles.resultsText}>
                Found {searchResults.length} results for "{searchQuery}"
              </Text>
            ) : (
              <Text style={styles.noResults}>
                No movies found for "{searchQuery}"
              </Text>
            )}
          </View>
        )}

        <View style={styles.movieGrid}>
          {moviesToDisplay && moviesToDisplay.map((movie) => {
            if (!movie) return null;
            const isInWatchlist = watchlist.some((m) => m.id === movie.id);
            return (
              <SwipeableMovieCard
                key={movie.id}
                movie={movie}
                onAddToWatchlist={handleAddToWatchlist}
                isInWatchlist={isInWatchlist}
                onPress={ /*goToDetails*/ () => {
                  goToDetails(movie);
                  console.log("reached", movie);
                }}
              />
            );
          })}
        </View>

        {moviesToDisplay && moviesToDisplay.length > 0 && hasMorePages && (
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={loadMoreResults}
            disabled={isCurrentlyLoadingMore}
          >
            {isCurrentlyLoadingMore ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.paginationButtonText}>
                Load More Movies
              </Text>
            )}
          </TouchableOpacity>
        )}

        {moviesToDisplay && moviesToDisplay.length > 0 && (
          <Text style={styles.paginationInfo}>
            Page {displayCurrentPage} of {displayTotalPages}
          </Text>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </GestureHandlerRootView>
  );
});

const SwipeableMovieCard = ({ movie, onAddToWatchlist, isInWatchlist, onPress }) => {
  const translateX = useSharedValue(0);
  const swipeThreshold = 100;

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value > swipeThreshold) {
        runOnJS(onAddToWatchlist)(movie);
        console.log("added to watchlist", [...model.watchlist]);
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
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  ⭐{" "}
                  {movie?.vote_average
                    ? Math.round(movie.vote_average * 10) / 10
                    : "?"}
                </Text>
              </View>
            </View>
            <Text numberOfLines={3} style={styles.overview}>
              {movie?.overview || "No overview available."}
            </Text>
            {isInWatchlist && (
              <View style={styles.watchlistBadge}>
                <Text style={styles.watchlistText}>In Watchlist</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#121212",
    flex: 1,
  },
  header: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    color: "white",
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconButton: {
    padding: 8,
  },
  searchButton: {
    marginLeft: 5,
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  clearButtonText: {
    color: "#aaa",
    fontSize: 18,
  },
  loader: {
    marginVertical: 30,
  },
  resultsInfo: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  resultsText: {
    color: "#3498db",
    fontSize: 16,
    textAlign: "center",
  },
  noResults: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 30,
  },
  movieGrid: {
    flexDirection: "column",
    gap: 15,
  },
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
  overview: {
    marginTop: 5,
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
  },
  watchlistBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(46, 204, 113, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  watchlistText: {
    color: "#2ecc71",
    fontSize: 12,
    fontWeight: "bold",
  },
  paginationButton: {
    backgroundColor: "#3498db",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    marginHorizontal: 20,
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  paginationInfo: {
    textAlign: "center",
    color: "#999",
    marginTop: 12,
    fontSize: 14,
  },
  bottomPadding: {
    height: 40,
  },
});