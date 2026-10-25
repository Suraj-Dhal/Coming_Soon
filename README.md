<div align="center">

# surajdhal.com — Coming Soon

A motion-led holding page for Suraj Dhal's personal site, with a secure Supabase-backed contact form.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live:** [surajdhal.com](https://surajdhal.com)

</div>

<p align="center">
  <img src="docs/images/home.jpg" alt="The surajdhal.com Coming Soon page on desktop: a motion-blurred figure behind drifting 'coming soon' type, with a spinner, Suraj Dhal's name and a Coming Soon button." width="100%" />
</p>

<details>
<summary>Mobile view</summary>
<p align="center">
  <img src="docs/images/mobile.jpg" alt="The Coming Soon page on a 390px-wide phone screen." width="320" />
</p>
</details>

## Overview

This repository holds the temporary landing page for [surajdhal.com](https://surajdhal.com) while the full site is being built. It is a single Next.js App Router page with a grayscale, motion-led hero and a contact dialog. Messages from the dialog are validated on the server and inserted into a Supabase table that the public key can write to but never read.

## Features

- **Motion-led hero.** Oversized "coming soon" type drifts in layers around a pre-blurred figure with ghost layers, grain, vignette, a loading spinner and a faux status bar whose battery charges during the intro.
- **Pointer parallax.** Depth layers follow the pointer through CSS variables, throttled with `requestAnimationFrame`. It only runs for fine pointers and is skipped on touch devices.
- **Reduced-motion support.** `prefers-reduced-motion` collapses animations and transitions to their settled state.
- **Contact dialog.** The "Coming Soon" button (labelled "Get in touch" on hover) opens a native `<dialog>` with name, email and message fields, a character counter, inline field errors and a sent confirmation.
- **Shared validation.** The browser and the API route use the same rules in `lib/contact.ts`: length limits, email format, and rejection of control characters.
- **Layered spam protection.** The form uses a honeypot field, a minimum fill time, a same-origin check, a body-size cap, a per-instance IP rate limit and a database-level rate-limit trigger.
- **Metadata and SEO.** The page ships with Open Graph and Twitter cards (with alt text), a favicon, an app icon and an Apple touch icon, a canonical URL, `Person` JSON-LD, `robots.txt` and `sitemap.xml`.
- **Security headers.** These are applied to every route: Content Security Policy, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, COOP and a restrictive Permissions-Policy. The `X-Powered-By` header is disabled.
- **Lightweight assets.** The motion blur is baked into `public/figure.webp` at build time, so the browser only animates transforms and opacity. Inter is self-hosted through `next/font`.

## Tech stack

| Layer      | Technology                                                     |
| ---------- | -------------------------------------------------------------- |
| Framework  | [Next.js 16](https://nextjs.org) (App Router, Turbopack)       |
| UI         | [React 19](https://react.dev), plain CSS (`app/globals.css`)   |
| Language   | [TypeScript](https://www.typescriptlang.org) (strict)          |
| Data       | [Supabase](https://supabase.com) Postgres via `supabase-js`    |
| Hosting    | [Vercel](https://vercel.com) (`bom1` / Mumbai function region) |
| Tooling    | ESLint (`eslint-config-next`), Prettier                        |
| Asset prep | `sharp`, `playwright-core` with Google Chrome                  |

## Project structure

```text
.
├── app/
│   ├── api/contact/route.ts      # POST handler: origin, size, bot and rate checks, then insert
│   ├── layout.tsx                # Metadata, viewport, Inter font, Person JSON-LD
│   ├── page.tsx                  # The Coming Soon page
│   ├── globals.css               # All styles and animations
│   ├── robots.ts                 # /robots.txt (disallows /api/)
│   ├── sitemap.ts                # /sitemap.xml
│   ├── opengraph-image.jpg       # 1200×630 share image (+ .alt.txt)
│   ├── twitter-image.jpg         # Copy of the share image (+ .alt.txt)
│   └── favicon.ico, icon.png, apple-icon.png
├── components/
│   ├── backdrop.tsx              # Gradient, drifting type, figure layers, grain, vignette
│   ├── contact-launcher.tsx      # Button and contact <dialog> form (client component)
│   ├── parallax.tsx              # Pointer-driven --px / --py CSS variables
│   ├── spinner.tsx               # 12-bar loading spinner
│   └── status-bar.tsx            # Decorative window dots and phone status icons
├── lib/
│   ├── contact.ts                # Validation rules shared by the form and the API
│   └── server/store.ts           # Supabase insert using the publishable key
├── public/figure.webp            # Pre-blurred figure behind the hero
├── scripts/
│   ├── build-figure.mjs          # Regenerates public/figure.webp from a portrait
│   └── build-share-images.mjs    # Screenshots the page into the share images
├── supabase/migrations/          # Table, RLS policy, grants and rate-limit trigger
├── docs/images/                  # README screenshots
├── next.config.ts                # Security headers and CSP
├── vercel.json                   # Framework preset and function region
└── .env.example                  # Required environment variables
```

## Getting started

Requirements: Node.js 20.9 or later, and npm.

```bash
git clone https://github.com/Suraj-Dhal/surajdhal-coming-soon.git
cd surajdhal-coming-soon
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

The development server runs at `http://localhost:3000`. The page renders without Supabase credentials. Only contact submissions need them; without them the API responds with a 503 and logs a configuration error.

To set up the database, apply the SQL in `supabase/migrations/` to your Supabase project, using the Supabase CLI or the dashboard's SQL editor.

## Environment variables

| Variable                   | Purpose                                                                     |
| -------------------------- | --------------------------------------------------------------------------- |
| `SUPABASE_URL`             | Supabase project URL                                                        |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`); RLS limits it to inserting messages |

Both are read only on the server, at request time. Don't commit `.env.local`, service-role keys or other secrets.

## Scripts

| Command                         | What it does                                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                   | Start the development server                                                                                            |
| `npm run build`                 | Create a production build                                                                                               |
| `npm start`                     | Serve the production build                                                                                              |
| `npm run typecheck`             | Type-check with `tsc --noEmit`                                                                                          |
| `npm run lint`                  | Lint with ESLint                                                                                                        |
| `npm run format`                | Format the codebase with Prettier                                                                                       |
| `npm run format:check`          | Check formatting without writing                                                                                        |
| `npm run check`                 | Typecheck, lint, format check and build: run this before every change                                                   |
| `npm run figure -- <png>`       | Rebuild `public/figure.webp` from a transparent portrait PNG                                                            |
| `npm run share-images -- <url>` | Screenshot a running production server into `app/opengraph-image.jpg` and `app/twitter-image.jpg` (needs Google Chrome) |

To regenerate the share images:

```bash
npm run build && npm start           # in one terminal
npm run share-images -- http://localhost:3000
```

## Security model

The public key can insert messages but never read them back, and every layer below assumes the one above it can be bypassed.

- **API route (`app/api/contact/route.ts`).** It rejects requests whose `Origin` doesn't match the host (403), non-JSON bodies (415) and bodies over 12,000 characters (413). Submissions that fill the hidden honeypot field or arrive less than 1.5 s after the dialog opened get a silent success and are never stored. A best-effort in-memory limiter allows 5 submissions per IP per 10 minutes on each server instance. Input is then validated with the shared rules in `lib/contact.ts`.
- **Database (`supabase/migrations/`).** Row Level Security is on. The `anon` role may only `INSERT` the `name`, `email` and `message` columns; it cannot select, update or delete. `id`, `created_at` and `source` are always set by the database. `CHECK` constraints enforce lengths and email shape. A `SECURITY DEFINER` trigger caps inserts at 3 per email address and 100 overall per hour.
- **No secret keys in the app.** The server uses only the publishable key. Messages are read in the Supabase dashboard, or with the service role outside this app.
- **HTTP headers (`next.config.ts`).** A strict CSP (`default-src 'self'`, no frames, no objects), HSTS, frame denial and a locked-down Permissions-Policy. `script-src` allows `'unsafe-inline'` for Next.js bootstrap scripts; the page renders no user-supplied content.

Review `supabase/migrations/` before changing the form fields or table permissions.

## Deployment

The site deploys on [Vercel](https://vercel.com). `vercel.json` pins the Next.js framework preset and runs functions in `bom1` (Mumbai).

1. Import the repository into Vercel.
2. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as environment variables for Production (and Preview if wanted).
3. Push to the production branch. Vercel runs `npm run build`.

`.vercelignore` keeps local env files, `node_modules` and `.next` out of CLI deployments.

## License

The source code is released under the [MIT License](LICENSE).

The portrait, figure and share imagery (`public/figure.webp`, `app/*-image.jpg`, `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`) are © Suraj Dhal and are not covered by the MIT License. Please don't reuse them.

## Maintainer

**Suraj Dhal** · [surajdhal.com](https://surajdhal.com) · [@Suraj-Dhal](https://github.com/Suraj-Dhal)
