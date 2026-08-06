import { AiMessage } from '@/types/domain';
export interface AiCoachService { sendMessage(prompt: string): Promise<AiMessage>; replaceLesson(reason: string): Promise<string[]>; }
export const createAiCoachService = (): AiCoachService => ({
 async sendMessage(prompt) { return { id: Date.now().toString(), role: 'coach', content: `Let's simplify it: ${prompt}` }; },
 async replaceLesson(reason) { return [`Simpler explanation for ${reason}`, 'Shorter micro-lesson', 'Different analogy and examples']; }
});
