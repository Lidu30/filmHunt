import React from "react"
import {
  StyleSheet,
  Button,
  Text,
  TextInput,
  View,
} from "react-native"
import { Link } from "expo-router"

export function LoginView({ user, setUser, pass, setPass, onLogin }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={user}
        onChangeText={setUser}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />

      <View style={styles.buttonWrapper}>
        <Button
          title="Log In"
          onPress={onLogin}
          color="#0055AA"       
        />
      </View>

      <Link href="/signup" style={styles.signupLink}>
        <Text style={styles.signupText}>
          Don’t have an account?{" "}
          <Text style={styles.signupAction}>Sign up</Text>
        </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#E6F2FA",  
  },
  heading: {
    fontSize: 28,
    marginBottom: 32,
    textAlign: "center",
    color: "#4B2E2A",            
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#0055AA",      
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 12,
    color: "#000",              
  },
  buttonWrapper: {
    marginVertical: 12,
    borderRadius: 6,
    overflow: "hidden",         
  },
  signupLink: {
    marginTop: 24,
    alignSelf: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#4B2E2A",            
  },
  signupAction: {
    color: "#0055AA",           
    fontWeight: "bold",
  },
})
