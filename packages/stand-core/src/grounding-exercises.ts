export interface GroundingExercise {
  id: string;
  title: string;
  duration: number; // seconds
  neutralPrompt: string;
  faithPrompt?: string;
  audioAvailable: boolean;
}

export const GROUNDING_EXERCISES: GroundingExercise[] = [
  {
    id: 'breath-truth',
    title: 'Breath + Truth',
    duration: 30,
    neutralPrompt: 'Breathe in slowly for 4 counts. Hold for 4. Exhale for 6. You are prepared and ready.',
    faithPrompt: 'Breathe in slowly for 4 counts. Hold for 4. Exhale for 6. You are standing in truth and righteousness.',
    audioAvailable: false,
  },
  {
    id: 'steady-courage',
    title: 'Steady & Courage',
    duration: 45,
    neutralPrompt: 'Feel your feet on the ground. You are steady, calm, and focused. Your preparation will guide you.',
    faithPrompt: 'Feel your feet on the ground. You are steady in His strength. Courage rises within you.',
    audioAvailable: false,
  },
  {
    id: 'peace-before-speak',
    title: 'Peace Before You Speak',
    duration: 60,
    neutralPrompt: 'Place a hand over your heart. Take a moment to center yourself. Speak with clarity and purpose.',
    faithPrompt: 'Place a hand over your heart. Ask for wisdom and peace in your words. He will guide your speech.',
    audioAvailable: false,
  },
];

export interface GroundingSession {
  exerciseId: string;
  startTime: Date;
  completed: boolean;
  faithModeEnabled: boolean;
}

export function getExercisePrompt(exerciseId: string, faithMode: boolean): string {
  const exercise = GROUNDING_EXERCISES.find(e => e.id === exerciseId);
  if (!exercise) return '';
  
  return faithMode && exercise.faithPrompt ? exercise.faithPrompt : exercise.neutralPrompt;
}
