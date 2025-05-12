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
              <View style={styles.infoContainer}>
                <Text style={styles.whereToWatch}>
                  {movie.whereToWatch}
                </Text>
                {movie.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{movie.rating} ★</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteMovieACB}>
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
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
          {renderWatchListItem({ item: watchList[0] })}
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
      backgroundColor: "#f8f8f8",
    },
    watchlistHeader: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333",
      marginVertical: 16,
      marginHorizontal: 16,
    },
    emptyContainer: {
      flex: 1,
      backgroundColor: "#f8f8f8",
      justifyContent: "center", 
      alignItems: "center",
      padding: 20
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 16,
      color: "#666",
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
      backgroundColor: "white",
      borderRadius: 8,
      marginHorizontal: 10,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
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
      color: "#111",
      marginBottom: 8,
    },
    infoContainer: {
      marginTop: 8,
    },
    whereToWatch: {
      fontSize: 14,
      color: "#555",
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
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#f5f5f5",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    deleteButtonText: {
      fontSize: 20,
      color: "#ff4d4f",
      fontWeight: "bold",
      marginTop: -2,
    }
  });  