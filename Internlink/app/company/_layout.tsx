import React from 'react';
import { Tabs } from 'expo-router';

export default function CompanyLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="MatchesScreen" options={{ title: 'Matches' }} />
      <Tabs.Screen name="NotificationScreen" options={{ title: 'Notification' }} />
      <Tabs.Screen name="ProfileScreen" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
