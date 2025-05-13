import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
  } from "react-native";
  import { Image } from "expo-image";
  import { router } from "expo-router";
  
  export function WatchListView(props) {
    function renderWatchListItem(element) {
  const movie = element.item;
  if (!movie) return null;

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Poster";

  // Get release year if available
  const releaseYear = movie.release_date 
    ? movie.release_date.substring(0, 4) 
    : "N/A";

  function previewMovieACB() {
    if (props.movieChosen) {
      props.movieChosen(movie);
      router.push("/(tabs)/details");
    }
  }

  function deleteMovieACB() {
    if (props.onDeleteMovie) {
      props.onDeleteMovie(movie.id);
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
            {movie.title}
          </Text>
          <View style={styles.detailsRow}>
            <Text style={styles.sub}>
              {releaseYear}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐{" "}
                {movie.vote_average
                  ? Math.round(movie.vote_average * 10) / 10
                  : "?"}
              </Text>
            </View>
          </View>
          <Text numberOfLines={3} style={styles.overview}>
            {movie.overview || "No overview available."}
          </Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={deleteMovieACB}
          >
            <Text style={styles.deleteButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

    if (props.watchList.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.addButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (props.watchList.length === 1) {
      return (
        <View style={styles.container}>
          <Text style={styles.watchlistHeader}>Your Watchlist</Text>
          {renderWatchListItem({ item: props.watchList[0] })}
        </View>
      );
    }
  

    return (
      <View style={styles.container}>
        <Text style={styles.watchlistHeader}>Your Watchlist</Text>
          <FlatList
            data={props.watchList || []}
            renderItem={renderWatchListItem}
            keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
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
    watchlistHeader: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fff",
      marginVertical: 16,
      marginHorizontal: 16,
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: "#121212",
      justifyContent: "center", 
      alignItems: "center",
      padding: 20
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 16,
      color: "#aaa", //Light gray
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 24
    },
    addButton: {
      backgroundColor: "#0055AA",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 16
    },
    addButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold"
    },
    list: {
      padding: 10,
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
    infoContainer: {
      marginTop: 8,
    },
    whereToWatch: {
      fontSize: 14,
      color: "#bbb", //dark gray
      marginBottom: 8,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      fontSize: 14,
      color: "#f5a623",
      fontWeight: "bold",
    },
    deleteButton: {
      backgroundColor: "#fff",
      paddingVertical: 6,
      paddingHorizontal: 80,
      borderRadius: 4,
      marginTop: 16
    },
    deleteButtonText: {
      fontSize: 15,
      color: "#ff0000",
      fontWeight: "bold",
      marginTop: -2,
      
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

  });  