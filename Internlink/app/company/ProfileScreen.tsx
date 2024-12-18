import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const CompanyProfileScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logout Successful', 'You have been logged out.');
      router.replace('/auth/LoginCompanyScreen'); // Navigate to the company login screen
    } catch (error: any) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', error.message || 'An error occurred during logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Company Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default CompanyProfileScreen;
