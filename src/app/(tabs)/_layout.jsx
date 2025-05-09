import { observer } from 'mobx-react-lite';
import { Tabs } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { reactiveModel } from '../../bootstrapping';

// TODO: update icons
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
          tabBarIcon: () => <Text>🍽</Text>,
        }}
      />
      <Tabs.Screen
        name="watchList"  
        options={{
          title: 'WatchList',
          tabBarIcon: () => <Text>📝</Text>,
        }}
      />
      <Tabs.Screen
        name="details"  
        options={{
          title: 'Details',
          tabBarIcon: () => <Text>📄</Text>,
        }}
      />
      <Tabs.Screen
          name="profile"
          options={{
            title: "User Profile",
            tabBarIcon: ({ color }) => {
              return (
                <MaterialIcons name="manage-accounts" size={24} color={color} />
              )
            },
          }}
        />
    </Tabs>
  ) : (
    <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
  );
});
