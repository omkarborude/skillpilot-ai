# SkillPilot AI

SkillPilot AI helps people choose a hobby goal and turn it into a focused learning path without information overload.

## Current phase

This repository is in the foundation phase. The app shell, routing entry point, provider composition, design tokens, shared primitives, TypeScript configuration, lint configuration, and test/build scripts are in place.

## Product direction

The product will focus on nine core screens:

1. Create Goal
2. AI Plan Generation
3. Dashboard
4. Learning Plan
5. Technique Detail
6. Practice
7. AI Coach
8. Progress
9. Profile

## Architecture

The codebase follows a feature-first frontend structure:

```txt
src/
  app/                 # Router, providers, and app layout
  features/            # Screen-specific feature areas
  shared/              # Reusable components, types, constants, lib, and utilities
  services/            # API and repository boundaries
  data/                # Local JSON data sources for the first implementation
  assets/              # Static assets
```

The intended data flow is:

```txt
Page -> Feature Hook -> Service -> Repository -> Data Source
```

UI code should not import JSON directly. Repository implementations can later move from local data to HTTP APIs without changing screens.

## AI architecture

The app will start with a mock AI provider and keep React components isolated from provider SDKs:

```txt
React -> useAI() -> AIService -> AIProvider -> MockAIProvider / future backend provider
```

Model output must be validated before entering application state.

## Tech stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Zod
- Vitest
- ESLint
- Prettier

Dependencies are declared in `package.json`. Installation currently depends on access to the npm registry.

## Local setup

```bash
npm install
npm run dev
```

## Quality commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
