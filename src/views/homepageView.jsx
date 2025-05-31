import { observer } from "mobx-react-lite";
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import { SwipeableMovieCard } from "../components/swipeableMoviecard";

export const HomepageView = observer(({ 
  // main
  movies = [],
  isLoading,
  loadingMore,
  currentPage = 1,
  totalPages = 1,
  onFetchMoreMovies,
  
  // search
  searchQuery = "",
  searchResults = [],
  isSearching = false,
  isLoadingSearch = false,
  searchCurrentPage = 1,
  searchTotalPages = 1,
  searchLoadingMore = false,
  onSearchChange,
  onSearch,
  onSearchMore,
  onClearSearch,
  moviesToDisplay = [],
  displayCurrentPage = 1,
  displayTotalPages = 1,
  isCurrentlyLoading = false,
  isCurrentlyLoadingMore = false,
  hasMorePages = false,
  onGoToDetails,
  onAddToWatchlistWithAlert,
  onLoadMore,
  isMovieInWatchlist
}) => {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Find Movie</Text>

        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Search movies..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={onSearchChange}
            onSubmitEditing={() => onSearch(1)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={onClearSearch} style={styles.iconButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.searchButtonGradient}
          >
            <TouchableOpacity
              onPress={() => onSearch(1)}
              style={styles.searchButtonInner}
            >
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {isCurrentlyLoading && !isCurrentlyLoadingMore && (
          <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
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
            const isInWatchlist = isMovieInWatchlist(movie.id);
            return (
              <SwipeableMovieCard
                key={movie.id}
                movie={movie}
                onAddToWatchlist={onAddToWatchlistWithAlert}
                isInWatchlist={isInWatchlist}
                onPress={() => onGoToDetails(movie)}
              />
            );
          })}
        </View>

        {moviesToDisplay && moviesToDisplay.length > 0 && hasMorePages && (
          <TouchableOpacity
            style={styles.paginationButton}
            onPress={onLoadMore}
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#121212",
    flex: 1,
    paddingTop: 40,   
  },
  header: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: -25,
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
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  clearButtonText: {
    color: "#aaa",
    fontSize: 18,
  },
  searchButtonGradient: {
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 5,
  },
  searchButtonInner: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    marginBottom: 85,
  },
  bottomPadding: {
    height: 40,
  },
});