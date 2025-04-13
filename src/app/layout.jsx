import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { reactiveModel } from "src/bootstrapping";
import { SuspenseView } from "../views/suspenseView";

export default observer(
function RootLayout() {
  
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
