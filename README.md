# SkillPilot AI

SkillPilot turns one hobby goal into a focused 5–8 technique learning journey. It recommends the right medium for each technique, gives the learner one clear next action, supports complete/skip/AI-replace decisions, and persists progress locally.

## Product scope

The MVP intentionally contains nine primary screens:

1. Create Goal
2. AI Plan Generation
3. Dashboard
4. Learning Plan
5. Technique Detail
6. Practice
7. AI Coach
8. Progress
9. Profile

Today’s plan, resource preview, lesson replacement, achievements, and confirmations are sections or responsive sheets—not separate routes. Signup, social/community, leaderboards, subscription, notifications, generic settings, and voice/camera coaching are excluded because they do not improve the assignment’s core learning loop.

## Stack

- Expo SDK 57, React Native 0.86, React 19.2, strict TypeScript
- Expo Router for Android, iOS, and responsive web
- Zustand + AsyncStorage for small, persisted local journey state
- Repository and AI-provider interfaces, currently backed by deterministic JSON
- React Native StyleSheet and design tokens; no heavyweight chart/UI framework
- Jest, React Native Testing Library, ESLint, TypeScript, and GitHub Actions

See [the architecture brief](docs/ARCHITECTURE.md) for boundaries, data flow, consolidation decisions, and the backend-ready AI plan.

## Run locally

```bash
npm install
npm run start
```

Open Android, iOS, or web from the Expo terminal. The first screen can generate a goal-specific local plan or open the ready-made Campfire Guitar demo.

## Validate

```bash
npm run lint
npm run typecheck
npm test
npm run export:web
```

## Dummy data and future backend

`src/data/guitar-plan.json` is versioned, deterministic demo data. Screens depend on `PlanRepository` and `AIPlanProvider`, so the backend phase can replace the local implementations without rewriting UI code. The planned Node/Fastify API keeps the model key server-side and validates generated plans before returning them.

The initial researched provider candidate is Gemini 2.5 Flash-Lite because its official pricing page currently lists free-tier input/output and describes it as suitable for cost-efficient, at-scale usage. Quotas must be checked again before submission.

## AI-assisted engineering record

AI was used assistively for product ideation, official documentation research, architecture alternatives, and test-case review. The important decisions are explicit in `docs/ARCHITECTURE.md`, business logic is covered by tests, and every dependency has a concrete use. Before submitting, the candidate should complete the self-review checklist below and be able to explain each boundary and tradeoff.

- Run and inspect every primary flow on Android and responsive web.
- Review the complete PR diff and remove any code that cannot be explained.
- Test app restart persistence, complete/skip/replace transitions, and reset recovery.
- Record the Loom from a real device or emulator.

## Design and product references

- Category references: [Oboe](https://oboe.fyi/) and [Wondering](https://wondering.app/)
- Visual direction: the supplied SkillPilot concept board (purple/lavender palette, rounded cards, AI mascot, compact bottom navigation)

The navigation, screen consolidation, media choices, and learning loop were derived for this assignment rather than copied from either reference.
