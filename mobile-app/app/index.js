//index.js
import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import LoginScreen from '../appComponents/Screen/LoginScreen';
import styles from '../app_Styles/HomeScreen.styles'; // Import the styles

export default function HomeScreen() {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      
      <LoginScreen />
    </View>
  );
}
