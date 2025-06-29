import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import styles from '../styles/signupButton.styles';  // you can reuse the style

export default function SignupButton() {
  const handleSignup = () => {
    Alert.alert('Signup Button Pressed', 'Signup logic will go here.');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignup}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>
  );
}
