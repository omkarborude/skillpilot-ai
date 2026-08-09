import { Award } from 'lucide-react';
import { Card } from '../../shared/components/card';
import { ProgressBar } from '../../shared/components/progress-bar';
import { useAppStore } from '../../shared/lib/appStore';
import { calculateProgress } from '../../shared/utils/progress';
import { useLearningData } from '../useLearningData';

const week = ['Mon ✓', 'Tue ✓', 'Wed -', 'Thu ✓', 'Fri ✓', 'Sat -', 'Sun -'];

export function ProgressPage() {
  const { plan } = useLearningData();
  const completed = useAppStore((state) => state.completedTechniqueIds);
  const practice = useAppStore((state) => state.practiceHistory);
  const totalMinutes = practice.reduce((sum, item) => sum + item.minutes, 0);
  const progress = calculateProgress(completed.length, plan?.techniques.length ?? 0);

  return (
    <main className="screen">
      <section className="hero-card"><p className="eyebrow">Progress</p><h1>Overall Progress</h1><div className="big-number">{progress}%</div><ProgressBar value={progress} /></section>
      <div className="stats-grid"><Card title="Techniques"><div className="metric"><strong>{completed.length} / {plan?.techniques.length ?? 0}</strong><span>complete</span></div></Card><Card title="Practice"><div className="metric"><strong>{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</strong><span>total time</span></div></Card><Card title="Consistency"><div className="metric"><strong>82%</strong><span>this week</span></div></Card></div>
      <Card title="This Week"><div className="week-row">{week.map((day) => <span key={day}>{day}</span>)}</div></Card>
      <Card title="AI Insight"><p>You're practicing consistently. The next improvement will come from shorter but more frequent sessions.</p></Card>
      <Card title="Achievements"><div className="achievement-row"><span><Award /> 7 Day Streak</span><span><Award /> First Chord</span><span><Award /> Quick Learner</span></div></Card>
    </main>
  );
}
