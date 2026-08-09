import { Link } from 'react-router-dom';
import { Flame, Sparkles } from 'lucide-react';
import { aiService } from '../../services/ai/aiService';
import { Badge } from '../../shared/components/badge';
import { Button } from '../../shared/components/button';
import { Card } from '../../shared/components/card';
import { EmptyState } from '../../shared/components/empty-state';
import { ProgressBar } from '../../shared/components/progress-bar';
import { ResourceCard } from '../../shared/components/resource-card';
import { useAppStore } from '../../shared/lib/appStore';
import { calculateProgress } from '../../shared/utils/progress';
import { useLearningData } from '../useLearningData';

export function DashboardPage() {
  const { plan, profile, isLoading, error } = useLearningData();
  const goal = useAppStore((state) => state.goal);
  const streak = useAppStore((state) => state.streak);
  const completed = useAppStore((state) => state.completedTechniqueIds);

  if (isLoading) return <main className="screen"><div className="skeleton hero-skeleton" /></main>;
  if (error) return <main className="screen"><EmptyState title="Dashboard unavailable">{error}</EmptyState></main>;
  if (!plan) return <main className="screen"><EmptyState title="No plan yet">Create a goal to generate your first focused path.</EmptyState></main>;

  const current = plan.techniques.find((technique) => technique.status === 'available') ?? plan.techniques[0];
  const progress = calculateProgress(completed.length, plan.techniques.length);

  return (
    <main className="screen dashboard-grid">
      <section className="hero-card">
        <p className="eyebrow">Good evening, {profile?.name ?? 'learner'} 👋</p>
        <h1>{plan.title}</h1>
        <p>{goal.goal}</p>
        <ProgressBar value={progress} label="Overall progress" />
        <strong>{progress}% complete</strong>
      </section>
      <Card title="Today’s mission" description={current.reason}>
        <div className="mission-row"><span><Flame /> {current.title}</span><Badge>{goal.dailyMinutes} minutes</Badge></div>
        <Link to={`/techniques/${current.id}`}><Button>Continue</Button></Link>
      </Card>
      <Card title="AI Insight"><p className="insight"><Sparkles size={18} /> {aiService.getDashboardInsight()}</p></Card>
      <Card title="Momentum"><div className="metric"><strong>{streak}</strong><span>day streak</span></div></Card>
      <Card title="Next recommended resource">{current.resources[0] ? <ResourceCard resource={current.resources[0]} /> : <p>No resource needed today.</p>}</Card>
    </main>
  );
}
