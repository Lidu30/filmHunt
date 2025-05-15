import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


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