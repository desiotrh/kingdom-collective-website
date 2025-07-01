import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const UploadScreen = ({ navigation }: any) => {
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
    } else {
      Alert.alert('No video selected');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload or Select a Video</Text>
      <Button title="Pick Video from Gallery" onPress={pickVideo} />

      {videoUri && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoUri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            useNativeControls
            style={{ width: '100%', height: 300 }}
          />
          <Button
            title="Next: Edit Video"
            onPress={() =>
              navigation.navigate('EditorScreen', { videoUri })
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  videoContainer: {
    marginTop: 20,
  },
});

export default UploadScreen;
