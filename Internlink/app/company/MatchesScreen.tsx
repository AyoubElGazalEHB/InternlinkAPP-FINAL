import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '../css/AuthStyles'; // Zorg ervoor dat dit pad overeenkomt met jouw projectstructuur

const MOCKED_MATCHES = [
  { id: '1', name: 'John Doe', role: 'Software Intern' },
  { id: '2', name: 'Jane Smith', role: 'Marketing Intern' },
  { id: '3', name: 'Alex Lee', role: 'Data Analyst Intern' },
];

const MatchesScreen = () => {
  const renderMatchItem = ({ item }: { item: { name: string; role: string } }) => (
    <View style={styles.matchItem}>
      <Text style={styles.matchName}>{item.name}</Text>
      <Text style={styles.matchRole}>{item.role}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Company Matches</Text>
      <FlatList
        data={MOCKED_MATCHES}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default MatchesScreen;
