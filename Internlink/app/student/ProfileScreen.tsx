import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ActivityIndicator, ScrollView } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const StudentProfileScreen = () => {
  const router = useRouter();
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('User not logged in');
        }

        const userDoc = doc(db, 'students', userId);
        const docSnapshot = await getDoc(userDoc);

        if (docSnapshot.exists()) {
          setProfileData(docSnapshot.data());
        } else {
          console.error('No profile data found for this user.');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logout Successful', 'You have been logged out.');
      router.replace('/auth/LoginStudentScreen'); // Navigate to the login screen
    } catch (error: any) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', error.message || 'An error occurred during logout.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Profile</Text>

      {profileData ? (
        <>
          {/* Profile Picture */}
          {profileData.profilePicture ? (
            <Image source={{ uri: profileData.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}

          {/* Profile Information */}
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{profileData.name}</Text>

          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{profileData.email}</Text>

          <Text style={styles.infoLabel}>Date of Birth:</Text>
          <Text style={styles.infoValue}>{profileData.dob || 'N/A'}</Text>

          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{profileData.phone || 'N/A'}</Text>

          <Text style={styles.infoLabel}>University:</Text>
          <Text style={styles.infoValue}>{profileData.university || 'N/A'}</Text>

          <Text style={styles.infoLabel}>Degree:</Text>
          <Text style={styles.infoValue}>{profileData.degree || 'N/A'}</Text>

          <Text style={styles.infoLabel}>GPA:</Text>
          <Text style={styles.infoValue}>{profileData.gpa || 'N/A'}</Text>

          <Text style={styles.infoLabel}>Skills:</Text>
          <Text style={styles.infoValue}>
            {profileData.skills?.length ? profileData.skills.join(', ') : 'N/A'}
          </Text>

          <Text style={styles.infoLabel}>Location Preferences:</Text>
          <Text style={styles.infoValue}>{profileData.location || 'N/A'}</Text>
        </>
      ) : (
        <Text style={styles.errorText}>No profile data available.</Text>
      )}

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} color="#ff4d4d" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#fff',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
    marginTop: 20,
  },
});

export default StudentProfileScreen;
