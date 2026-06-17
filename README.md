# Quietly — private property interest MVP 

A Next.js app for registering private interest in a property, street or area.
Buyers pay via Stripe, submissions are stored in Supabase, and the team
verifies details and sends a letter manually. Each letter includes a unique,
private response link/QR code for the owner.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (Postgres + Storage) — via the service role key, server-side only
- **Stripe Checkout** for payment
- **Leaflet** (OpenStreetMap, no API key) for the Find & Send map pin
- Custom password-protected admin pages within the same app

## 1. Supabase setup

1. Create a new Supabase project.
2. In the SQL editor, run `supabase/schema.sql` from this repo. This creates
   the `submissions` and `owner_responses` tables, enables RLS with no public
   policies (the app only ever uses the service role key, which bypasses
   RLS).
3. (Optional, for Find & Send photo uploads) In Storage, create a bucket
   called `property-photos`. Make it **public** if you'd like the photo URLs
   in the admin panel to load directly, or configure signed URLs if you'd
   rather keep it private. If this bucket doesn't exist, photo uploads are
   simply skipped — photos are optional.
4. Copy your **Project URL** and **service_role key** from
   Project Settings → API into `.env.local` (see below).

## 2. Stripe setup

1. Create a Stripe account (test mode is fine to start).
2. Copy your secret key into `STRIPE_SECRET_KEY`.
3. Create a webhook endpoint pointing at `https://your-domain.com/api/stripe/webhook`,
   subscribed to the `checkout.session.completed` event. Copy the signing
   secret into `STRIPE_WEBHOOK_SECRET`.
4. For local development, use the Stripe CLI:
   ```
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
SITE_URL=
```

- `ADMIN_PASSWORD` — the password used to sign in at `/admin/login`.
- `ADMIN_SESSION_SECRET` — any long random string, used to sign the admin
  session cookie. Generate one with e.g. `openssl rand -hex 32`.
- `SITE_URL` — your deployed URL (e.g. `https://quietly.example.com`), used
  to build the absolute owner-response link shown/QR-coded in the admin
  panel.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## How it works

### Buyer flow

1. `/submit` — buyer picks one of three routes (Specific Property, Find &
   Send, Street Search), fills in a dynamic form, and is redirected to Stripe
   Checkout.
2. On successful payment, the Stripe webhook (`/api/stripe/webhook`) marks
   the submission as paid and sets its internal status to the appropriate
   "verification required" state for that product.
3. `/submit/success` shows a confirmation screen.

### Admin flow

1. `/admin/login` — sign in with `ADMIN_PASSWORD`.
2. `/admin` — list of all submissions with status and payment info.
3. `/admin/[id]` — full submission detail. Admins can:
   - record the identified owner's name, address and postcode (the postcode
     doubles as one of the two factors an owner can use to verify themselves
     on the response page),
   - update the internal status as the case progresses,
   - record the date a letter was sent,
   - view the unique owner response link and its QR code,
   - view any owner response once received.

### Owner response flow

Each submission gets a unique `response_code` used in `/respond/[code]`. To
respond, the owner must first verify themselves with either:

- the property's postcode (as recorded by admin), or
- the 6-digit verification code printed in the letter
  (`response_verification_code`).

Once verified, they can choose from six response options (interested, open
to a higher price, maybe in future, not interested, do not contact again, or
"this isn't my property"). Responses are stored in `owner_responses`, and the
submission's `status` / `owner_response_status` are updated accordingly. A
"do not contact again" response sets `opt_out = true`, which permanently
blocks that link from being used again.

## Not yet built (deliberately deferred)

- PDF letter generation — letter content is fully captured in the database
  (buyer message, owner details, response code/QR, verification code), ready
  for a templating step to be added later.
- Automated emails to buyers as their case progresses (the brief assumes
  manual updates for the MVP).
- Multi-property handling for Street Search beyond storing the search
  criteria and approach count — each individual owner letter/response is
  expected to be created manually by admin for now, reusing the same
  `submissions`/`owner_responses` structure (one row per owner approached).
