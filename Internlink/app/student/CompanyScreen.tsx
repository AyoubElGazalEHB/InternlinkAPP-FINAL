import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import styles from '../css/AuthStyles'; // Correct file path for your styles

type Company = {
  id: string;
  companyName: string;
  companyPhoto?: string;
  email: string;
  sector: string;
};

// Use mock data for testing
const mockCompanies = [
  {
    id: '1',
    companyName: 'EcoBuild',
    companyPhoto: 'https://via.placeholder.com/60?text=EB',
    email: 'info@ecobuild.com',
    sector: 'Construction',
  },
  {
    id: '2',
    companyName: 'FinTech Innovators',
    companyPhoto: 'https://via.placeholder.com/60?text=FI',
    email: 'contact@fintech.com',
    sector: 'Finance',
  },
  {
    id: '3',
    companyName: 'EduPro',
    companyPhoto: 'https://via.placeholder.com/60?text=EP',
    email: 'support@edupro.com',
    sector: 'Education',
  },
];

const StudentCompanyScreen: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching data from Firebase (commented for testing mock data)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const fetchedCompanies: Company[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          companyName: doc.data().companyName || 'No Name',
          companyPhoto: doc.data().companyPhoto || 'https://via.placeholder.com/60',
          email: doc.data().email || 'No Email',
          sector: doc.data().sector || 'Unknown Sector',
        }));
        setCompanies(fetchedCompanies);
      } catch (err) {
        setError('Failed to load company data. Please try again later.');
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    // Uncomment this line to use Firebase data
    // fetchCompanies();

    // For testing purposes, we can use mockCompanies
    setCompanies(mockCompanies);
    setLoading(false);
  }, []);

  const CompanyCard: React.FC<{ company: Company }> = ({ company }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: company.companyPhoto || 'https://via.placeholder.com/60' }}
        style={styles.photo}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{company.companyName}</Text>
        <Text style={styles.description}>Email: {company.email}</Text>
        <Text style={styles.description}>Sector: {company.sector}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading companies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registered Companies</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id || item.companyName}
        renderItem={({ item }) => <CompanyCard company={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default StudentCompanyScreen;
