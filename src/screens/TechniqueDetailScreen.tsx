import { useState } from 'react';
import { View } from 'react-native';
import { Card, ChecklistItem, ConfirmSheet, Hero, PrimaryButton, ResourceItem, ScreenStack, styles } from '../components/ui';
import type { ScreenProps } from './screenTypes';

export function TechniqueDetailScreen({ selectedTechnique, skipTechnique, replaceTechnique, go }: ScreenProps) {
  const [dialog, setDialog] = useState<'skip' | 'replace' | null>(null);
  return (
    <ScreenStack>
      <Hero title={selectedTechnique.title} eyebrow={`${selectedTechnique.difficulty} · ${selectedTechnique.estimatedMinutes} min`} body={selectedTechnique.description} />
      <Card title="Why this matters" subtitle={selectedTechnique.reason} />
      <Card title="Learn">
        {selectedTechnique.resources.map((resource) => <ResourceItem key={resource.id} title={resource.title} meta={`${resource.type} · ${resource.durationMinutes} min · ${resource.source}`} />)}
      </Card>
      <Card title="Practice">
        {selectedTechnique.checklist.map((item) => <ChecklistItem key={item} label={item} />)}
        <View style={styles.choiceRow}>
          <PrimaryButton label="Start Practice" onPress={() => go('practice')} />
          <PrimaryButton muted label="Ask AI" onPress={() => go('coach')} />
        </View>
      </Card>
      <View style={styles.choiceRow}>
        <PrimaryButton muted label="Skip" onPress={() => setDialog('skip')} />
        <PrimaryButton muted label="Replace" onPress={() => setDialog('replace')} />
      </View>
      <ConfirmSheet
        visible={dialog !== null}
        title={dialog === 'skip' ? 'Skip this technique?' : 'Replace this technique?'}
        body="SkillPilot will keep the path focused and help you continue without overload."
        onClose={() => setDialog(null)}
        onConfirm={() => {
          if (dialog === 'skip') skipTechnique(selectedTechnique.id);
          if (dialog === 'replace') replaceTechnique(selectedTechnique.id);
          setDialog(null);
          go(dialog === 'skip' ? 'plan' : 'coach');
        }}
      />
    </ScreenStack>
  );
}
