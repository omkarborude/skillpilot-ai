import { useQuery } from '@tanstack/react-query';
import { roadmapRepository } from './repository';
export const useTodayPlan = () => useQuery({ queryKey: ['today-plan'], queryFn: () => roadmapRepository.getTodayPlan() });
export const useRoadmapNodes = () => useQuery({ queryKey: ['roadmap-nodes'], queryFn: () => roadmapRepository.getNodes() });
