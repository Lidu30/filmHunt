/* import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { reactiveModel } from "../bootstrapping";
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
)   */

import { observer } from 'mobx-react-lite';
import { Tabs } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import { reactiveModel } from '../bootstrapping';

export default observer(function RootLayout() {
  return reactiveModel.ready ? (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#333',
        },
      }}
    >
      <Tabs.Screen
        name="index"  
        options={{
          title: 'Home',
          tabBarIcon: () => <Text></Text>,
        }}
      />
      <Tabs.Screen
        name="watchList"  
        options={{
          title: 'WatchList',
          tabBarIcon: () => <Text></Text>,
        }}
      />
      <Tabs.Screen
        name="details"  
        options={{
          title: 'Details',
          tabBarIcon: () => <Text></Text>,
        }}
      />
    </Tabs>
  ) : (
    <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
  );
});
// havent added login but works somehow