import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

type AIReflectModalProps = {
  visible: boolean;
  onConfirm: (note: string, opts?: { remember?: boolean; faithEnabled?: boolean }) => void;
  onSkip: (opts?: { remember?: boolean; faithEnabled?: boolean }) => void;
  prompts?: string[];
  beforePrompts?: string[]; // backward compatibility
  timerSeconds?: number;
  variant?: 'before' | 'after';
  faithToggleAvailable?: boolean;
  faithToggleDefault?: boolean;
  onFaithToggleChange?: (enabled: boolean) => void;
  enableRemember?: boolean;
};

export const AIReflectModal: React.FC<AIReflectModalProps> = ({
  visible,
  onConfirm,
  onSkip,
  prompts,
  beforePrompts = [
    "What’s the goal, and who is this for?",
    "What would you create without AI?",
    "What’s the unique angle or testimony you bring?",
  ],
  timerSeconds = 10,
  variant = 'before',
  faithToggleAvailable = false,
  faithToggleDefault = true,
  onFaithToggleChange,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(timerSeconds);
  const [note, setNote] = useState('');
  const [faithToggle, setFaithToggle] = useState(faithToggleDefault);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setSecondsLeft(variant === 'before' ? timerSeconds : Math.min(timerSeconds, 3));
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [visible, timerSeconds]);

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Pause & Reflect</Text>
          <Text style={styles.subtitle}>
            {variant === 'before'
              ? 'AI can assist, but your calling and voice lead.'
              : 'Confirm your edits and intent before accepting.'}
          </Text>

          {faithToggleAvailable && (
            <TouchableOpacity
              onPress={() => {
                const next = !faithToggle;
                setFaithToggle(next);
                onFaithToggleChange && onFaithToggleChange(next);
              }}
              style={styles.toggleRow}
            >
              <View style={[styles.toggleDot, faithToggle && styles.toggleOn]} />
              <Text style={styles.toggleText}>Use faith‑focused prompts</Text>
            </TouchableOpacity>
          )}

          {(prompts ?? beforePrompts).map((p, i) => (
            <Text key={i} style={styles.prompt}>• {p}</Text>
          ))}

          {enableRemember && (
            <TouchableOpacity onPress={() => setRemember(!remember)} style={styles.rememberRow}>
              <View style={[styles.checkbox, remember && styles.checkboxOn]} />
              <Text style={styles.rememberText}>Remember my choice</Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            placeholder="Add a quick note (optional)"
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onSkip({ remember, faithEnabled: faithToggle })} style={[styles.button, styles.ghost]}> 
              <Text style={styles.ghostText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(note, { remember, faithEnabled: faithToggle })}
              disabled={secondsLeft > 0}
              style={[styles.button, secondsLeft > 0 ? styles.disabled : styles.primary]}
            >
              <Text style={styles.primaryText}>
                {secondsLeft > 0 ? `Continue (${secondsLeft})` : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0B1220',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#243044',
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: '#E5E7EB',
    fontSize: 12,
    marginBottom: 12,
  },
  prompt: {
    color: '#CBD5E1',
    fontSize: 12,
    marginBottom: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: 'transparent',
  },
  checkboxOn: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  rememberText: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  toggleDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: 'transparent',
  },
  toggleOn: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  toggleText: {
    color: '#E5E7EB',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 10,
    color: '#FFFFFF',
    minHeight: 70,
    marginTop: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  ghost: {
    borderColor: '#374151',
  },
  ghostText: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  primary: {
    borderColor: '#F59E0B',
    backgroundColor: '#1F2937',
  },
  disabled: {
    borderColor: '#4B5563',
    backgroundColor: '#1F2937',
    opacity: 0.7,
  },
  primaryText: {
    color: '#F59E0B',
    fontWeight: '700',
  },
});

export default AIReflectModal;


