import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import styles from '../css/AuthStyles'; // Zorg ervoor dat je een gestileerde map hebt voor stijlen

const LoginCompanyScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful', 'You have successfully logged in.');
      router.push('/company/MatchesScreen'); // Navigeren naar de matches pagina van het bedrijf
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} color="#007BFF" />
      
      {/* Go to Register Button */}
      <Button title="Go to Register" onPress={() => router.push('/auth/RegisterCompanyScreen')} color="#555" />
      
      {/* Back to User Type Selection Button */}
      <Button title="Back to User Selection" onPress={() => router.push('/auth/UserTypeSelectionScreen')} color="#777" />
    </View>
  );
};

export default LoginCompanyScreen;
