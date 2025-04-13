import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginView = ({ username, password, onUsernameChange, onPasswordChange, onLoginPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FilmHunt</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={username}
          onChangeText={onUsernameChange}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={onPasswordChange}
        />
        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2167b8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
