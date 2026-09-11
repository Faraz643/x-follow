# X Follow

A production-oriented directory for discovering X accounts by category and opening their profiles to follow. The directory does **not** require the paid X API.

## Stack

- Next.js 15 App Router + TypeScript
- PostgreSQL + Prisma
- Zod request validation
- Responsive UI with server API routes
- Vercel-ready deployment

## How account submission works

A submitter provides an X profile URL, username, display name, optional bio and profile image URL, an email address, and a category. The server validates that the profile URL is an X/Twitter profile and that the URL username matches the submitted handle. The record is then stored in PostgreSQL.

The Follow button opens the public X profile directly. No X API credit, X bearer token, X OAuth client ID, or X client secret is required.

## Environment variables

Only these are required for the current version:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

`DATABASE_URL` is your PostgreSQL connection string from Supabase, Neon, or another PostgreSQL provider. `NEXT_PUBLIC_APP_URL` is your deployed Vercel URL.

Do **not** put database passwords, API keys, or secrets into GitHub.

## Local setup

```bash
npm install
npm run dev
```

The production build runs `prisma generate && prisma db push && next build`, so a fresh PostgreSQL database can be initialized automatically during deployment.

## Vercel

Import the repository into Vercel and add `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` under Project Settings → Environment Variables.

Automatic Git deployments are intentionally disabled in `vercel.json`. Create deployments manually from the Vercel dashboard or CLI when you are ready to publish a change.

## Product behavior

Visitors can browse and search the public directory without an X account or X API credentials. Anyone submitting an account provides their contact email and category. The account is stored server-side and becomes visible in the shared directory. Duplicate handles update the existing profile snapshot and add/update the category relationship.

## Production hardening before public launch

Add real user authentication/verification, admin moderation, rate limiting, abuse/report flows, image-host validation, email verification, audit logs, backups, monitoring, and scheduled profile refreshes if/when an X API subscription is introduced.
