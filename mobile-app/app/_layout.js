// Polyfills must come first
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import React from 'react';
import { Slot } from 'expo-router';
import {Amplify} from 'aws-amplify';
import awsExports from '../src/aws-exports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { SafeAreaView, Text, Button } from 'react-native';

// Double‑check Amplify is defined
console.log('🌩 Amplify is', Amplify);

Amplify.configure({
  ...awsExports,
  storage: AsyncStorage,
  ssr: true,
});

function MainApp() {
  const { user, signOut } = useAuthenticator();
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        Welcome, {user.username}!
      </Text>
      <Slot />
      <Button title="Sign Out" onPress={signOut} />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        {() => <MainApp />}
      </Authenticator>
    </Authenticator.Provider>
  );
}
