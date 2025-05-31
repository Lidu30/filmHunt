import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { observer } from "mobx-react-lite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { reactiveModel } from "../../bootstrapping.js";
import { CustomTabBar } from "../../components/CustomTabBar";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message"; 

export default observer(function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomTabBar {...props} />}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: () => (
                <Ionicons name="home" size={22} color="#ffff" />
              ),
            }}
          />
          <Tabs.Screen
            name="watchList"
            options={{
              title: "WatchList",
              tabBarIcon: () => (
                <MaterialCommunityIcons
                  name="playlist-star"
                  size={30}
                  color="white"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="details"
            options={{
              title: "Details",
              tabBarIcon: () => (
                <MaterialIcons name="movie-filter" size={24} color="white" />
              ),
            }}
          />
          <Tabs.Screen
            name="reviewedMovies"
            options={{
              title: "Reviews",
              tabBarIcon: () => (
                <MaterialIcons name="rate-review" size={24} color="white" />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "User Profile",
              tabBarIcon: () => (
                <MaterialIcons
                  name="manage-accounts"
                  size={26}
                  color={"#fff"}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="toplist"
            options={{
              title: "Toplist",
              tabBarIcon: () => (
                <MaterialIcons name="leaderboard" size={24} color="white" />
              ),
            }}
          />
        </Tabs>
        {!reactiveModel.ready && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <Toast />
      </View>
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
