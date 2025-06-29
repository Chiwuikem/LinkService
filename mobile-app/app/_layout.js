import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Amplify } from 'aws-amplify';
import awsExports from '../src/aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure Amplify ONCE at app root:
Amplify.configure({
  ...awsExports,
  storage: AsyncStorage,
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'home') {
            iconName = 'home';
          } else if (route.name === 'profile') {
            iconName = 'person';
          } else if (route.name === 'settings') {
            iconName = 'settings';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: 'orange',
        tabBarStyle: {
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
