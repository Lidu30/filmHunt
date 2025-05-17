import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
  } from "react-native"
import { router } from "expo-router"
  
export function DetailsView(props) {

    const movie = props.movie

    function addToWatchlistACB() {
        // console.log('Current Movie:', movie);
        // console.log('Is in Watchlist:', props.inWatchList);
        props.addingToWatchList()
        // console.log('Is in Watchlist:', props.inWatchList);
    }

    function posterPathACB() {
        return "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
    }

    return (
        <ScrollView style={styles.base}>
            
            <Image source={{ uri: posterPathACB() }} style={styles.image} />

            <View style={styles.container}>
                <Text style={styles.grayText}>{props.movieGenres}</Text>
                <View style={styles.rowBetween}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={[styles.header, { flexShrink: 1 }]}>{movie.title}</Text>
                    </View> 
                    <Pressable 
                        style={styles.button}
                        role="button"
                        disabled={props.inWatchList}
                        onPress={addToWatchlistACB}
                    >
                        <Text style={styles.buttonText}>{props.inWatchList ? "In Watchlist" : " + " }</Text>
                    </Pressable>
                </View>
                <Text style={styles.grayText}>{movie.release_date ? movie.release_date.substring(0, 4) : ""}</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.whiteText}>Rating: </Text>
                <Text style={styles.whiteText}>⭐  {movie.vote_average
                    ? Math.round(props.movie.vote_average * 10) / 10
                    : "?"} / 10</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.subHeader}>Description</Text>
                <Text style={styles.grayText}>{movie.overview}</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.subHeader}>Cast</Text>
                <Text style={styles.grayText}>{props.movieCast}</Text>
            </View>

            <View style={styles.detailscontainer} >
                <Text style={styles.whiteText}>Available on:</Text>
                <Text style={styles.grayText}>{props.streamingPlatforms.length > 0
                    ? props.streamingPlatforms
                    : "Not available in your country" 
                    /* The country is preset to Sweden, see apiConfig.js */}
                </Text>
            </View>

        </ScrollView>
        )
  }
  
  const styles = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: "#111",
    },
    container: {
        padding: 16,

    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
    },
    subHeader: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    buttonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#bbb",
    },
    image: {
        width: "100%",
        aspectRatio: 3,
        margin: 0,
    },
    whiteText: {
        color: "white",
    },
    grayText: {
        color: "#bbb",
    },
    button: {
        backgroundColor: "#222",
        borderRadius: 8,
        margin: 0,
        padding: 8,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap"
    },

    detailscontainer: {
        padding: 16,
        marginBottom: 100 
    }
  })
  