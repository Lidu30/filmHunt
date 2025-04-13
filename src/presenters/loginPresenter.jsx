import React, { useState } from 'react';
import { useRouter } from "expo-router";
import LoginView from '../views/loginView';
import { reactiveModel } from '../bootstrapping';
import { runInAction } from 'mobx'; // Add this import

const LoginPresenter = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLoginPress() {
    console.log("Login attempt with:", username);
    if (username && password) {
      runInAction(() => {
        reactiveModel.setUsername(username);
        reactiveModel.setUserDetails({ 
          name: username, 
          email: username + "@example.com",
          phone: ""
        });
        reactiveModel.setUser({ uid: Date.now().toString(), username });
      });
      console.log("After login, model.user is:", reactiveModel.user);
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
export { LoginPresenter };