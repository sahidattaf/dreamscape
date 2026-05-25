# DreamScape — AI Virtual Staging SaaS

Transform empty rooms into photorealistic staged spaces in minutes using GPT-4o and Replicate. Built for real estate agents who need fast, affordable virtual staging.

**Live demo:** _add your Vercel URL here_

---

## Features

- **AI staging** — ControlNet depth model generates photorealistic furnished rooms from empty photos
- **Design narratives** — GPT-4o writes a custom design story, color palette, and furniture list for every project
- **Before/after slider** — Interactive comparison component for client presentations
- **Stripe payments** — One-time checkout at $150/room, webhook-driven processing
- **Magic link auth** — Passwordless login via Supabase Auth
- **Project dashboard** — Full history with live status polling

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth & DB | Supabase (PostgreSQL + Row Level Security) |
| Storage | Supabase Storage |
| Payments | Stripe Checkout + Webhooks |
| AI — Image | Replicate (ControlNet Depth) |
| AI — Text | OpenAI GPT-4o |
| Deployment | Vercel |

---

## Project Structure

```
dreamscape/
├── app/
│   ├── layout.tsx                  # Root layout + navigation
│   ├── page.tsx                    # Landing page (hero, features, pricing)
│   ├── dashboard/page.tsx          # User project dashboard
│   ├── success/page.tsx            # Post-payment result page
│   ├── auth/callback/route.ts      # Supabase OAuth callback
│   └── api/
│       ├── checkout/route.ts       # Create Stripe checkout session
│       ├── stage/route.ts          # Orchestrate AI staging pipeline
│       ├── webhook/route.ts        # Stripe webhook handler
│       └── projects/route.ts       # Fetch user projects
├── components/
│   ├── UploadForm.tsx              # Photo upload + style picker form
│   ├── Navigation.tsx              # Top nav with auth state
│   ├── PricingCard.tsx             # Pricing tier card
│   ├── ProjectCard.tsx             # Project status card
│   ├── BeforeAfter.tsx             # Interactive slider component
│   └── DesignNarrative.tsx         # AI design story display
├── lib/
│   ├── supabase.ts                 # Supabase client (public + admin)
│   ├── stripe.ts                   # Stripe client + session helpers
│   ├── openai.ts                   # GPT-4o design narrative generator
│   ├── replicate.ts                # Replicate room staging
│   └── utils.ts                    # Shared utilities
├── types/index.ts                  # TypeScript interfaces
├── middleware.ts                   # Route protection
└── supabase/schema.sql             # Database schema + RLS policies
```

---

## API Flow

```
1. User uploads photo → UploadForm saves to Supabase Storage
2. Project record created in DB (status: pending)
3. /api/checkout creates Stripe session, project linked to session ID
4. User pays on Stripe → /api/webhook receives checkout.session.completed
5. Webhook fires background POST to /api/stage
6. /api/stage:
   a. Calls GPT-4o → design narrative + image prompt
   b. Calls Replicate ControlNet → staged image URL
   c. Updates project status to "completed"
7. Success page polls /api/projects until status = completed
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) project
- [Stripe](https://stripe.com) account
- [OpenAI](https://platform.openai.com) API key (GPT-4o access)
- [Replicate](https://replicate.com) API token

### 1. Clone and install

```bash
git clone https://github.com/sahidattaf/dreamscape.git
cd dreamscape
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

OPENAI_API_KEY=sk-...
REPLICATE_API_TOKEN=r8_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Run `supabase/schema.sql` in your Supabase SQL editor
2. Go to **Storage → Buckets** → create a bucket named `photos`, set it to **public**
3. Add an upload policy: authenticated users can upload to their own `user_id/` prefix

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 5. Test Stripe webhooks locally

```bash
# Install Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

Use test card `4242 4242 4242 4242` with any future expiry.

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Or connect via [vercel.com/new](https://vercel.com/new) → import `sahidattaf/dreamscape`.

**Required environment variables in Vercel** — same as `.env.local.example`, plus:

```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**After deploying**, add a Stripe webhook:
- Endpoint: `https://your-project.vercel.app/api/webhook`
- Event: `checkout.session.completed`
- Copy the signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Pricing Tiers

| Tier | Price | Notes |
|---|---|---|
| QuickStage | $150 | Single room, fully automated |
| DreamTour | $400 | Up to 5 rooms, manual fulfillment |
| Resort | $1,200 | Full property, premium consultation |

Only **QuickStage** is automated end-to-end. The other tiers show as "Contact Us" in the UI.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side DB writes |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe dashboard |
| `OPENAI_API_KEY` | OpenAI API key with GPT-4o access |
| `REPLICATE_API_TOKEN` | Replicate API token |
| `NEXT_PUBLIC_APP_URL` | Full URL of your app (no trailing slash) |

---

## License

MIT
