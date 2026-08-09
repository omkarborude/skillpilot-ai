import { Link } from 'react-router-dom';
import { Badge } from '../../shared/components/badge';
import { Card } from '../../shared/components/card';
import { EmptyState } from '../../shared/components/empty-state';
import { ProgressBar } from '../../shared/components/progress-bar';
import { useAppStore } from '../../shared/lib/appStore';
import { calculateProgress } from '../../shared/utils/progress';
import { useLearningData } from '../useLearningData';

export function LearningPlanPage() {
  const { plan, isLoading, error } = useLearningData();
  const completed = useAppStore((state) => state.completedTechniqueIds);

  if (isLoading) return <main className="screen"><div className="skeleton hero-skeleton" /></main>;
  if (error) return <main className="screen"><EmptyState title="Plan unavailable">{error}</EmptyState></main>;
  if (!plan) return <main className="screen"><EmptyState title="No techniques yet">Generate a plan to see your focused techniques.</EmptyState></main>;

  const progress = calculateProgress(completed.length, plan.techniques.length);
  return (
    <main className="screen">
      <div className="screen-heading"><p className="eyebrow">Learning Plan</p><h1>Your focused path</h1><ProgressBar value={progress} /><strong>{progress}% complete</strong></div>
      <div className="technique-list">
        {plan.techniques.map((technique, index) => (
          <Link className="technique-card" to={`/techniques/${technique.id}`} key={technique.id}>
            <span className={`status-dot ${technique.status}`}>{technique.status === 'completed' ? '✓' : index + 1}</span>
            <span><strong>{technique.title}</strong><small>{technique.difficulty} · {technique.estimatedMinutes} min</small><p>Why: {technique.reason}</p></span>
            <Badge>{technique.status}</Badge>
          </Link>
        ))}
      </div>
    </main>
  );
}
