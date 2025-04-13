import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react-lite';
import { reactiveModel } from '/src/bootstrapping';
import { Homepage } from '../presenters/homepagePresenter';
import { WatchList } from '../presenters/watchListPresenter';

const IndexPage = observer(() => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //token = null;
        const token = await AsyncStorage.getItem('userToken');
        console.log("AsyncStorage token:", token);
        if (token) {
          reactiveModel.user = { uid: 'dummyUID', username: token };
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView>
      <Homepage model={reactiveModel} />
      <WatchList model={reactiveModel} />
    </ScrollView>
  );
});

export default IndexPage;
