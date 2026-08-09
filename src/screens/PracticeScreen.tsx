import { useState } from 'react';
import { Text } from 'react-native';
import { aiService } from '../services/ai/aiService';
import { Card, ChecklistItem, Field, PrimaryButton, ScreenStack } from '../components/ui';
import type { ScreenProps } from './screenTypes';

export function PracticeScreen({ selectedTechnique, completeTechnique, go }: ScreenProps) {
  const [started, setStarted] = useState(false);
  const [notes, setNotes] = useState('');
  const [reflection, setReflection] = useState('');

  async function complete() {
    completeTechnique(selectedTechnique.id, selectedTechnique.estimatedMinutes, notes);
    setReflection(await aiService.reflect(selectedTechnique));
  }

  if (reflection) {
    return (
      <ScreenStack>
        <Card title="Nice work ✨" subtitle={reflection}>
          <PrimaryButton label="Continue" onPress={() => go('progress')} />
        </Card>
      </ScreenStack>
    );
  }

  return (
    <ScreenStack>
      <Card title={selectedTechnique.title} subtitle="Keep it simple. One focused session is enough for today.">
        <Text style={localStyles.timer}>{started ? `${selectedTechnique.estimatedMinutes}:00` : '20:00'}</Text>
        <PrimaryButton muted={started} label={started ? 'Pause' : 'Start'} onPress={() => setStarted(!started)} />
        {selectedTechnique.checklist.map((item) => <ChecklistItem key={item} label={item} />)}
        <Field label="Notes" value={notes} onChangeText={setNotes} multiline />
        <PrimaryButton label="Complete Practice" onPress={complete} />
      </Card>
    </ScreenStack>
  );
}

const localStyles = {
  timer: { color: '#6C5CE7', fontSize: 72, fontWeight: '900' as const, textAlign: 'center' as const, letterSpacing: -4 },
};
