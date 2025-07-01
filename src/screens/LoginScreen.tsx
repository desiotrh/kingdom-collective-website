import React, { useEffect } from 'react';
import { Button, View, StyleSheet } from 'react-native';
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
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google authentication:', authentication);
      // TODO: Send token to Firebase or backend
    }
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
          const token = await signInWithFacebook();
          console.log('Facebook token:', token);
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
