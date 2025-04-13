import React, { useState } from 'react';
import { useRouter } from "expo-router";
import LoginView from '../views/loginView';
import { reactiveModel } from '../bootstrapping';
import { runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPresenter = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLoginPress() {
    if (username && password) {
      // for demonstration, we use the username as the token
      await AsyncStorage.setItem('userToken', username);

      runInAction(() => {
        reactiveModel.setUsername(username);
        reactiveModel.setUserDetails({
          name: username, 
          email: username,
          phone: ""
        });
        reactiveModel.user = { uid: Date.now().toString(), username };
      });
      console.log("After login, reactiveModel.user is:", reactiveModel.user);
      router.replace("/");
    } else {
      alert("Please fill in both the email and password");
    }
  }

  return (
    <LoginView
      username={username}
      password={password}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onLoginPress={handleLoginPress}
    />
  );
};

export default LoginPresenter;
