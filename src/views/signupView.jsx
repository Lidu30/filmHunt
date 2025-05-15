/* import React from "react"
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
*/
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';


export function SignupView({
  signup,
  name,
  setName,
  phone,
  setPhone,
  user,
  setUser,
  pass,
  setPass,
  pass2,
  setPass2
}) {
  const router = useRouter()
  const [secureEntry, setSecureEntry] = useState(true);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <View style={styles.inputGroup}>
        <Ionicons name="person-outline" size={20} color="#bbb" />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#888"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Ionicons name="call-outline" size={20} color="#bbb" />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>
      <View style={styles.inputGroup}>
        <Ionicons name="mail-outline" size={20} color="#bbb" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={user}
          onChangeText={setUser}
        />
      </View>
      <View style={styles.inputGroup}>
        <Ionicons name="lock-closed-outline" size={20} color="#bbb" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry={secureEntry}
          value={pass}
          onChangeText={setPass}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
          <Ionicons
            name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#bbb"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Ionicons name="lock-closed-outline" size={20} color="#bbb" />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry={secureEntry}
          value={pass2}
          onChangeText={setPass2}
        />
      </View>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        start={{ x: 0, y: 1 }} 
        end={{ x: 0, y: 0 }}   
        style={styles.submitButton}
      >
        <Pressable onPress={signup} style={styles.pressable}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
      </LinearGradient>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Log In</Text>
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 30,
    alignSelf: 'center'
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    fontSize: 16
  },
  submitButton: {
    borderRadius: 8,
    marginTop: 20,
    overflow: 'hidden'
  },
  pressable: {
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  footerText: {
    color: '#bbb',
    fontSize: 14
  },
  link: {
    color: '#4c669f',
    fontSize: 14,
    fontWeight: '600'
  }
});