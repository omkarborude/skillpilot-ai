# SkillPilot

SkillPilot turns one hobby goal into a 5–8 technique learning journey. It recommends a learning format for each technique, gives the learner one clear next action, supports complete, skip, and plan-adaptation decisions, and persists progress locally.

## Product scope

The product contains nine primary screens:

1. Create Goal
2. Plan Generation
3. Dashboard
4. Learning Plan
5. Technique Detail
6. Practice
7. Coach
8. Progress
9. Profile

Today’s plan, resource preview, lesson replacement, achievements, and confirmations are sections or responsive sheets—not separate routes. Signup, social/community, leaderboards, subscription, notifications, generic settings, and voice/camera coaching are excluded because they do not improve the assignment’s core learning loop.

## Stack

- Expo SDK 57, React Native 0.86, React 19.2, strict TypeScript
- Expo Router for Android, iOS, and responsive web
- Zustand with IndexedDB on web and AsyncStorage on native for persisted journey state
- An HTTP provider backed by Gemini for plans, adaptations, and coach responses
- Express 5 + Zod backend with validated Gemini structured output
- React Native StyleSheet and design tokens; no heavyweight chart/UI framework
- Jest, Node test runner, React Native Testing Library, ESLint, TypeScript, and GitHub Actions

See [the architecture brief](docs/ARCHITECTURE.md) and [backend architecture](docs/BACKEND_ARCHITECTURE.md) for boundaries, contracts, failure behavior, and deployment decisions.

## Run locally

```bash
npm install
npm run start
```

Open Android, iOS, or web from the Expo terminal and create a goal-specific plan.

Run the API separately:

```bash
cd backend
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL=http://localhost:3001`. The app shows a retryable service error when the API is unavailable; it never substitutes fabricated learning content.

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

Screens depend on `AIPlanProvider`, implemented by `HttpAIProvider`. The backend uses the configured Gemini model with structured JSON output, keeps `GEMINI_API_KEY` server-side, and validates generated results with Zod before returning them. The client also validates API envelopes with Zod. Provider failures remain visible and retryable instead of being replaced with fabricated content.

The deployed client is configured to use `https://skillpilot-api.onrender.com`. Render setup and environment variables are described in `backend/README.md`.

External learning items are search recommendations, not a curated resource catalog. The backend returns a validated search query and the client opens a Zod-validated YouTube or Google search URL. SkillPilot does not claim a source title, duration, or direct URL that it has not verified. Google Search grounding was reviewed, but grounded source attribution is not enabled in the current provider path and has not been live-verified for this submission.

## AI-assisted engineering record

I used AI for product ideation, official documentation research, and review of documentation, code, and test cases. I owned the product scope, architecture decisions, implementation review, and testing. I reviewed generated suggestions before accepting them and kept the final behavior within the boundaries described in this repository.

Before submission, I use this checklist:

- Run and inspect every primary flow on Android and responsive web.
- Review the complete PR diff and remove any code that cannot be explained.
- Test app restart persistence, complete/skip/replace transitions, and reset recovery.
- Record the Loom from a real device or emulator.

## Design and product references

- Category references: [Oboe](https://oboe.fyi/) and [Wondering](https://wondering.app/)
- Visual direction: the supplied SkillPilot concept board (purple/lavender palette, rounded cards, AI mascot, compact bottom navigation)

The navigation, screen consolidation, media choices, and learning loop were derived for this assignment rather than copied from either reference.
