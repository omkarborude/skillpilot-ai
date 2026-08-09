import { Button } from '../../shared/components/button';
import { Card } from '../../shared/components/card';
import { useAppStore } from '../../shared/lib/appStore';
import { useLearningData } from '../useLearningData';

export function ProfilePage() {
  const { profile } = useLearningData();
  const goal = useAppStore((state) => state.goal);
  const reset = useAppStore((state) => state.reset);

  return (
    <main className="screen narrow-screen">
      <Card title="Profile" description="A small profile for your current learning journey.">
        <div className="profile-avatar">{profile?.avatarInitials ?? 'SP'}</div>
        <dl className="profile-list">
          <div><dt>Name</dt><dd>{profile?.name ?? 'Learner'}</dd></div>
          <div><dt>Current hobby</dt><dd>{goal.hobby}</dd></div>
          <div><dt>Current goal</dt><dd>{goal.goal}</dd></div>
          <div><dt>Skill level</dt><dd>{goal.level}</dd></div>
          <div><dt>Daily practice target</dt><dd>{goal.dailyMinutes} minutes</dd></div>
        </dl>
        <Button variant="secondary" onClick={reset}>Reset learning plan</Button>
      </Card>
    </main>
  );
}
