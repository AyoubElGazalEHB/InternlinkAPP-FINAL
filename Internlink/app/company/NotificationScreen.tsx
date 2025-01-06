import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MOCKED_NOTIFICATIONS = [
  { id: '1', message: 'New applicant for your job listing!' },
  { id: '2', message: 'Your internship posting has been viewed.' },
  { id: '3', message: 'New matches available.' },
];

const NotificationScreen = () => {
  const renderNotificationItem = ({ item }: { item: { message: string } }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Company Notifications</Text>
      <FlatList
        data={MOCKED_NOTIFICATIONS}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationMessage: {
    fontSize: 16,
    color: '#555',
  },
});

export default NotificationScreen;
