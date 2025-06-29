import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SignupButton from '../appComponents/signupButton';
import SignupForm from '../appComponents/signupForm';
import styles from '../styles/Profile.styles';

export default function ProfileScreen() {
  const { email } = useLocalSearchParams(); // email from navigation
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => setShowForm(true);

  return (
    <View style={styles.container}>
      {email ? (
        <>
          <Text style={styles.text}>Welcome to your Profile!</Text>
          <Text style={styles.text}>Your email: {email}</Text>
        </>
      ) : (
        <>
          <Text style={styles.text}>This is your Profile.</Text>
          {!showForm && <SignupButton onPress={handleShowForm} />}
          {showForm && <SignupForm />}
        </>
      )}
    </View>
  );
}
