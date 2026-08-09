import { BookOpen, PlayCircle } from 'lucide-react';
import type { LearningResource } from '../types/learning';

export function ResourceCard({ resource }: { resource: LearningResource }) {
  const Icon = resource.type === 'video' ? PlayCircle : BookOpen;
  return (
    <a className="resource-card" href={resource.url} aria-label={`${resource.title}, ${resource.durationMinutes} minutes`}>
      <Icon size={20} />
      <span>
        <strong>{resource.title}</strong>
        <small>{resource.type} · {resource.durationMinutes} min · {resource.source}</small>
      </span>
    </a>
  );
}
