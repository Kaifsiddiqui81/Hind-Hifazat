# Hind Hifazat - India SOS Network

High-tech emergency response demo built with Next.js App Router, React, Tailwind CSS, Prisma schema contracts, and backend-ready API routes. The Next.js app under `src/app` is the only interactive implementation.

> Demo safety note: this project does not contact real police, ambulance, fire, WhatsApp, SMS, satellite, or banking systems unless you add and verify those provider integrations. For real emergencies in India, call **112**.

## What is implemented

- One-tap SOS dashboard with GPS capture, emergency vibration, trusted-contact routing, crowd responder option, API ticketing, and offline queue fallback.
- Incident reporting flow that submits to `/api/incidents` instead of only generating client-side tickets.
- Cyber Suraksha complaint flow with evidence SHA-256 hashes, server-side manifest hash, chain-of-custody ID, status tracking, and PDF summary.
- Client-encrypted Medical ID vault using Web Crypto AES-GCM before local/backend sync.
- Trusted contacts circle synced with `/api/trusted-contacts`.
- Safety tools: Walk Me Home, fake call, stealth screen, shake SOS, accessibility mode, and scoped duress PIN input.
- Live dispatch map fed by `/api/dispatch/feed`; Socket.io dependencies are ready for a production transport.
- Admin analytics endpoint at `/api/admin/analytics`.
- PWA service worker caches app routes and exposes offline emergency numbers.

## Production integrations still required

- **Admin Auth & RBAC (Placeholder)**: The current admin dashboard login and token verification (`/api/admin/session`) is a placeholder using a hardcoded `ADMIN_TOKEN`. Production deployment strictly requires replacing this with proper JWT-based Role-Based Access Control (RBAC).
- Real authentication, phone OTP delivery, and audit review.
- SMS/WhatsApp/call providers such as Twilio, Gupshup, Exotel, or equivalent approved gateways.
- Push notifications through Web Push/FCM/APNs.
- Real responder mobile apps or control-room dashboard connected through Socket.io or another streaming transport.
- Database persistence via Prisma migrations against PostgreSQL or another production database. Update `DATABASE_URL` in `.env` to point to it.
- Legal/privacy review for DPDP Act compliance, medical data sharing, evidence custody, and false-report handling.
- Satellite fallback requires supported hardware/provider APIs; the demo only queues an offline rescue packet.

> **Note on Legacy Files**: The `js/` and `css/` directories contain code for an older standalone mock of `index.html`. The active Next.js app does not use them, and they are kept purely as legacy reference. You may delete them.

## Setup

```bash
npm install
cp .env.example .env
# Replace JWT_SECRET and ADMIN_TOKEN with generated 32+ byte random values.
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Useful routes

- `/` - command dashboard
- `/report` - incident reporting
- `/cyber-suraksha` - cyber complaint workflow
- `/medical-id` - encrypted medical vault
- `/api/incidents/sos` - SOS dispatch ticket
- `/api/dispatch/feed` - responder feed
- `/api/admin/analytics` - dashboard analytics

## Static handoff file

`index.html` is intentionally small. It reflects the console design tokens, Barlow display type, and radar sweep treatment, then redirects to `/` when served behind the Next.js app. The old standalone mock was retired so fake login, plaintext medical localStorage, plaintext duress PIN reads, and simulated satellite-success banners are not shipped in the static handoff.

The PWA manifest starts at `/`, uses `consoleSignal` (`#E8362A`), and references maskable SVG icons under `public/icons`.
