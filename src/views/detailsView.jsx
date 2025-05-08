import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
  } from "react-native"
import { Image } from "expo-image"
import { router } from "expo-router"
// import { getCardStyle } from "../utilities"
import { reactiveModel } from "../bootstrapping";
  
export function DetailsView(props) {

    function posterPathACB() {
        return "https://image.tmdb.org/t/p/w500" + props.movie.poster_path;
    }

    <Image 
                source={posterPathACB} style={styles.image} />

    return (
        <ScrollView style={styles.base}>
            <Text style={styles.whiteText}>{console.log(props)}</Text>
            
            <Image source={{ uri: posterPathACB() }} style={styles.image} />

            <View style={styles.container}>
                <Text style={styles.whiteText}>Comedy | Thriller | Drama</Text>
                <View style={styles.rowBetween}>
                    <Text style={styles.header}>{props.movie.title}</Text>
                    <Pressable 
                        style={true /* TODO */ ? styles.button : styles.button}
                        role="button"
                        disabled={props.isDishInMenu}
                        onPress={console.log}
                    >
                        <Text style={styles.subHeader}>+</Text>
                    </Pressable>
                </View>
                <Text style={styles.whiteText}>20XX</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.whiteText}>Rating: </Text>
                <Text style={styles.whiteText}>4.5 ⭐</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.subHeader}>Description</Text>
                <Text style={styles.whiteText}>movie description blablabla...</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.subHeader}>Cast {/* TODO: make a list */}</Text>
                <Text style={styles.whiteText}>list of actors...</Text>
            </View>

            <View style={styles.container}>
                <Text style={styles.whiteText}>Available on: {/* TODO: make a list */}</Text>
                <Text style={styles.whiteText}>list of streaming platforms...</Text>
            </View>

        </ScrollView>
        )
  }
  
  const styles = StyleSheet.create({
    base: {
        flex: 1,
        backgroundColor: "#807e80", // grey from prototype
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
    image: {
        width: "100%",
        aspectRatio: 3,
        borderRadius: 8,
        margin: 8,
    },
    whiteText: {
        color: "white",
    },
    button: {
        backgroundColor: "#cccccc",
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
  