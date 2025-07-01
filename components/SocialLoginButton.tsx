import React from 'react';
import { Button } from 'react-native';
import { useGoogleAuthRequest, signInWithGoogle, initFacebookSDK, signInWithFacebook } from './authUtils';

export default function LoginScreen() {
  const [request, response, promptAsync] = useGoogleAuthRequest();

  React.useEffect(() => {
    initFacebookSDK();
  }, []);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // handle successful Google sign-in here
    }
  }, [response]);

  return (
    <>
      <Button
        disabled={!request}
        title="Sign in with Google"
        onPress={() => signInWithGoogle(promptAsync)}
      />
      <Button
        title="Sign in with Facebook"
        onPress={() => signInWithFacebook()}
      />
    </>
  );
}
