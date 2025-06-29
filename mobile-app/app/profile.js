import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SignupButton from '../appComponents/signupButton';
import styles from '../styles/Profile.styles'

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is your Profile.</Text>
      <SignupButton/>
    </View>
  );
}


