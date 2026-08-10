# SkillPilot — Architecture Brief

## Product boundary

SkillPilot answers one question: **“What should I learn next to reach my hobby goal?”** It creates a focused 5–8 technique plan, mixes media with practice, lets the learner complete, skip, or replace a technique, and makes overall progress obvious.

The original design board is consolidated into exactly nine primary screens:

1. **Create Goal** — hobby, outcome, level, and daily time in one guided form.
2. **AI Plan Generation** — transparent generation steps plus a useful retry state.
3. **Dashboard** — next best action, today’s mission, streak, and journey progress.
4. **Learning Plan** — ordered 5–8 technique roadmap.
5. **Technique Detail** — overview plus context-appropriate video, audio, or reading resources.
6. **Practice** — focused timer, checklist, reflection, and completion.
7. **AI Coach** — contextual explain/simplify/replace assistance, not a generic chatbot.
8. **Progress** — weekly insight, completed/skipped techniques, and achievements.
9. **Profile** — goal summary and reset/export actions only.

Splash is native launch branding. Today’s plan, lesson replacement, notes, achievement detail, and confirmation states are sections, sheets, or dialogs—not extra screens. Signup, social/community, leaderboard, subscription, notifications, voice/camera coaching, and settings are intentionally excluded.

## Technical shape

```mermaid
flowchart TD
    R["Expo Router screens"] --> F["Feature UI and hooks"]
    F --> S["Journey store"]
    F --> P["Plan and coach providers"]
    P --> H["HTTP provider"]
    H --> B["Express API on Vercel"]
    B --> G["Gemini provider"]
    S --> A["IndexedDB / AsyncStorage adapter"]
```

- **Runtime:** Expo SDK 57, React Native 0.86, React 19.2, TypeScript strict mode, Hermes/New Architecture.
- **Navigation:** Expo Router for Android, iOS, and responsive web from one route tree.
- **State:** one small persisted journey store; transient form/sheet state remains local. TanStack Query is deferred until the backend creates real server state.
- **Data boundary:** UI depends on `AIPlanProvider`; the HTTP implementation sends plans, adaptations, and contextual Coach requests to the backend.
- **Persistence:** IndexedDB on web and AsyncStorage on native keep onboarding, real practice sessions, conversation history, and progress after restart.
- **UI:** React Native `StyleSheet`, design tokens, reusable primitives, platform-aware sheets/modals, responsive max-width layouts, and built-in animations. Heavy packages are added only for measured needs.

```text
src/
  app/                 routes and layouts only
  features/            onboarding, plan, practice, coach, progress, profile
  components/          reusable product and UI primitives
  services/             HTTP provider and platform storage adapter
  store/                persisted journey state and selectors
  theme/                colors, spacing, typography, shadows
  types/                domain contracts
  utils/                pure calculations and validation
```

## Backend AI plan

The frontend uses HTTP when `EXPO_PUBLIC_API_URL` is configured. A separate `backend/` project contains an Express 5/TypeScript API designed for serverless deployment. It provides plan generation, contextual coaching, and technique replacement. The API key remains server-side, request and generated-output schemas are validated with Zod, and provider failures return traceable errors for retry instead of fabricated content.

The selected model is **Gemini 3.5 Flash-Lite**, a stable GA model that Google currently describes as its most cost-efficient 3.5 model and lists with free-tier input/output. The model is configurable by environment variable, and quotas are rechecked before submission because free limits can change.

See [the backend architecture](BACKEND_ARCHITECTURE.md) for API contracts, deployment, security, and failure behavior.

## Quality gates

- Unit tests: progress calculation, technique transitions, validation, and repository mapping.
- Component tests: Create Goal, complete/skip/replace, persistence recovery, and empty/error states.
- E2E smoke flow: create goal → generate plan → practice → complete → verify progress.
- CI: format, ESLint, TypeScript, Jest, and Expo web export; Android preview/APK after the UI stabilizes.

## Research references

- [Expo SDK 57 / React Native 0.86](https://expo.dev/changelog/sdk-57)
- [Expo Router for universal React Native apps](https://docs.expo.dev/router/introduction/)
- [React Native Hermes](https://reactnative.dev/docs/hermes)
- [Expo unit testing with Jest](https://docs.expo.dev/develop/unit-testing/)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
