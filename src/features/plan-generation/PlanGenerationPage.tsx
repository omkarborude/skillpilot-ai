import { CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../../services/ai/aiService';
import { learningRepository } from '../../services/repositories/learningRepository';
import { Button } from '../../shared/components/button';
import { Card } from '../../shared/components/card';
import { useAppStore } from '../../shared/lib/appStore';

export function PlanGenerationPage() {
  const goal = useAppStore((state) => state.goal);
  const setPlan = useAppStore((state) => state.setPlan);
  const navigate = useNavigate();
  const steps = aiService.getGenerationSteps();
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function generate() {
      try {
        const seedPlan = await learningRepository.getLearningPlan();
        const plan = await aiService.generatePlan(goal, seedPlan);
        window.setTimeout(() => {
          if (active) {
            setPlan(plan);
            setComplete(true);
          }
        }, 900);
      } catch {
        if (active) setError('SkillPilot could not generate a plan. Try again.');
      }
    }
    generate();
    return () => { active = false; };
  }, [goal, setPlan]);

  return (
    <main className="screen narrow-screen">
      <Card title="Building your learning path" description="Your plan will contain only the skills that matter for your goal.">
        {error ? <p role="alert">{error}</p> : null}
        <div className="ai-steps">
          {steps.map((step, index) => (
            <div className="ai-step" key={step}>{complete || index < 3 ? <CheckCircle2 /> : <Loader2 className="spin" />}<span>{step}</span></div>
          ))}
        </div>
        {complete ? <div className="summary-strip"><strong>6 techniques</strong><strong>{goal.dailyMinutes} min/day</strong><strong>{goal.level} friendly</strong></div> : null}
        <Button disabled={!complete} onClick={() => navigate('/dashboard')}>{complete ? 'Start Learning' : 'Generating...'}</Button>
      </Card>
    </main>
  );
}
