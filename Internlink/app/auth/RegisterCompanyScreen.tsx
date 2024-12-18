import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Type definitie voor een bedrijf
type Company = {
  id: string; // Firestore document ID
  email: string; // Email van de gebruiker
};

const StudentCompanyScreen: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Ophalen van alle bedrijven uit de 'users' collectie
        const querySnapshot = await getDocs(collection(db, 'users'));
        const fetchedCompanies: Company[] = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Firestore document ID
          email: doc.data().email || 'No Email', // Email veld uit de database
        }));
        console.log('Fetched Companies:', fetchedCompanies); // Debugging
        setCompanies(fetchedCompanies); // Zet de opgehaalde data in de state
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false); // Zet loading op false
      }
    };

    fetchCompanies();
  }, []);

  const CompanyCard: React.FC<{ company: Company }> = ({ company }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>Email: {company.email}</Text>
        <Text style={styles.description}>User ID: {company.id}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading companies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registered Companies</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id || 'defaultKey'}  // Add a default key for debugging
        renderItem={({ item }) => <CompanyCard company={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    padding: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentCompanyScreen;
