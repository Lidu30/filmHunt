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
  
  export function DetailsView(props) {
    function openMoreInfoACB() {
      if (props.dishData.sourceUrl) {
        Linking.openURL(props.dishData.sourceUrl)
      }
    }
  
    function addDishToMenuACB() {
      console.log(props.dishData)
      props.userWantsToAddDish()
      router.push("/")
    }
  
    function cancelACB() {
      router.push("/search")
    }
  
    function displayIngredientsCB(ingr) {
      return (
        <Text key={ingr.id}>
          {ingr.amount.toFixed(2)} {ingr.unit} {ingr.name}
        </Text>
      )
    }
  
    function displayInstructionsCB(instr) {
      return (
        <Text key={instr.number}>
          {instr.number}. {instr.step}
        </Text>
      )
    }

    return (<Text>this is the detailsView</Text>)
  
    /*return (
      <ScrollView>
        <View>
          <Text style={styles.title}>{props.dishData.title}</Text>
          <Image source={{ uri: props.dishData.image }} style={styles.image} />
        </View>
  
        <View style={styles.buttonRow}>
          <Pressable
            style={props.isDishInMenu ? styles.disabledButton : styles.button}
            role="button"
            disabled={props.isDishInMenu}
            onPress={addDishToMenuACB}
          >
            <Text>{props.isDishInMenu ? "Added to menu" : "Add to menu"}</Text>
          </Pressable>
  
          <Pressable
            style={styles.button}
            role="button"
            onPress={openMoreInfoACB}
          >
            <Text>More info</Text>
          </Pressable>
  
          <Pressable style={styles.cancelButton} role="button" onPress={cancelACB}>
            <Text style={styles.whiteText}>Cancel</Text>
          </Pressable>
        </View>
  
        <View style={styles.card}>
          <Text style={styles.header}>Price Information</Text>
          <Text>
            Price per serving: {props.dishData.pricePerServing.toFixed(2)}
          </Text>
          <Text>
            Total for {props.guests} guests:{" "}
            {(props.dishData.pricePerServing * props.guests).toFixed(2)}
          </Text>
        </View>
  
        <View style={styles.card}>
          <Text style={styles.header}>Ingredients</Text>
          <View>
            {props.dishData.extendedIngredients.map(displayIngredientsCB)}
          </View>
        </View>
  
        <View style={styles.card}>
          <Text style={styles.header}>Instructions</Text>
          <View>
            {props.dishData.analyzedInstructions?.[0]?.steps.map(
              displayInstructionsCB
            )}
          </View>
        </View>
      </ScrollView>
    )
      */
  }
  
  const styles = StyleSheet.create({
    input: {
      backgroundColor: "white",
      borderRadius: 8,
      margin: 8,
      padding: 8,
    },
    dishTypes: {
      borderRadius: 8,
      margin: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      margin: 8,
    },
    header: {
      fontSize: 15,
      fontWeight: "bold",
    },
    card: {
      //...getCardStyle(),
      padding: 10,
      backgroundColor: "#ffffff",
      borderRadius: 8,
      marginVertical: 8,
      margin: 8,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      backgroundColor: "#cccccc",
      borderRadius: 8,
      margin: 8,
      padding: 8,
      flex: 1,
      alignItems: "center",
    },
    disabledButton: {
      borderWidth: 2,  
      borderColor: "white",
      borderRadius: 8,
      margin: 8,
      padding: 8,
      flex: 1,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "#cc0000",
      borderRadius: 8,
      margin: 8,
      padding: 8,
      flex: 1,
      alignItems: "center",
    },
    image: {
      width: "96%",
      aspectRatio: 3,
      borderRadius: 8,
      margin: 8,
    },
    whiteText: {
      color: "white",
    },
  })
  