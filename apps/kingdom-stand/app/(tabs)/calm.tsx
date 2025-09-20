import { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

export default function CalmScreen() {
  const [faithMode, setFaithMode] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const exercises = [
    {
      id: 'breath-truth',
      title: 'Breath + Truth',
      duration: 30,
      icon: '🫁',
      neutralPrompt: 'Breathe in slowly for 4 counts. Hold for 4. Exhale for 6. You are prepared and ready.',
      faithPrompt: 'Breathe in slowly for 4 counts. Hold for 4. Exhale for 6. You are standing in truth and righteousness.',
    },
    {
      id: 'steady-courage',
      title: 'Steady & Courage',
      duration: 45,
      icon: '🧘',
      neutralPrompt: 'Feel your feet on the ground. You are steady, calm, and focused. Your preparation will guide you.',
      faithPrompt: 'Feel your feet on the ground. You are steady in His strength. Courage rises within you.',
    },
    {
      id: 'peace-before-speak',
      title: 'Peace Before You Speak',
      duration: 60,
      icon: '🕊️',
      neutralPrompt: 'Place a hand over your heart. Take a moment to center yourself. Speak with clarity and purpose.',
      faithPrompt: 'Place a hand over your heart. Ask for wisdom and peace in your words. He will guide your speech.',
    },
  ];

  const startExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
  };

  const currentExercise = exercises.find(e => e.id === selectedExercise);

  if (selectedExercise && currentExercise) {
    return (
      <View style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseIcon}>{currentExercise.icon}</Text>
          <Text style={styles.exerciseTitle}>{currentExercise.title}</Text>
          <Text style={styles.exerciseDuration}>{currentExercise.duration} seconds</Text>
        </View>

        <View style={styles.promptCard}>
          <Text style={styles.promptText}>
            {faithMode ? currentExercise.faithPrompt : currentExercise.neutralPrompt}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => setSelectedExercise(null)}
        >
          <Text style={styles.completeButtonText}>Complete Exercise</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧘 Grounding Exercises</Text>
        <Text style={styles.subtitle}>Calm your nerves before court</Text>
      </View>

      <View style={styles.faithModeSection}>
        <View style={styles.faithModeHeader}>
          <Text style={styles.faithModeTitle}>Faith Mode</Text>
          <Switch
            value={faithMode}
            onValueChange={setFaithMode}
            trackColor={{ false: '#767577', true: '#FFD700' }}
            thumbColor={faithMode ? '#0B1020' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.faithModeDescription}>
          {faithMode 
            ? 'Light Scripture-based encouragement included' 
            : 'Neutral calming prompts only'
          }
        </Text>
      </View>

      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>Available Exercises</Text>
        
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseCard}
            onPress={() => startExercise(exercise.id)}
          >
            <Text style={styles.exerciseCardIcon}>{exercise.icon}</Text>
            <View style={styles.exerciseCardContent}>
              <Text style={styles.exerciseCardTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseCardDuration}>{exercise.duration} seconds</Text>
              <Text style={styles.exerciseCardPreview}>
                {faithMode ? exercise.faithPrompt : exercise.neutralPrompt}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipSection}>
        <Text style={styles.tipTitle}>💡 Before Your Hearing</Text>
        <Text style={styles.tipText}>
          Arrive 30 minutes early and find a quiet space to practice these exercises. 
          Even 30 seconds of focused breathing can help center your thoughts and calm your nerves.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  header: { padding: 20, alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: '#FFFFFF', opacity: 0.8, fontSize: 14, textAlign: 'center' },
  
  faithModeSection: { 
    margin: 16, 
    backgroundColor: 'rgba(255,215,0,0.1)', 
    borderColor: 'rgba(255,215,0,0.3)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16 
  },
  faithModeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  faithModeTitle: { color: '#FFD700', fontSize: 16, fontWeight: '700' },
  faithModeDescription: { color: '#FFFFFF', opacity: 0.8, fontSize: 13 },
  
  exercisesSection: { margin: 16 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  
  exerciseCard: { 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderColor: 'rgba(255,255,255,0.1)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  exerciseCardIcon: { fontSize: 24, marginRight: 12, marginTop: 2 },
  exerciseCardContent: { flex: 1 },
  exerciseCardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  exerciseCardDuration: { color: '#FFD700', fontSize: 12, marginBottom: 8 },
  exerciseCardPreview: { color: '#FFFFFF', opacity: 0.7, fontSize: 13, lineHeight: 18 },
  
  exerciseContainer: { flex: 1, backgroundColor: '#0B1020', padding: 20, justifyContent: 'center' },
  exerciseHeader: { alignItems: 'center', marginBottom: 40 },
  exerciseIcon: { fontSize: 48, marginBottom: 16 },
  exerciseTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginBottom: 8 },
  exerciseDuration: { color: '#FFD700', fontSize: 16 },
  
  promptCard: { 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    borderColor: 'rgba(255,215,0,0.4)', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 24, 
    marginBottom: 40 
  },
  promptText: { color: '#FFFFFF', fontSize: 18, lineHeight: 28, textAlign: 'center' },
  
  completeButton: { 
    backgroundColor: '#FFD700', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center' 
  },
  completeButtonText: { color: '#0B1020', fontSize: 16, fontWeight: '700' },
  
  tipSection: { 
    margin: 16, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 12, 
    padding: 16 
  },
  tipTitle: { color: '#FFD700', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  tipText: { color: '#FFFFFF', opacity: 0.8, fontSize: 13, lineHeight: 18 },
});
