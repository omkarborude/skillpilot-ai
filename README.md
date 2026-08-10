# SkillPilot

SkillPilot is a small learning app for hobbies. A user picks a goal and the app creates a focused plan with techniques, resources, and practice tasks.

## Features

- Phone number and OTP login
- Personal learning plans
- Technique details and learning resources
- Practice timer and checklist
- AI coach
- Progress tracking
- Local data storage

## Frontend

The app uses Expo, React Native, TypeScript, and Expo Router. It runs on Android, iOS, and the web.

State is managed with Zustand. Data is stored in IndexedDB on the web and AsyncStorage on mobile.

### Run the app

```bash
npm install
cp .env.example .env
npm run start
```

Set the backend URL in `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

## Backend

The backend is an Express API written in TypeScript. It uses Gemini to create plans, replace techniques, and answer coach questions. Gemini responses are checked with Zod before they are sent to the app.

### Run the API

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Add a Gemini API key to `backend/.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-3.5-flash-lite
ALLOWED_ORIGINS=*
PORT=3001
```

The deployed API is currently hosted at `https://skillpilot-api.onrender.com`.

## Checks

Run these before pushing changes:

```bash
npm run lint
npm run typecheck
npm test
npm run export:web
npm run backend:typecheck
npm run backend:test
```

More details are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/BACKEND_ARCHITECTURE.md](docs/BACKEND_ARCHITECTURE.md).
