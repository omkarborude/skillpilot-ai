import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../../shared/components/badge';
import { Button } from '../../shared/components/button';
import { Card } from '../../shared/components/card';
import { Dialog } from '../../shared/components/dialog';
import { EmptyState } from '../../shared/components/empty-state';
import { ResourceCard } from '../../shared/components/resource-card';
import { useAppStore } from '../../shared/lib/appStore';
import { useLearningData } from '../useLearningData';

export function TechniqueDetailPage() {
  const { techniqueId } = useParams();
  const navigate = useNavigate();
  const { plan, isLoading } = useLearningData();
  const skipTechnique = useAppStore((state) => state.skipTechnique);
  const replaceTechnique = useAppStore((state) => state.replaceTechnique);
  const [dialog, setDialog] = useState<'skip' | 'replace' | null>(null);

  if (isLoading) return <main className="screen"><div className="skeleton hero-skeleton" /></main>;
  const technique = plan?.techniques.find((item) => item.id === techniqueId);
  if (!technique) return <main className="screen"><EmptyState title="Technique not found">Return to your plan and choose another technique.</EmptyState></main>;

  return (
    <main className="screen detail-grid">
      <section className="hero-card"><Badge>{technique.difficulty} · {technique.estimatedMinutes} min</Badge><h1>{technique.title}</h1><p>{technique.description}</p></section>
      <Card title="Why this matters"><p>{technique.reason}</p></Card>
      <Card title="Learn"><div className="resource-list">{technique.resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div></Card>
      <Card title="Practice"><ul className="check-list">{technique.checklist.map((item) => <li key={item}>{item}</li>)}</ul><div className="action-row"><Link to={`/practice/${technique.id}`}><Button>Start Practice</Button></Link><Link to="/coach"><Button variant="secondary">Ask AI</Button></Link></div></Card>
      <Card title="Adjust this technique"><div className="action-row"><Button variant="secondary" onClick={() => setDialog('skip')}>Skip</Button><Button variant="secondary" onClick={() => setDialog('replace')}>Replace technique</Button></div></Card>
      <Dialog title="Skip this technique?" open={dialog === 'skip'} actionLabel="Skip technique" onClose={() => setDialog(null)} onAction={() => { skipTechnique(technique.id); navigate('/plan'); }}>SkillPilot will keep the path focused and move you to the next available technique.</Dialog>
      <Dialog title="Replace this technique?" open={dialog === 'replace'} actionLabel="Replace" onClose={() => setDialog(null)} onAction={() => { replaceTechnique(technique.id); navigate('/coach'); }}>Ask the AI coach for a simpler alternative that still supports your goal.</Dialog>
    </main>
  );
}
