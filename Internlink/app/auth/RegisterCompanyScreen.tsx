import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import styles from '../css/AuthStyles';

// Mock API for sectors (can be replaced with real API)
const sectors = ['Tech', 'Marketing', 'Finance', 'Healthcare', 'Education'];

const RegisterCompanyScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyPhoto, setCompanyPhoto] = useState<any>(null);
  const [sector, setSector] = useState('');
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setCompanyPhoto(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!companyName || !sector || !companyPhoto) {
      Alert.alert('All fields are required!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const companyRef = doc(db, 'companies', user.uid);
      await setDoc(companyRef, {
        companyName,
        companyPhoto,
        sector,
        email,
        userId: user.uid,
      });

      Alert.alert('Registration Successful', 'You have successfully registered.');
      router.push('/auth/LoginCompanyScreen');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register Your Company</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your company email address"
        placeholderTextColor="#bbb"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Choose a strong password"
        placeholderTextColor="#bbb"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter your company name"
        placeholderTextColor="#bbb"
        value={companyName}
        onChangeText={setCompanyName}
      />
      
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {companyPhoto ? (
          <Image source={{ uri: companyPhoto }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Upload your company logo or photo</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.label}>Select your company's sector:</Text>
      <View style={styles.sectorPicker}>
        {sectors.map((sectorOption) => (
          <TouchableOpacity
            key={sectorOption}
            style={[
              styles.sectorButton,
              sector === sectorOption && styles.selectedSectorButton,
            ]}
            onPress={() => setSector(sectorOption)}
          >
            <Text style={sector === sectorOption ? styles.selectedSector : styles.sectorText}>
              {sectorOption}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Button title="Register" onPress={handleRegister} color="#007BFF" />
      <Button title="Go to Login" onPress={() => router.push('/auth/LoginCompanyScreen')} color="#555" />
      <Button title="Back to User Selection" onPress={() => router.push('/auth/UserTypeSelectionScreen')} color="#777" />
    </ScrollView>
  );
};

export default RegisterCompanyScreen;
