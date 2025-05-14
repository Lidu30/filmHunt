import {
    Image,
    Linking,
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
        // TODO
        console.log('WOOOO Current Movie:', movie);
        console.log('Is in Watchlist:', props.inWatchList);
        props.addingToWatchList(movie);
    }

    function posterPathACB() {
        console.log("current movie:", movie)
        return "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
    }

    return (
        <ScrollView style={styles.base}>
            
            <Image source={{ uri: posterPathACB() }} style={styles.image} />

            <View style={styles.container}>
                <Text style={styles.grayText}>{props.movieGenres}</Text>
                <View style={styles.rowBetween}>
                    <Text style={styles.header}>{movie.title}</Text>
                    <Pressable 
                        style={true /* TODO */ ? styles.button : styles.button}
                        role="button"
                        // disabled={props.isDishInMenu}
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

            <View style={styles.container}>
                <Text style={styles.whiteText}>Available on:</Text>
                <Text style={styles.grayText}>{props.streamingPlatforms}</Text>
            </View>

        </ScrollView>
        )
  }
  
  const styles = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: "#111",
        // backgroundColor: "#807e80", // grey from prototype
        // padding: 16, // spacing
    },
    container: {
        // flex: 1,
        // backgroundColor: "#807e80", // grey from prototype
        padding: 16, // spacing
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
        // borderRadius: 8,
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
        // backgroundColor: "#cccccc",
        borderRadius: 8,
        margin: 0,
        padding: 8,
        // flex: 1,
        // alignItems: "center",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
  })
  