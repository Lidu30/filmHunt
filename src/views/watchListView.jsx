import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView 
}from "react-native";

  import { Image } from "expo-image";
  import { router } from "expo-router";
  import MaterialIcons from "@expo/vector-icons/MaterialIcons";
  import { LinearGradient } from "expo-linear-gradient";
  
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
                <LinearGradient
                  colors={['#4c669f','#3b5998','#192f6a']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.ratingGradient}
                >
                  <Text style={styles.ratingTextGradient}>
                    ⭐ {movie.vote_average ? Math.round(movie.vote_average*10)/10 : "?"}
                  </Text>
                </LinearGradient>
              </View>
              <Text numberOfLines={3} style={styles.overview}>
                {movie.overview || "No overview available."}
              </Text>
              <LinearGradient
                colors={["#4c669f", "#3b5998", "#192f6a"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradientButton}
              >
                <TouchableOpacity 
                  style={styles.gradientInner}
                  onPress={deleteMovieACB}
                >
                  <Text style={styles.gradientText}>Remove</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Pressable>
      );
    }

    function renderRecommendationItem({item}) {
      const posterUrl = item?.poster_path 
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : "https://via.placeholder.com/200x300?text=No+Poster";

      function previewRecommendationACB() {
        if (props.movieChosen) {
          props.movieChosen(item);
          router.push("/(tabs)/details");
        }
      }

      return (
        <TouchableOpacity style={styles.recommendationCard} onPress={previewRecommendationACB}>
          <Image style={styles.recommendationImage} source={{ uri: posterUrl }} contentFit="cover" /> 
          <View style={styles.recommendationOverlay}>
            <Text style={styles.recommendationTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.recommendationRating}>
              <MaterialIcons name="star" size={14} color="#FFC107" />
                <Text style={styles.recommendationRatingText}>
                  {item.vote_average ? (Math.round(item.vote_average * 10) / 10) : "?"}
                </Text>
            </View>   
            <LinearGradient
                colors={["#4c669f", "#3b5998", "#192f6a"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradientButtonSmall}
              >
                <TouchableOpacity
                  style={styles.gradientInnerSmall}
                  onPress={() => props.onAddToWatchlist(item)}
                >
                  <MaterialIcons name="add" size={14} color="#fff" />
                  <Text style={styles.gradientTextSmall}>Add</Text>
                </TouchableOpacity>
              </LinearGradient>
          </View>
        </TouchableOpacity>       
      );
      
    }
     // Render the recommendations section
    function renderRecommendationsSection() {
      if (!props.recommendations || props.recommendations.length === 0) {
          return null;
      }

      return (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsHeader}>Recommended For You</Text>
          
          {props.loadingRecommendations ? (
            <ActivityIndicator size="large" color="#0055AA" style={styles.loader} />
          ) : (
              <FlatList
                data={props.recommendations}
                renderItem={renderRecommendationItem}
                keyExtractor={(item) => item.id?.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            />
          )}
        </View>
        
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
          {renderRecommendationsSection()}
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
            ListFooterComponent={renderRecommendationsSection} // Add this line
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
      marginTop: 40,
      marginBottom: 16,
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
      color: "#bbb",
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
    recommendationsContainer: {
        marginTop: 20,
        paddingBottom: 80,
    },
    recommendationsHeader: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 16,
        marginHorizontal: 16,
    },
    scrollViewContent: {
        paddingLeft: 16,
        paddingRight: 8,
    },
    loader: {
        marginVertical: 20,
    },
    recommendationCard: {
        width: 180,
        height: 280,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#222',
        marginRight: 12,
    },
    recommendationImage: {
        width: '100%',
        height: '100%',
    },
    recommendationOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
    },
    recommendationTitle: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    recommendationRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    recommendationRatingText: {
        color: '#FFC107',
        fontSize: 12,
        marginLeft: 4,
    },
    gradientButton: {
      borderRadius: 6,
      overflow: 'hidden',
      alignSelf: 'flex-start',
      marginTop: 12,
    },
    gradientInner: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    gradientText: {
      color: '#fff',
      fontWeight: '600',
    },
  
    gradientButtonSmall: {
      borderRadius: 6,
      overflow: 'hidden',
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    gradientInnerSmall: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 10,
    },
    gradientTextSmall: {
      color: '#fff',
      fontSize: 12,
      marginLeft: 4,
    },  
    ratingGradient: {
      alignSelf: 'flex-start',
      borderRadius: 6,
      overflow: 'hidden',
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginLeft: 6,
    },
    ratingTextGradient: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  });  