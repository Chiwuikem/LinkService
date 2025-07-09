import * as React from 'react';
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType='number-pad'
          style={{marginVertical: 12, borderBottomWidth:1, padding: 8}}
        />
        <TouchableOpacity onPress={onVerifyPress} style={{backgroundColor: 'black', padding: 12, borderRadius: 8}}>
          <Text style={{color: 'white', textAlign: 'center'}}>Verify</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <View>
      <Text style={{fontSize: 24, marginBottom: 12}}>Sign up</Text>
      <Text>Username</Text>
      <TextInput
        autoCapitalize="none"
        value={username}
        placeholder="Choose a username"
        onChangeText={setUsername}
        style={{ marginBottom: 12, borderBottomWidth: 1, padding: 8 }}
      />
      <Text>Email</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        style={{ marginBottom: 12, borderBottomWidth: 1, padding: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
        style={{ marginBottom: 20, borderBottomWidth: 1, padding: 8 }}
      />
      <TouchableOpacity onPress={onSignUpPress}  style={{ backgroundColor: 'black', padding: 14, borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
            Continue
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row',  justifyContent: 'center', marginTop: 16 }}>
        <Text>Already have an account? </Text>
        <Link href="/(auth)/sign-up">
          <Text style={{ color: 'blue',  fontWeight: '500' }}>Sign in</Text>
        </Link>
      </View>
      <TouchableOpacity
        onPress={() => router.replace('/')}
        style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#ccc',
        }}
        >
        <Text style={{ textAlign: 'center' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
