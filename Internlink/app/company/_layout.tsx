import React from 'react';
import { Tabs } from 'expo-router';

export default function CompanyLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="matches" options={{ title: 'Matches' }} />
      <Tabs.Screen name="notification" options={{ title: 'Notification' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
