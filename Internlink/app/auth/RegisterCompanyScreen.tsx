import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const RegisterCompanyScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registration Successful', 'You have successfully registered.');
      router.push('/auth/LoginCompanyScreen');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company Register</Text>
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
      <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Login" onPress={() => router.push('/auth/LoginCompanyScreen')} />
      <Button title="Back to User Selection" onPress={() => router.push('/auth/UserTypeSelectionScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default RegisterCompanyScreen;
