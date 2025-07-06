import { View, Text} from 'react-native';
import React from 'react';
import {Video, ResizeMode} from 'expo-av';
import { StyleSheet } from 'react-native';
import styles from './styles/LoginScreen.styles';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Video
                style={styles.video}
                source={{
                    uri: 'https://cdn.pixabay.com/video/2023/07/31/174004-850361301_large.mp4'
            
                }}
                shouldPlay
                resizeMode='cover'
                isLooping={true}
            />
            <View style={styles.overlay}>
                <Text style={{color:'black'}}>Login</Text>
            </View>
        </View>
    )
}