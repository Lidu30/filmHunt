import {
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
  } from "react-native"
import { useRouter } from "expo-router"
  
export function EmptyDetailsView() {

    const router = useRouter();

    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No movie selected</Text>
            <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push("/(tabs)/home")}
            >
            <Text style={styles.addButtonText}>Browse Movies</Text>
            </TouchableOpacity>
        </View>
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
  