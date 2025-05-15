import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function ProfileView({
  edit,
  setEdit,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  save,
  logout,
}) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      <View style={styles.inputGroup}>
        <Ionicons name="person-outline" size={20} color="#bbb" />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#888"
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={edit}
        />
        <TouchableOpacity onPress={() => setEdit(!edit)}>
          <Ionicons 
            name={edit ? "save-outline" : "create-outline"} 
            size={20} 
            color="#bbb" 
          />
        </TouchableOpacity>
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
          editable={edit}
        />
        <TouchableOpacity onPress={() => setEdit(!edit)}>
          <Ionicons 
            name={edit ? "save-outline" : "create-outline"} 
            size={20} 
            color="#bbb" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGroup}>
        <Ionicons name="mail-outline" size={20} color="#bbb" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={[styles.input, styles.readOnlyInput]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          editable={false}
        />
        <Ionicons name="lock-closed-outline" size={20} color="#666" />
      </View>

      {edit && (
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.submitButton}
        >
          <Pressable onPress={save} style={styles.pressable}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </LinearGradient>
      )}
      
      <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.navButton}>
        <Ionicons name="home-outline" size={24} color="#4c669f" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
        
        <TouchableOpacity onPress={logout} style={styles.navButton}>
          <Ionicons name="log-out-outline" size={24} color="#4c669f" />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileView;

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
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  navButton: {
    alignItems: 'center',
    padding: 10
  },
  navText: {
    color: '#4c669f',
    marginTop: 4,
    fontSize: 14
  },
  readOnlyInput: {
    color: '#999'
  },
});


// import React from "react"
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native"
// import { Link } from "expo-router"
// import MaterialIcons from "@expo/vector-icons/MaterialIcons"

// export function ProfileView({
//   edit,
//   setEdit,
//   name,
//   setName,
//   email,
//   setEmail,
//   phone,
//   setPhone,
//   save,
//   logout,
// }) {
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.heading}>Profile</Text>
      
//       </View>

//       <View style={styles.field}>
//         <Text style={styles.label}>Name</Text>
//         <View style={styles.row}>
//           <TextInput
//             style={[styles.input, !edit && styles.disabledInput]}
//             editable={edit}
//             placeholder="Full Name"
//             placeholderTextColor="#666"
//             value={name}
//             onChangeText={setName}
//           />
//           <Pressable onPress={() => setEdit(!edit)} style={styles.editButton}>
//             <MaterialIcons name="edit" size={22} color="#4B2E2A" />
//           </Pressable>
//         </View>
//       </View>

//       <View><Pressable onPress={logout} style={styles.logoutButton}>
//           <MaterialIcons name="logout" size={28} color="#4B2E2A" />
//         </Pressable></View>

//       <View style={styles.field}>
//         <Text style={styles.label}>Phone</Text>
//         <View style={styles.row}>
//           <TextInput
//             style={[styles.input, !edit && styles.disabledInput]}
//             editable={edit}
//             placeholder="123-456-7890"
//             placeholderTextColor="#666"
//             keyboardType="phone-pad"
//             value={phone}
//             onChangeText={setPhone}
//           />
//           <Pressable onPress={() => setEdit(!edit)} style={styles.editButton}>
//             <MaterialIcons name="edit" size={22} color="#4B2E2A" />
//           </Pressable>
//         </View>
//       </View>

//       <View style={styles.field}>
//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={[styles.input, !edit && styles.disabledInput]}
//           editable={edit}
//           placeholder="you@example.com"
//           placeholderTextColor="#666"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>
      

//       {edit && (
//         <TouchableOpacity style={styles.saveButton} onPress={save}>
//           <Text style={styles.saveText}>Save Changes</Text>
//         </TouchableOpacity>
//       )}

//       <Link href="/(tabs)/home" style={styles.backLink}>
//         <Text style={styles.backText}>← Home</Text>
//       </Link>
      
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: "#E6F2FA", 
//   },
//   header: {
//     position: "relative",         
//     alignItems: "center",        
//     justifyContent: "center",
//     marginBottom: 0,
//     height: 150,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#4B2E2A", 
//    textAlign: "center",          

//   },
//   logoutButton: {
//     padding: 8,
//     position: "absolute",
//     right: 0,
//     top: 350
//   },
//   field: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 6,
//     color: "#4B2E2A", 
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   input: {
//     flex: 1,
//     height: 44,
//     borderColor: "#0055AA",
//     borderWidth: 1,
//     borderRadius: 6,
//     paddingHorizontal: 10,
//    paddingVertical: 8,
//     color: "#000",
//   },
//   disabledInput: {
//     backgroundColor: "#f5f5f5",
//   },
//   editButton: {
//     marginLeft: 8,
//     padding: 4,
//   },
//   saveButton: {
//     marginTop: 16,
//     alignSelf: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 6,
//     backgroundColor: "#0055AA",
//   },
//   saveText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   backLink: {
//     position: "absolute",  
//     bottom: 300,
//     right: 200
//     },
//   backText: {
//     fontSize: 14,
//     color: "#0055AA", 
//   },
// })
