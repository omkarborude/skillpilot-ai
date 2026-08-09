import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { aiService } from '../../services/ai/aiService';
import { Button } from '../../shared/components/button';
import { Card } from '../../shared/components/card';
import { EmptyState } from '../../shared/components/empty-state';
import { useAppStore } from '../../shared/lib/appStore';
import { useLearningData } from '../useLearningData';

export function PracticePage() {
  const { techniqueId } = useParams();
  const { plan, isLoading } = useLearningData();
  const completeTechnique = useAppStore((state) => state.completeTechnique);
  const [started, setStarted] = useState(false);
  const [notes, setNotes] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);
  const technique = plan?.techniques.find((item) => item.id === techniqueId);
  const next = plan?.techniques.find((item) => item.status === 'locked');

  async function complete() {
    if (!technique) return;
    completeTechnique(technique.id, technique.estimatedMinutes, notes);
    setReflection(await aiService.reflect(technique));
  }

  if (isLoading) return <main className="screen"><div className="skeleton hero-skeleton" /></main>;
  if (!technique) return <main className="screen"><EmptyState title="Practice unavailable">Choose a technique from your plan.</EmptyState></main>;

  if (reflection) {
    return <main className="screen narrow-screen"><Card title="Nice work ✨" description="Technique completed."><p>{reflection}</p><p><strong>Next:</strong> {next?.title ?? 'Review your progress'}</p><Link to="/progress"><Button>Continue</Button></Link></Card></main>;
  }

  return (
    <main className="screen narrow-screen">
      <Card title={technique.title} description="Keep it simple. One focused session is enough for today.">
        <div className="timer" aria-live="polite">{started ? `${technique.estimatedMinutes}:00` : '20:00'}</div>
        <Button variant={started ? 'secondary' : 'primary'} onClick={() => setStarted((value) => !value)}>{started ? 'Pause' : 'Start'}</Button>
        <h2>Today’s checklist</h2><ul className="check-list">{technique.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
        <label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What felt easier? What needs another rep?" /></label>
        <Button onClick={complete}>Complete Practice</Button>
      </Card>
    </main>
  );
}
