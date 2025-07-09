import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SignOutButton } from '../../appComponents/Screen/SignOutButton';
import styles from '../../app_Styles/HomeScreen.styles';

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>

      <SignedOut>
        <Text> You are signed out</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}
          style={{display: 'flex', alignItems: 'center',
                            gap: 10, flexDirection: 'row', backgroundColor: 'black',paddingHorizontal: 55,padding: 10, borderRadius: 99,
                            position: 'absolute', bottom: 150}}>
         
          <Text style={{ color: 'white', marginBottom: 10 }}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}
          style={{display: 'flex', alignItems: 'center',
                            gap: 10, flexDirection: 'row', backgroundColor: 'black',paddingHorizontal: 55,padding: 10, borderRadius: 99,
                            position: 'absolute', bottom: 240}}>

            <Text style={{ color: 'white', marginBottom: 10 }}>Sign up</Text>
        </TouchableOpacity>
      </SignedOut>
    </View>
  );
}
