import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const EditCompanyProfileScreen = () => {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [externalLink, setExternalLink] = useState('');

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'company', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setCompanyData(data);

            // Set initial form values
            setCompanyName(data.companyName || '');
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || '');
            setPhoneNumber(data.phoneNumber || '');
            setAddress(data.address || '');
            setExternalLink(data.externalLink || '');
          }
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching company data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'company', user.uid);
        await updateDoc(docRef, {
          companyName,
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          externalLink,
        });

        Alert.alert('Success', 'Profile updated successfully!');
        router.replace('../company/ProfileScreen');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Company Profile</Text>

        {/* Company Name */}
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter company name"
          value={companyName}
          onChangeText={setCompanyName}
        />

        {/* First Name */}
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name */}
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />

        {/* LinkedIn Profile URL */}
        <Text style={styles.label}>LinkedIn Profile URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter LinkedIn profile URL"
          value={externalLink}
          onChangeText={setExternalLink}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
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
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    width: '100%',
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#F0F4F8',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: '#E0E6ED',
    borderWidth: 1,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditCompanyProfileScreen;
