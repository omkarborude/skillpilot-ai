import { useState } from 'react';
import { Text } from 'react-native';
import { aiPrompts } from '../data/seed';
import { aiService, type CoachResponse } from '../services/ai/aiService';
import { Card, Hero, PrimaryButton, ScreenStack, styles } from '../components/ui';
import type { ScreenProps } from './screenTypes';

export function AICoachScreen({ state, selectedTechnique }: ScreenProps) {
  const [answer, setAnswer] = useState<CoachResponse | null>(null);
  return (
    <ScreenStack>
      <Hero title={`You're learning ${selectedTechnique.title}.`} eyebrow="AI Coach" body="How can I help?" />
      {aiPrompts.map((prompt) => <PrimaryButton key={prompt} muted label={prompt} onPress={async () => setAnswer(await aiService.coach(prompt, state, selectedTechnique))} />)}
      {answer ? <Card title={answer.title} subtitle={answer.message}><Text style={styles.cardHeadline}>{answer.nextStep}</Text></Card> : null}
    </ScreenStack>
  );
}
