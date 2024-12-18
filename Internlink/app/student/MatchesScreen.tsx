import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

// Type definitie voor een match
type Match = {
  id: string; // Uniek ID van de match
  companyName: string; // Naam van het bedrijf
  companyPhoto?: string; // Optionele foto van het bedrijf
  studentName: string; // Naam van de student
  studentPhoto?: string; // Optionele foto van de student
};

// Props voor MatchListScreen
type MatchListScreenProps = {
  matches: Match[]; // Array van matches die we laten zien
};

const MatchListScreen: React.FC<MatchListScreenProps> = ({ matches }) => {
  const MatchCard: React.FC<{ match: Match }> = ({ match }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: match.companyPhoto || 'https://via.placeholder.com/60' }}
        style={styles.photo}
      />
      <View style={styles.info}>
        <Text style={styles.name}>Bedrijf: {match.companyName}</Text>
        <Text style={styles.name}>Student: {match.studentName}</Text>
      </View>
      <Image
        source={{ uri: match.studentPhoto || 'https://via.placeholder.com/60' }}
        style={styles.photo}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchlist</Text>
      {matches.length === 0 ? (
        <Text style={styles.noMatches}>Nog geen matches beschikbaar.</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MatchCard match={item} />}
          contentContainerStyle={styles.list}
        />
      )}
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
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noMatches: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MatchListScreen;
