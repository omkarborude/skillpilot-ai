import planData from '../../data/learning-plan.json';
import profileData from '../../data/profile.json';
import type { LearningPlan, Profile } from '../../shared/types/learning';

export interface LearningRepository {
  getLearningPlan(): Promise<LearningPlan>;
  getProfile(): Promise<Profile>;
}

export class LocalLearningRepository implements LearningRepository {
  async getLearningPlan() {
    return planData as LearningPlan;
  }

  async getProfile() {
    return profileData as Profile;
  }
}

export const learningRepository = new LocalLearningRepository();
