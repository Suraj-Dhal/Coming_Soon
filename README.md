# surajdhal.com — Coming Soon

The temporary landing page for [surajdhal.com](https://surajdhal.com) while the full site is being built. It presents a motion-led hero and a contact form whose messages are stored securely in Supabase.

## Preview

Visit the live landing page at [surajdhal.com](https://surajdhal.com). Share-card images are generated from the actual hero experience and live in `app/opengraph-image.jpg` and `app/twitter-image.jpg`.

## Features

- Responsive grayscale landing page
- Motion-aware hero presentation
- Contact form with validation and bot controls
- Supabase-backed message storage
- Open Graph, Twitter, Apple icon, and share-image support
- Vercel-ready production deployment

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Plain CSS
- Supabase
- Vercel

## Structure

```text
.
├── app/                 # Routes, API handlers, metadata, and page UI
├── components/          # Reusable interface pieces
├── lib/                 # Validation and server-side helpers
├── public/              # Static visual assets
├── scripts/             # Figure and share-image generation tools
├── supabase/migrations/ # Database schema and security policies
└── package.json         # Development and validation scripts
```

## Local development

Requirements: Node.js compatible with the versions in `package.json` and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server runs at `http://localhost:3000`.

## Environment variables

| Variable                   | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `SUPABASE_URL`             | Supabase project URL                       |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key used for permitted inserts |

Use server-side environment files only. Do not commit `.env.local`, service-role keys, or other secrets.

## Validation and production

```bash
npm run typecheck
npm run lint
npm run build
npm run check
npm start
```

To regenerate the pre-blurred figure:

```bash
npm run figure -- path/to/transparent-portrait.png
```

To regenerate share images against a running local production server:

```bash
npm run share-images -- http://localhost:3000
```

## Security model

The contact endpoint validates input, limits request size, rejects unexpected origins, uses a honeypot and minimum fill time, and relies on Supabase Row Level Security for the database boundary. Review `supabase/migrations/` before changing the form or table permissions.

## Contributing

Keep the landing page fast and focused. Run `npm run check` before submitting changes, and never include secrets or real production messages in commits.

## License

No license has been declared yet.
