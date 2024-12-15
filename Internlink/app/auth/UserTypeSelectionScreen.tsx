import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const UserTypeSelectionScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select User Type</Text>
      <Button title="I am a Student" onPress={() => router.push('/auth/LoginStudentScreen')} />
      <Button title="I am a Company" onPress={() => router.push('/auth/LoginCompanyScreen')} />
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

export default UserTypeSelectionScreen;
