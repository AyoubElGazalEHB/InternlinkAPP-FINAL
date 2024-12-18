import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import styles from '../css/AuthStyles'; // Zorg ervoor dat je het juiste pad hebt naar authstyles.js
import { Picker } from '@react-native-picker/picker'; // Gebruik Picker voor de interesses

const RegisterStudentScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState('');
  const [dobDay, setDobDay] = useState(''); // Dag van de geboortedatum
  const [dobMonth, setDobMonth] = useState(''); // Maand van de geboortedatum
  const [dobYear, setDobYear] = useState(''); // Jaar van de geboortedatum
  const router = useRouter();

  const handleRegister = async () => {
    // Valideer geboortedatum
    const birthDate = new Date(`${dobMonth}/${dobDay}/${dobYear}`);
    const age = calculateAge(birthDate);
    if (age < 16) {
      Alert.alert('Registration Failed', 'You must be at least 16 years old.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registration Successful', 'You have successfully registered.');
      router.push('/auth/LoginStudentScreen'); // Navigeren naar de login pagina
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration.');
    }
  };

  // Functie om leeftijd te berekenen
  const calculateAge = (dob: Date) => {
    const currentDate = new Date();
    let age = currentDate.getFullYear() - dob.getFullYear();
    const month = currentDate.getMonth();
    if (month < dob.getMonth() || (month === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Register</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* School */}
      <TextInput
        style={styles.input}
        placeholder="School"
        value={school}
        onChangeText={setSchool}
      />

      {/* Location */}
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      {/* Geboortedatum */}
      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.dateInputContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="DD"
          value={dobDay}
          onChangeText={setDobDay}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="MM"
          value={dobMonth}
          onChangeText={setDobMonth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY"
          value={dobYear}
          onChangeText={setDobYear}
          keyboardType="numeric"
        />
      </View>

      {/* Interests */}
      <Text style={styles.label}>Interests</Text>
      <Picker
        selectedValue={interests}
        style={styles.picker}
        onValueChange={(itemValue) => setInterests(itemValue)}
      >
        <Picker.Item label="Select an interest" value="" />
        <Picker.Item label="Technology" value="Technology" />
        <Picker.Item label="Business" value="Business" />
        <Picker.Item label="Arts" value="Arts" />
        <Picker.Item label="Sports" value="Sports" />
        <Picker.Item label="Science" value="Science" />
      </Picker>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <Button title="Register" onPress={handleRegister} color="#007BFF" />
        <Button title="Go to Login" onPress={() => router.push('/auth/LoginStudentScreen')} color="#555" />
        <Button title="Back to User Selection" onPress={() => router.push('/auth/UserTypeSelectionScreen')} color="#777" />
      </View>
    </View>
  );
};

export default RegisterStudentScreen;
