import "../bootstrapping"
import { View } from "react-native"
import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Stack
        screenOptions={{
          title: "FilmHunt",
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  )
}
