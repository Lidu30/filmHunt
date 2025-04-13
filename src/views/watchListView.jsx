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
    
    //  just for test
    function renderSingleMovie() {
      // Provide defaults for missing props
      const movie = props.movie || {
        title: "The Gray Man",
        poster_path: "",
        whereToWatch: "Netflix",
        rating: 4.5
      }
  
      function posterPathACB() {
        return movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
          : "https://via.placeholder.com/100x140"; // Fallback image
      }
  
      function previewMovieACB() {
        if (props.movieChosen && movie) {
          props.movieChosen(movie);
          router.push("/details");
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
              <Image style={styles.image} source={{ uri: posterPathACB() }} />
            </View>
            
            <View style={styles.contentContainer}>
              <Text style={styles.movieName} numberOfLines={2}>
                {movie.title || "The Gray Man"} 
              </Text>
              <View style={styles.infoContainer}>
                <Text style={styles.whereToWatch}>
                  {movie.whereToWatch || "Netflix"}
                </Text>
                {movie.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{movie.rating || 4.5} ★</Text>
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
  
    function renderWatchList() {
      function renderWatchListItem(element) {
        const movie = element.item;
  
        function posterPathACB() {
          return movie.poster_path 
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : "https://via.placeholder.com/100x140"; // Fallback image
        }
  
        function previewMovieACB() {
          if (props.movieChosen) {
            props.movieChosen(movie);
            router.push("/details");
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
                <Image style={styles.image} source={{ uri: posterPathACB() }} />
              </View>
              
              <View style={styles.contentContainer}>
                <Text style={styles.movieName} numberOfLines={2}>
                  {movie.title || "The Gray Man"}
                </Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.whereToWatch}>
                    {movie.whereToWatch || "Netflix"}
                  </Text>
                  {movie.rating && (
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>{movie.rating || 4.5} ★</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        );
      }
  
      return (
        <FlatList
          data={props.watchList || []}
          renderItem={renderWatchListItem}
          keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
          numColumns={1}
          contentContainerStyle={styles.list}
        />
      );
    }
  
    // Decide which rendering method to use based on props
    return (
      <View style={styles.container}>
        {props.watchList ? renderWatchList() : renderSingleMovie()}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8f8f8",
    },
    list: {
      padding: 10,
    },
    movieContainer: {
      backgroundColor: "white",
      borderRadius: 8,
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