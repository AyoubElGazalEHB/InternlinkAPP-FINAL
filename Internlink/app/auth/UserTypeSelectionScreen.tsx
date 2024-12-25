import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const UserTypeSelectionScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Who Are You?</Text>
        <Text style={styles.subtitle}>Please select your user type to continue</Text>

        <TouchableOpacity
          style={[styles.button, styles.studentButton]}
          onPress={() => router.push('/auth/LoginStudentScreen')}
        >
          <Text style={styles.buttonText}>I am a Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.companyButton]}
          onPress={() => router.push('/auth/LoginCompanyScreen')}
        >
          <Text style={styles.buttonText}>I am a Company</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentButton: {
    backgroundColor: '#4CAF50',
  },
  companyButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserTypeSelectionScreen;
