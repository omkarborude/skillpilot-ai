# SkillPilot API

Stateless Express 5 API for learning-plan generation, technique replacement, and contextual coaching.

## Local development

```bash
npm install
npm run dev
```

The default provider is deterministic mock data, so no account or key is required.

To exercise Gemini, provide these environment variables through your shell or Vercel project:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=your-server-side-key
GEMINI_MODEL=gemini-3.5-flash-lite
ALLOWED_ORIGINS=http://localhost:8081
```

Never use `EXPO_PUBLIC_` for the Gemini key; Expo public variables are embedded into the client application.

## Validation

```bash
npm run typecheck
npm test
npm run build
```

## Vercel

Create a Vercel project from the GitHub repository and select `backend` as its Root Directory. Vercel detects the default Express export in `src/index.ts`; no custom routing configuration is required. After deployment, verify `GET /api/v1/health`.

See [`docs/BACKEND_ARCHITECTURE.md`](../docs/BACKEND_ARCHITECTURE.md) for contracts, failure behavior, and the free-hosting decision.
