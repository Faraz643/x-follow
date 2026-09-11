# X Follow

A production-oriented directory for discovering X accounts by category and opening their profiles to follow.

## Stack

- Next.js 15 App Router + TypeScript
- PostgreSQL + Prisma
- X OAuth 2.0 + X API v2
- Signed, HTTP-only session cookie
- Responsive UI with server API routes

## Local setup

1. Create a PostgreSQL database.
2. Copy `.env.example` to `.env` and fill every value.
3. Create an X developer app with OAuth 2.0 enabled. Add the callback URL from `X_REDIRECT_URI`.
4. `npm install`
5. `npx prisma db push`
6. `npm run dev`

## Vercel

Import the repository into Vercel. Add the same environment variables in Project Settings → Environment Variables. Vercel runs `prisma generate && next build` automatically through the build script.

Required variables: `DATABASE_URL`, `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_BEARER_TOKEN`, `NEXT_PUBLIC_APP_URL`, `X_REDIRECT_URI`, `AUTH_SECRET`.

## Product behavior

Visitors can browse and search the public directory without signing in. A user signs in with X, selects a category, enters an X handle, and the server validates the profile through X API before storing the profile snapshot and category relationship. The Follow button always opens the canonical X profile in a new tab.

## Production hardening

Add rate limiting/WAF to POST endpoints, admin moderation for submissions, scheduled profile refreshes, audit logs, monitoring, backups, and an email/contact mechanism if required. Never expose X client secrets or bearer tokens to the browser.
