import { View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {Video} from 'expo-av';
import { useRouter } from 'expo-router';
import styles from './styles/LoginScreen.styles';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth, useAuth } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { isSignedIn } = useAuth();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const router = useRouter();


    // Redirect if already signed in
    useEffect(() => {
        if (isSignedIn) {
            router.replace('/(tabs)/'); // Replace with your home route
        }
    }, [isSignedIn]);

     // New OAuth Flow with Redirect
    const handleGoogleLogin = async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();

            if (createdSessionId) {
                await setActive({ session: createdSessionId });
                router.replace('/(tabs)/'); // Home screen
            }
        } catch (err) {
            console.error('OAuth error: ', err);
        }
    };

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
                <TouchableOpacity 
                onPress={handleGoogleLogin}
                style={{display: 'flex', alignItems: 'center',
                            gap: 10, flexDirection: 'row', backgroundColor: 'white',paddingHorizontal: 55,padding: 10, borderRadius: 99,
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