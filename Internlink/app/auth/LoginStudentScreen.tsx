import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import styles from '../css/AuthStyles'; // Verwijzing naar de aparte stylesheet
import { doc, getDoc } from 'firebase/firestore';


const LoginStudentScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | ''>('');
  const router = useRouter();

const handleLogin = async () => {
  setMessage('');
  setMessageType('');

  if (!email || !password) {
    setMessage('Please fill out both fields.');
    setMessageType('error');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const studentDoc = await getDoc(doc(db, 'students', user.uid));

    if (!studentDoc.exists() || studentDoc.data().role !== 'student') {
      setMessage('This account is not registered as a student.');
      setMessageType('error');
      return;
    }

    setMessage('');
    router.push('../student');
  } catch (error: any) {
    setMessage(error.message || 'The email or password is incorrect.');
    setMessageType('error');
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Student Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {message ? (
            <Text style={[styles.message, styles.error]}>{message}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.leftButton]}
              onPress={() => router.push('/auth/RegisterStudentScreen')}
            >
              <Text style={styles.secondaryButtonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.rightButton]}
              onPress={() => router.push('/auth/UserTypeSelectionScreen')}
            >
              <Text style={styles.secondaryButtonText}>Change Role</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F0F4F8',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 14,
    borderColor: '#E0E6ED',
    borderWidth: 1,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  leftButton: {
    backgroundColor: '#EAF4FF',
  },
  rightButton: {
    backgroundColor: '#EAF4FF',
  },
  secondaryButtonText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  error: {
    color: '#E74C3C',
  },
});

export default LoginStudentScreen;
