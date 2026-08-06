# SkillPilot AI

A polished Expo + React Native foundation for an AI-powered learning app. The project uses a feature-first architecture with Expo Router, TypeScript, TanStack Query, Zustand, NativeWind, MMKV, FlashList, Reanimated, Gesture Handler, Skia-ready SVG/chart components, notifications, and secure storage.

## Architecture

```text
UI -> Feature -> Hooks -> Repository -> API -> Storage
```

The source tree follows the requested scalable structure under `src/`, including `features`, reusable `components`, `services`, `hooks`, `theme`, `constants`, and domain `types`. The voice coach journey is intentionally omitted; the AI replacement lesson screen is represented in the app screen catalog.

## Commands

```bash
npm install
npm run start
npm run typecheck
npm run test
```
