import React, { useEffect } from 'react';
import { Button, View, StyleSheet, Alert } from 'react-native';
import {
  useGoogleAuthRequest,
  signInWithGoogle,
  initFacebookSDK,
  signInWithFacebook,
} from '../../utils/authUtils';

export default function LoginScreen() {
  const [request, response, promptAsync] = useGoogleAuthRequest();

  useEffect(() => {
    initFacebookSDK();
  }, []);

  useEffect(() => {
    async function handleGoogleResponse() {
      if (response?.type === 'success') {
        const user = await signInWithGoogle(promptAsync);
        if (user) {
          Alert.alert('Google Login Success', `Welcome ${user.displayName}`);
        }
      }
    }
    handleGoogleResponse();
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        disabled={!request}
        title="Sign in with Google"
        onPress={() => signInWithGoogle(promptAsync)}
      />
      <View style={{ height: 20 }} />
      <Button
        title="Sign in with Facebook"
        onPress={async () => {
          const user = await signInWithFacebook();
          if (user) {
            Alert.alert('Facebook Login Success', `Welcome ${user.displayName}`);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
