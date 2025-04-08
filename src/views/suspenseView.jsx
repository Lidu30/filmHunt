import { StyleSheet, Text, View } from "react-native"
import { Image } from "expo-image"

export function SuspenseView(props) {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["

  if (props.error) {
    return (
      <View>
        <Text> {props.error.toString()}</Text>
      </View>
    )
  }

  if (props.promise && !props.dishData) {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source="https://brfenergi.se/iprog/loading.gif"
          placeholder={{ blurhash }}
          contentFit="cover" //so that the image is resized to cover the container
          transition={1000} //a smooth fade-in transition for the image once it has loaded. 1 sec is the duration of transition
        />
      </View>
    )
  }

  return (
    <View>
      <Text>no data</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: "#0553",
  },
})
