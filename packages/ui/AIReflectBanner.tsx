import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type AIReflectBannerProps = {
  message?: string;
};

export const AIReflectBanner: React.FC<AIReflectBannerProps> = ({
  message = "AI is a tool—not your voice. Pause, reflect, and lead your vision.",
}) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.banner}>
        <Text style={styles.text}>{message}</Text>
        <TouchableOpacity accessibilityLabel="Dismiss message" onPress={() => setVisible(false)} style={styles.button}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: 'center',
    zIndex: 9999,
  },
  banner: {
    maxWidth: 900,
    width: '94%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    opacity: 0.9,
    fontSize: 12,
    flex: 1,
    paddingRight: 8,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  buttonText: {
    color: '#f59e0b',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default AIReflectBanner;


