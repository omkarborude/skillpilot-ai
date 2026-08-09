import type { useSkillPilotState } from '../state/useSkillPilotState';
import type { AppNavigation } from '../types/navigation';

export type ScreenProps = ReturnType<typeof useSkillPilotState> & AppNavigation & { progress: number };
