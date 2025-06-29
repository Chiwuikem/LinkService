import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import {useRouter} from 'expo-router';
import styles from '../styles/SignupForm.styles';

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      setMessage(`A confirmation code was sent to: ${email}`);
      setIsConfirming(true);
    } catch (error) {
      console.error('Error signing up:', error);
      setMessage(error.message || 'An error occurred during signup.');
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ username: email, confirmationCode });
      setMessage('✅ Account confirmed! You can now log in.');
      // You can navigate here if you want
      router.push({pathname: '/profile', params: {email}});
    } catch (error) {
      console.error('Error confirming signup:', error);
      setMessage(error.message || 'An error occurred during confirmation.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: 'white', marginBottom: 15 }}>{message}</Text>

      {!isConfirming ? (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Sign Up" onPress={handleSignUp} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter Confirmation Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Button title="Confirm Account" onPress={handleConfirm} />
        </>
      )}
    </View>
  );
}
