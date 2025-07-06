import { View, Text, Image, TouchableOpacity} from 'react-native';
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
                <Text style={{color:'black'}}>Login With Google</Text>
                <TouchableOpacity style={{display: 'flex', alignItems: 'center',
                            gap: 10, flexDirection: 'row', backgroundColor: 'white', padding: 10, borderRadius: 99,
                            position: 'absolute', bottom: 150
                    
                }}
                >
                    <Image source={require('../../assets/images/Google - Edited.png')}
                        style={{
                            width: 50,
                            height:50,
                        }}
                    />
                    <Text style={{fontFamily: 'open-sans'}}>Sign in with Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}