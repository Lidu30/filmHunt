import React from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { Link } from "expo-router"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Profile</Text>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={28} color="#4B2E2A" />
        </Pressable>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, !edit && styles.disabledInput]}
            editable={edit}
            placeholder="Full Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
          <Pressable onPress={() => setEdit(!edit)} style={styles.editButton}>
            <MaterialIcons name="edit" size={22} color="#4B2E2A" />
          </Pressable>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, !edit && styles.disabledInput]}
            editable={edit}
            placeholder="123-456-7890"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Pressable onPress={() => setEdit(!edit)} style={styles.editButton}>
            <MaterialIcons name="edit" size={22} color="#4B2E2A" />
          </Pressable>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !edit && styles.disabledInput]}
          editable={edit}
          placeholder="you@example.com"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {edit && (
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      <Link href="/(tabs)/home" style={styles.backLink}>
        <Text style={styles.backText}>← Home</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#E6F2FA", 
  },
  header: {
    position: "relative",         
    alignItems: "center",        
    justifyContent: "center",
    marginBottom: 0,
    height: 150,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B2E2A", 
   textAlign: "center",          

  },
  logoutButton: {
    padding: 8,
    position: "absolute",
    right: 0,
    top: 600
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#4B2E2A", 
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 44,
    borderColor: "#0055AA",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
   paddingVertical: 8,
    color: "#000",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
  },
  saveButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    backgroundColor: "#0055AA",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
  },
  backLink: {
    position: "absolute",  
    bottom: 300,
    right: 200
    },
  backText: {
    fontSize: 14,
    color: "#0055AA", 
  },
})
