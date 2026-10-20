# Mentorix Dashboard

Admin-facing web UI for **Mentorix**, built with the [Next.js App Router](https://nextjs.org/docs/app). This repository contains the administrative interface used to manage and operate the Mentorix platform.

## Overview

|             |                              |
| ----------- | ---------------------------- |
| **Role**    | Admin / operations dashboard |
| **Stack**   | Next.js, React, TypeScript   |
| **Styling** | Tailwind CSS                 |

This app is one piece of the broader Mentorix product; other services and user-facing apps may live in separate repositories.

## Requirements

- **Node.js** — LTS recommended (see [Node releases](https://nodejs.org/en/about/previous-releases))
- **Yarn** — this project uses [Yarn Classic](https://classic.yarnpkg.com/) (see `yarn.lock`)

## Getting started

Clone the repository and install dependencies:

```bash
git clone git@github.com:mentorix-app/dashboard.git
cd dashboard
yarn install
```

Start the development server:

```bash
yarn dev
```

### Environment variables

Create a local `.env` file with:

```bash
# Public base URL of the dashboard. Used for metadata (metadataBase, canonical,
# Open Graph / Twitter image URLs). Set to the deployed origin in production.
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MENTORIX_API_URL=https://mentorix-backend.onrender.com
# 32-byte base64 secret used to sign the auth session JWT. Generate with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
SESSION_SECRET=replace-me
# Web OAuth client ID for "Continue with Google" (the same one the mobile app uses as its
# serverClientId; the API already accepts it). The dashboard origin must be listed in the
# client's Authorized JavaScript origins in Google Cloud. Without it the Google button is hidden.
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
# Services ID for "Continue with Apple" (optional, defaults to com.mentorix.dashboard). Its Return URL
# must be NEXT_PUBLIC_APP_URL + /api/auth/apple/callback, and the ID must be in the API's APPLE_CLIENT_IDS.
APPLE_SERVICE_ID=com.mentorix.dashboard
# Secret shared with the API (its BFF_SHARED_SECRET, at least 32 bytes). With it the dashboard
# server forwards the browser address, so the API's sign-in and refresh rate limits count per person
# instead of per dashboard server. Server-only: never prefix it with NEXT_PUBLIC_, never commit it.
# Without it the headers are not sent and all dashboard users share the API's limits.
BFF_SHARED_SECRET=
```

Open [http://localhost:3000/ru](http://localhost:3000/ru) (Russian, default) or [http://localhost:3000/en](http://localhost:3000/en) (English). The root URL redirects to the default locale.

Routes use a **locale prefix** (e.g. [http://localhost:3000/ru/rq-demo](http://localhost:3000/ru/rq-demo)). If you open a path without a locale (e.g. `/rq-demo`), [`proxy.ts`](proxy.ts) picks a locale from `Accept-Language` via [negotiator](https://www.npmjs.com/package/negotiator) and [@formatjs/intl-localematcher](https://www.npmjs.com/package/@formatjs/intl-localematcher), then redirects to `/{locale}{path}`.

## Internationalization (i18n)

- **Library:** [next-intl](https://next-intl.dev/) for messages and navigation. Locales and defaults live in [`i18n/config.ts`](i18n/config.ts); [`i18n/routing.ts`](i18n/routing.ts) wires them into next-intl. Import the public helpers from [`@/i18n`](i18n/index.ts) (`i18n`, `routing`, `Link`, `useRouter`, etc.).
- **Messages:** JSON files in [`i18n/messages/`](i18n/messages/) — [`i18n/messages/ru.json`](i18n/messages/ru.json) and [`i18n/messages/en.json`](i18n/messages/en.json). Add keys per namespace (for example `Home`, `RqDemo`, `Metadata`).
- **Routing config:** request config [`i18n/request.ts`](i18n/request.ts), typed navigation helpers [`i18n/navigation.ts`](i18n/navigation.ts) (`Link`, `useRouter`, etc.).
- **Server components:** use `getTranslations` from `next-intl/server`. **Client components:** use `useTranslations` from `next-intl`.
- **HTTP:** [`proxy.ts`](proxy.ts) (Next.js proxy) negotiates locale, redirects missing-locale paths, runs `next-intl` middleware, and sets `Content-Language`.

## Scripts

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `yarn dev`          | Start the development server with hot reload       |
| `yarn build`        | Create an optimized production build               |
| `yarn start`        | Run the production server (run `yarn build` first) |
| `yarn lint`         | Run ESLint                                         |
| `yarn test`         | Run Jest tests                                     |
| `yarn format`       | Format the codebase with Prettier                  |
| `yarn format:check` | Check formatting without writing files             |

## Code quality

- **ESLint** — configured with `eslint-config-next` and Prettier compatibility via `eslint-config-prettier`
- **Prettier** — consistent formatting; respects `.prettierignore`
- **Git hooks** — on `git commit`, [Husky](https://typicode.github.io/husky/) runs [lint-staged](https://github.com/lint-staged/lint-staged), which formats staged files with Prettier and runs ESLint with `--fix` where applicable (see `config/lint-staged.config.mjs`)

To skip hooks for a one-off commit (use sparingly):

```bash
git commit --no-verify
```

## Project layout

```
app/[locale]/  # Localized routes (pages, layouts)
i18n/          # next-intl routing, request config, barrel `index.ts` → `@/i18n`
i18n/messages/ # Translation JSON (ru, en)
public/        # Static assets
```

Configuration lives at the repo root (`next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, etc.).

## Contributing

1. Create a branch from `main` (or the team’s default branch).
2. Keep changes focused; run `yarn lint` and `yarn format:check` before opening a pull request.
3. Follow existing patterns for components, naming, and file structure.

## License

This project is **private** and intended for Mentorix internal use unless stated otherwise.
