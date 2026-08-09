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
- Express 5 + Zod backend with mock/Gemini provider adapters
- React Native StyleSheet and design tokens; no heavyweight chart/UI framework
- Jest, Node test runner, React Native Testing Library, ESLint, TypeScript, and GitHub Actions

See [the architecture brief](docs/ARCHITECTURE.md) and [backend architecture](docs/BACKEND_ARCHITECTURE.md) for boundaries, contracts, failure behavior, and deployment decisions.

## Run locally

```bash
npm install
npm run start
```

Open Android, iOS, or web from the Expo terminal. The first screen can generate a goal-specific local plan or open the ready-made Campfire Guitar demo.

Run the API separately:

```bash
cd backend
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL=http://localhost:3001` to use the API. Without it, the app stays in deterministic offline-demo mode.

## Validate

```bash
npm run lint
npm run typecheck
npm test
npm run export:web
npm run backend:typecheck
npm run backend:test
```

## Data and backend

`src/data/guitar-plan.json` is the frontend's versioned demo plan. `backend/src/data/hobby-blueprints.json` provides deterministic server data for guitar, chess, photography, drawing, and custom hobbies. Screens still depend on `AIPlanProvider`; configuring the API URL swaps in `HttpAIProvider` without screen rewrites and falls back locally if the network or model is unavailable.

The backend defaults to mock mode. In Gemini mode it uses Gemini 3.5 Flash-Lite with structured JSON output, keeps `GEMINI_API_KEY` server-side, and validates the result before returning it. Google currently lists free-tier input/output for this stable model; project-specific quotas must still be checked before submission.

The API can be hosted on Vercel Hobby for this non-commercial assignment. Import the repository, choose `backend` as the project Root Directory, and set the environment variables described in `backend/README.md`.

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
