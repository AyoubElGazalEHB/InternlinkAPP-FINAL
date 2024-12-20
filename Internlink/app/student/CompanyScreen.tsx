import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CompanyScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Student Company Information</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default CompanyScreen;