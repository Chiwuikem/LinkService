import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import styles from '../styles/HomeScreen.styles'; // Import the styles

export default function HomeScreen() {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Welcome Home!</Text>
    </View>
  );
}
