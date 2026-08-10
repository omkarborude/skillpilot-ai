import type { CoachRequest, LearnerGoal, ReplaceTechniqueRequest } from './contracts.js';

const mediaRules = `
Choose media by how the technique is actually learned:
- video for visible movement, posture, setup, or visual examples
- audio only when listening, rhythm, tone, or pronunciation is essential
- article for concepts, checklists, notation, and decision processes
- practice for immediate application; every technique needs a practice resource
For video, audio, and article items, return a precise searchQuery that a learner can paste into YouTube or Google. Describe what to look for without naming a specific creator, publication, title, URL, duration, or other unverified metadata. Never recommend audio-only learning for chess.
Practice items open SkillPilot's built-in timer and checklist, so they need only a concise description. Do not invent URLs or imply that a search recommendation is a verified source.`;

export function buildPlanPrompt(goal: LearnerGoal): string {
  return `You are a practical hobby curriculum designer. Build a focused learning plan, not a complete course.

Learner:
- hobby: ${goal.customHobby ?? goal.hobbyName}
- desired outcome: ${goal.reason}
- current level: ${goal.level}
- available time: ${goal.dailyMinutes} minutes per day

Return 5 to 8 high-leverage techniques in dependency order. Each step must create visible progress toward one realistic outcome. Avoid trivia, exhaustive theory, subscriptions, social features, and generic motivation.
${mediaRules}

Keep every description specific, concise, and safe. Keep each technique within the learner's daily time.`;
}

export function buildReplacementPrompt(input: ReplaceTechniqueRequest): string {
  return `Replace one learning technique while preserving its outcome.

Mode: ${input.mode}
Hobby: ${input.goal?.customHobby ?? input.goal?.hobbyName ?? 'not specified'}
Original technique: ${JSON.stringify(input.technique)}

Return one replacement technique only. It must be meaningfully ${input.mode}, practical, and no longer than ${input.technique.minutes} minutes.
${mediaRules}`;
}

export function buildCoachPrompt(input: CoachRequest): string {
  const recentConversation = input.recentMessages?.length
    ? input.recentMessages.map(({ role, content }) => `${role}: ${content}`).join('\n')
    : 'No earlier conversation is available.';

  return `Learner question: ${input.prompt}
Current hobby: ${input.goal?.customHobby ?? input.goal?.hobbyName ?? 'not specified'}
Current technique: ${input.technique ? JSON.stringify(input.technique) : 'not specified'}
Journey progress: ${input.journeyProgress ?? 0}%
Recent conversation:
${recentConversation}

Answer as a concise practice coach. Give one concrete cue and one immediate next action. Do not give a long lecture.`;
}
