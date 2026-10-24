# surajdhal.com — Coming Soon

Temporary landing page for surajdhal.com while the full site is built. One page:
a grayscale, motion-blurred hero with a **Coming Soon** button that opens a
contact form. Messages are stored in Supabase.

## Stack

- Next.js 16 (App Router) + TypeScript, plain CSS, no UI libraries
- Supabase (`public.coming_soon_messages`) for storage
- Hosted on Vercel

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run check                # typecheck + lint + production build
```

## Environment variables

| Name | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key. RLS limits it to inserting messages. |

All variables are read on the server only; nothing is exposed to the browser.

## How the contact form is protected

1. The browser posts JSON to `/api/contact`; the handler rejects cross-origin
   requests, non-JSON bodies and bodies over 12 KB.
2. A hidden honeypot field and a minimum fill time quietly drop bots.
3. Input is validated with the same rules as the form (`lib/contact.ts`), and a
   best-effort per-IP limiter runs before the database.
4. The database is the hard boundary (see `supabase/migrations/`): RLS is on,
   the anon role may only insert `name`, `email` and `message`, it cannot read,
   update or delete, and a trigger allows at most 3 messages per email and 100
   overall per hour.

## Reading messages

Supabase dashboard → Table Editor → `coming_soon_messages`, or SQL:

```sql
select created_at, name, email, message
from public.coming_soon_messages
order by created_at desc;
```

## Link previews

`app/opengraph-image.jpg` and `app/twitter-image.jpg` (1200×630) are a real
screenshot of the hero, so shared links on WhatsApp, LinkedIn, X, Slack and
iMessage show the page itself. Alt text lives in the matching `.alt.txt` files.
`app/apple-icon.png` is rendered from `app/icon.svg`. After changing the design:

```bash
npm run build && npm start            # in one terminal
npm run share-images -- http://localhost:3000
```

The script drives the locally installed Google Chrome via `playwright-core`.

## Regenerating the hero figure

`public/figure.webp` is pre-blurred so the browser only animates transforms.
To rebuild it from a transparent portrait:

```bash
npm run figure -- path/to/transparent-portrait.png
```
