import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/button';
import { Card } from '../../shared/components/card';
import { useAppStore } from '../../shared/lib/appStore';
import type { SkillLevel } from '../../shared/types/learning';

const levels: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];
const times = [10, 20, 30, 45];

export function CreateGoalPage() {
  const savedGoal = useAppStore((state) => state.goal);
  const setGoal = useAppStore((state) => state.setGoal);
  const navigate = useNavigate();
  const [hobby, setHobby] = useState(savedGoal.hobby);
  const [goal, setGoalText] = useState(savedGoal.goal);
  const [level, setLevel] = useState<SkillLevel>(savedGoal.level);
  const [dailyMinutes, setDailyMinutes] = useState(savedGoal.dailyMinutes);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGoal({ hobby, goal, level, dailyMinutes });
    navigate('/plan-generation');
  }

  return (
    <main className="screen narrow-screen">
      <p className="eyebrow">Create Goal</p>
      <h1>What do you want to get better at?</h1>
      <Card title="Build one realistic learning plan" description="Tell SkillPilot enough to keep your plan focused and achievable.">
        <form className="goal-form" onSubmit={submit}>
          <label>Hobby<input value={hobby} onChange={(event) => setHobby(event.target.value)} placeholder="Guitar" required /></label>
          <label>Goal<textarea value={goal} onChange={(event) => setGoalText(event.target.value)} placeholder="Play simple songs confidently around a campfire." required /></label>
          <fieldset><legend>Your level</legend><div className="choice-grid">{levels.map((item) => <button type="button" key={item} className={level === item ? 'choice selected' : 'choice'} onClick={() => setLevel(item)}>{item}</button>)}</div></fieldset>
          <fieldset><legend>Time available</legend><div className="choice-grid">{times.map((item) => <button type="button" key={item} className={dailyMinutes === item ? 'choice selected' : 'choice'} onClick={() => setDailyMinutes(item)}>{item === 45 ? '45+ min' : `${item} min`}</button>)}</div></fieldset>
          <Button type="submit">Create my learning plan</Button>
        </form>
      </Card>
    </main>
  );
}
