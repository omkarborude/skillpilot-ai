import type { AppState, LearningPlan } from '../types/learning';

export const seedPlan: LearningPlan = {
  id: 'campfire-guitar',
  title: 'Campfire Guitar',
  summary: 'A focused beginner path to play simple songs confidently around a campfire.',
  techniques: [
    { id: 'guitar-basics', title: 'Guitar Basics', description: 'Tune, hold the guitar comfortably, and make clean first sounds.', difficulty: 'beginner', estimatedMinutes: 20, reason: 'A calm setup makes every later skill easier.', status: 'completed', checklist: ['Tune the guitar', 'Relax your fretting hand', 'Play each open string cleanly'], resources: [{ id: 'r1', title: 'First Guitar Setup', type: 'video', durationMinutes: 7, source: 'SkillPilot' }] },
    { id: 'essential-chords', title: 'Essential Chords', description: 'Learn the small chord vocabulary behind hundreds of simple songs.', difficulty: 'beginner', estimatedMinutes: 25, reason: 'Most campfire songs use a few open chords.', status: 'completed', checklist: ['Play G clearly', 'Play C clearly', 'Play D clearly', 'Play Em clearly'], resources: [{ id: 'r2', title: 'Four Chords for Simple Songs', type: 'video', durationMinutes: 9, source: 'SkillPilot' }] },
    { id: 'chord-transitions', title: 'Chord Transitions', description: 'Move between common chords smoothly without stopping the song.', difficulty: 'beginner', estimatedMinutes: 25, reason: 'Smooth chord transitions let you play complete songs without stopping.', status: 'available', checklist: ['G → C', 'C → D', 'D → Em'], resources: [{ id: 'r3', title: 'Chord Transitions for Beginners', type: 'video', durationMinutes: 8, source: 'SkillPilot' }, { id: 'r4', title: 'Smooth Chord Changes', type: 'reading', durationMinutes: 5, source: 'SkillPilot Guide' }] },
    { id: 'strumming-patterns', title: 'Strumming Patterns', description: 'Use two reliable strumming patterns for relaxed singalongs.', difficulty: 'beginner', estimatedMinutes: 30, reason: 'A steady strum turns simple chords into music.', status: 'locked', checklist: ['Down strums only', 'Down-up pattern', 'Mute and restart cleanly'], resources: [{ id: 'r5', title: 'Campfire Strumming Basics', type: 'video', durationMinutes: 10, source: 'SkillPilot' }] },
    { id: 'rhythm', title: 'Rhythm', description: 'Practice timing and learn how to recover when you miss a beat.', difficulty: 'beginner', estimatedMinutes: 20, reason: 'Rhythm keeps people singing with you.', status: 'locked', checklist: ['Clap quarter notes', 'Strum at 80 BPM', 'Keep going after a miss'], resources: [{ id: 'r6', title: 'Understanding Rhythm', type: 'reading', durationMinutes: 6, source: 'SkillPilot Guide' }] },
    { id: 'first-complete-song', title: 'First Complete Song', description: 'Combine chords, transitions, and strumming into one complete performance.', difficulty: 'beginner', estimatedMinutes: 40, reason: 'Finishing one song builds confidence and reveals what to polish next.', status: 'locked', checklist: ['Choose a 3-chord song', 'Play verse slowly', 'Play chorus without stopping'], resources: [{ id: 'r7', title: 'Beginner Campfire Song Walkthrough', type: 'video', durationMinutes: 12, source: 'SkillPilot' }] },
  ],
};

export const initialState: AppState = {
  goal: { hobby: 'Guitar', goal: 'Play simple songs confidently around a campfire', level: 'beginner', dailyMinutes: 20 },
  plan: seedPlan,
  selectedTechniqueId: 'chord-transitions',
  completedTechniqueIds: ['guitar-basics', 'essential-chords'],
  skippedTechniqueIds: [],
  notesByTechniqueId: {},
  practiceHistory: [
    { id: 'p1', techniqueId: 'guitar-basics', minutes: 20, notes: 'Clean posture.', completedAt: '2026-08-05T18:00:00.000Z' },
    { id: 'p2', techniqueId: 'essential-chords', minutes: 25, notes: 'G to C improved.', completedAt: '2026-08-07T18:00:00.000Z' },
  ],
  streak: 7,
};

export const aiPrompts = ['Explain this simply', 'Make this easier', 'Give me a practice exercise', 'Why am I struggling?', 'Help me choose a resource'];
export const aiSteps = ['Understanding your goal', 'Choosing the essential techniques', 'Finding the right learning resources', 'Keeping the plan achievable'];
