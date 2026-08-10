# SkillPilot API

Stateless Express 5 API for learning-plan generation, technique replacement, and contextual coaching.

## Local development

```bash
npm install
npm run dev
```

Provide these environment variables through your shell or deployment project:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=your-server-side-key
GEMINI_MODEL=gemini-3.5-flash-lite
ALLOWED_ORIGINS=http://localhost:8081
```

Never use `EXPO_PUBLIC_` for the Gemini key; Expo public variables are embedded into the client application.

Gemini is the configured provider. If generation fails, the API returns an error with a request ID so the client can offer a retry; it does not return a fabricated plan or coach response.

## Validation

```bash
npm run typecheck
npm test
npm run compile
```

## Render

Create a Render Web Service from the GitHub repository and select `backend` as its Root Directory. Use `npm ci && npm run compile` as the build command and `npm start` as the start command. Add the environment variables above in Render, then verify `GET /api/v1/health` after deployment.

See [`docs/BACKEND_ARCHITECTURE.md`](../docs/BACKEND_ARCHITECTURE.md) for contracts, failure behavior, and the deployment decision.
