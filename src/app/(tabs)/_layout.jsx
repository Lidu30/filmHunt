import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { reactiveModel } from '../../bootstrapping';
import { CustomTabBar } from '../../components/CustomTabBar';
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'


export default observer(function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={props => <CustomTabBar {...props} />}
        >
          <Tabs.Screen
            name="home"  
            options={{
              title: 'Home',
              tabBarIcon: () => <Ionicons name="home" size={22} color="#ffff" />
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
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons
                  name="manage-accounts"
                  size={26}         
                  color={'#fff'}
                />
              ),
            }}
          />
        </Tabs>
        {
          !reactiveModel.ready && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )
        }
      </View>
    </SafeAreaProvider>
  )
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});