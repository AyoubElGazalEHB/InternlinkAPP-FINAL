import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const RegisterStudentScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const db = getFirestore();

  const handleRegister = async () => {
    if (!email || !password || !name || !age || !fieldOfStudy) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Save additional details to Firestore
      await setDoc(doc(db, 'students', userId), {
        name,
        age,
        fieldOfStudy,
        email,
        skills: skills.split(',').map(skill => skill.trim()), // Convert skills to an array
        location,
        createdAt: new Date(),
      });

      Alert.alert('Registration Successful', 'Your account has been created.');
      router.push('/auth/LoginStudentScreen'); // Navigate to the login screen
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChangeText={setFieldOfStudy}
      />
      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated)"
        value={skills}
        onChangeText={setSkills}
      />
      <TextInput
        style={styles.input}
        placeholder="Desired Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Register" onPress={handleRegister} />
          <Button title="Go to Login" onPress={() => router.push('/auth/LoginStudentScreen')} />
          <Button title="Back to User Selection" onPress={() => router.push('/auth/UserTypeSelectionScreen')} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

export default RegisterStudentScreen;
