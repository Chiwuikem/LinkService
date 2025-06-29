import React, {useState} from 'react';
import { TouchableOpacity, Text, Alert, View } from 'react-native';
import styles from '../styles/signupButton.styles';  // you can reuse the style

export default function SignupButton({onPress}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>
  );
}
