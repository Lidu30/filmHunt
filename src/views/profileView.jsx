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

      {/* only show nav buttons when not editing */}
      {!edit && (
        <View style={styles.navContainer}>
          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.navGradient}
          >
            <Pressable onPress={() => router.replace('/(tabs)/home')} style={styles.navButton}>
              <Ionicons name="home-outline" size={24} color="#fff" />
              <Text style={styles.navText}>Home</Text>
            </Pressable>
          </LinearGradient>

          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.navGradient}
          >
            <Pressable onPress={logout} style={styles.navButton}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
              <Text style={styles.navText}>Logout</Text>
            </Pressable>
          </LinearGradient>
        </View>
      )}
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
  navGradient: {
    borderRadius: 8,
    overflow: 'hidden'
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  navText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14
  },
  readOnlyInput: {
    color: '#999'
  },
});