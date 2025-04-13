import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { reactiveModel } from "src/bootstrapping";
import { SuspenseView } from "../views/suspenseView";

console.log("Layout file loaded"); // Top-level log

export default
observer(
function RootLayout() {
  const router = useRouter();

  console.log("Layout rendering, user:", reactiveModel.user, "ready:", reactiveModel.ready);
  
  useEffect(() => {
    console.log("useEffect in layout, reactiveModel.user:", reactiveModel.user);
    if (!reactiveModel.user) {
      console.log("No user detected, redirecting to /login");
      router.replace("/login");
    }
  }, [reactiveModel.user, router]);

 // Return null during loading or when no user is set
 if (!reactiveModel.user) {
  console.log("No user, returning null");
  return null;
}
  function renderIndexTabIconACB() {
    return <Text>🍽</Text>
  }

  function renderWatchListTabIconACB() {
    return <Text>📝</Text>
  }

  function renderDetailsTabIconACB() {
    return <Text>📄</Text>
  }

  return reactiveModel.ready ? (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: renderIndexTabIconACB,
        }}
      />
    
      <Tabs.Screen
        name="watchList"
        options={{
          title: "WatchList",
          tabBarIcon: renderWatchListTabIconACB,
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: "Details",
          tabBarIcon: renderDetailsTabIconACB,
        }}
      />
    </Tabs>
  ) : (
    <SuspenseView 
      promise = {"loading..."}
      error = {null} 
    />
  );
}
)  
