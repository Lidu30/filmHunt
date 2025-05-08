import React from "react"
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
} from "react-native"
import { Link } from "expo-router"

export function SignupView({
  name,
  setName,
  phone,
  setPhone,
  user,
  setUser,
  pass,
  setPass,
  pass2,
  setPass2,
  signup,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#666"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={pass2}
        onChangeText={setPass2}
      />

      <View style={styles.buttonWrapper}>
        <Button
          title="Sign Up"
          onPress={signup}
          color="#0055AA"  
        />
      </View>

      <View style={styles.loginLinkContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Link href="/login" style={styles.loginLink}>
          Log in
        </Link>
      </View>
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
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: "#4B2E2A",            
  },
  loginLink: {
    fontSize: 14,
    color: "#0055AA",           
    fontWeight: "bold",
  },
})
