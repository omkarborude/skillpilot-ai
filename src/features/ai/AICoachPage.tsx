import { useState } from 'react';
import { Bot } from 'lucide-react';
import { aiService } from '../../services/ai/aiService';
import { Button } from '../../shared/components/button';
import { Card } from '../../shared/components/card';
import { useAppStore } from '../../shared/lib/appStore';
import { useLearningData } from '../useLearningData';

export function AICoachPage() {
  const { plan } = useLearningData();
  const goal = useAppStore((state) => state.goal);
  const completedIds = useAppStore((state) => state.completedTechniqueIds);
  const skippedIds = useAppStore((state) => state.skippedTechniqueIds);
  const recentPractice = useAppStore((state) => state.practiceHistory.slice(-3));
  const [answer, setAnswer] = useState<{ title: string; message: string; nextStep: string } | null>(null);
  const current = plan?.techniques.find((technique) => technique.status === 'available') ?? plan?.techniques[0];

  async function ask(prompt: string) {
    if (!plan || !current) return;
    setAnswer(await aiService.coach(prompt, {
      goal,
      currentTechnique: current,
      completedTechniques: plan.techniques.filter((technique) => completedIds.includes(technique.id)),
      skippedTechniques: plan.techniques.filter((technique) => skippedIds.includes(technique.id)),
      recentPractice,
    }));
  }

  return (
    <main className="screen narrow-screen coach-screen">
      <Card title={`You're learning ${current?.title ?? goal.hobby}.`} description="How can I help?">
        <div className="coach-avatar"><Bot size={36} /></div>
        <div className="prompt-grid">{aiService.getCoachPrompts().map((prompt) => <Button key={prompt} variant="secondary" onClick={() => ask(prompt)}>{prompt}</Button>)}</div>
        {answer ? <section className="ai-answer" aria-live="polite"><h2>{answer.title}</h2><p>{answer.message}</p><strong>{answer.nextStep}</strong></section> : null}
      </Card>
    </main>
  );
}
