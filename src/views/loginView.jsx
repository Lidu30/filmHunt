import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoginView = ({ username, password, onUsernameChange, onPasswordChange, onLoginPress }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={username}
      onChangeText={onUsernameChange}
      autoCapitalize="none"
      keyboardType="email-address"
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      value={password}
      onChangeText={onPasswordChange}
      secureTextEntry={true}
    />
    <Button title="Login" onPress={onLoginPress} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginView;
