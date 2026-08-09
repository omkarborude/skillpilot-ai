# SkillPilot AI

SkillPilot AI is a React Native learning app that helps people choose a hobby, define a realistic goal, and follow a focused 5–8 technique plan without information overload.

## Product problem

Hobby learners often get stuck browsing endless tutorials. SkillPilot narrows the path to the next useful technique, a small practice session, curated resources, and contextual AI coaching.

## Current implementation

The app is implemented as an Expo React Native app with the requested nine primary screens:

1. Create Goal
2. AI Plan Generation
3. Dashboard
4. Learning Plan
5. Technique Detail
6. Practice
7. AI Coach
8. Progress
9. Profile

Secondary features such as resources, notes, AI reflection, achievements, skip, replace, loading-style surfaces, and mobile bottom sheets are implemented inside those screens rather than as extra standalone screens.

## Architecture

```txt
App.tsx
src/
  app/          # Root app flow and theme tokens
  components/   # Reusable native UI primitives
  data/         # Local seed learning plan and AI copy
  services/ai/  # AI service, provider abstraction, and validation
  state/        # AsyncStorage-backed state hook
  types/        # Domain types
  utils/        # Pure utilities
```

## Data flow

```txt
Screen -> state hook/service -> local seed data / AsyncStorage / mock AI provider
```

The UI does not call an AI SDK directly. `AIService` depends on an `AIProvider`, and the initial implementation uses `MockAIProvider`.

## Local setup

```bash
npm install
npm run start
```

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
```

## Design direction

The mobile UI follows the supplied mockup direction: premium cards, rounded surfaces, purple primary actions, concise copy, strong hierarchy, and bottom navigation.

## Future improvements

- Replace the mock AI provider with a backend-mediated provider.
- Add React Navigation if deeper native navigation behavior is needed.
- Add end-to-end device tests once dependency installation is available.
