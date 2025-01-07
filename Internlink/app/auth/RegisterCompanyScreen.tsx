import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const RegisterCompanyScreen = () => {
  const router = useRouter();

  // State for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');

  const handleRegister = async () => {
    setMessage('');
    setMessageType('');

    // Input validation
    if (!firstName || !lastName || !email || !phoneNumber || !password || !repeatPassword || !companyName || !address || !externalLink) {
      setMessage('Please fill out all fields.');
      setMessageType('error');
      return;
    }
    if (password !== repeatPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    if (!externalLink || !externalLink.startsWith("https://www.linkedin.com")) {
      setMessage("Please provide a valid LinkedIn profile link.");
      setMessageType("error");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;



      // Save company data to Firestore
      await setDoc(doc(db, 'company', userId), {
        uid: userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        companyName,
        address,
        externalLink,
        createdAt: new Date(),
      });

      setMessage('Company account created successfully!');
      setMessageType('success');
      setTimeout(() => router.replace('/auth/LoginCompanyScreen'), 1500);
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during registration.');
      setMessageType('error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Register a Company Account</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Repeat Password" value={repeatPassword} onChangeText={setRepeatPassword} secureTextEntry />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Company Information</Text>
            <TextInput style={styles.input} placeholder="Company Name" value={companyName} onChangeText={setCompanyName} />
            <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />

            {/* LinkedIn Profile URL Field */}
            <Text style={styles.inputLabel}>LinkedIn Profile URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your LinkedIn profile link"
              value={externalLink}
              onChangeText={setExternalLink}
            />
          </View>

          {message ? (
            <Text style={[styles.message, messageType === 'error' ? styles.error : styles.success]}>
              {message}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.secondaryButton, styles.leftButton]} onPress={() => router.push('/auth/LoginCompanyScreen')}>
              <Text style={styles.secondaryButtonText}>Go to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryButton, styles.rightButton]} onPress={() => router.push('/auth/UserTypeSelectionScreen')}>
              <Text style={styles.secondaryButtonText}>Change Role</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F0F4F8',
    padding: 12,
    marginBottom: 10,
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
  success: {
    color: '#2ECC71',
  },
});

export default RegisterCompanyScreen;
