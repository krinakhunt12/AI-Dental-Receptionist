# SmileCare Dental Clinic — marketing site

Standalone patient-facing website for SmileCare Dental Clinic. It lives outside the
existing `client/` (clinic SaaS) and `server/` apps and is built with
**React 19 + Vite + TypeScript + Tailwind v4**.

## Run it

```bash
npm install --prefix marketing
npm run dev:marketing        # http://localhost:5174
```

Production build & preview:

```bash
npm run build:marketing      # type-check + bundle into marketing/dist
npm run preview --prefix marketing
```

## Data layer

`src/api/client.ts` is **mock-first and swappable**:

```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
```

- `VITE_API_BASE_URL` empty (default) → requests are served by the local mock layer
  (small artificial latency, deterministic slot generation, seeded testimonials).
- `VITE_API_BASE_URL` set → the same functions call the real REST endpoints.

Copy `.env.example` to `.env` to switch modes. The mock layer is the only place that
knows about latency/faker, so swapping to a real backend does not touch any component.

## Structure

```
src/
  api/          client.ts (mock + real fetch), types.ts, chat.ts (mock AI responder)
  components/   ui/ (Button, Card, Modal, Drawer, Accordion, Stepper, Skeleton, ...)
                home/  services/  booking/  chat/  layout/
  data/         clinic.ts, services.ts, dentists.ts, content.ts
  hooks/        useChat.ts, (query hooks live next to their consumers)
  lib/          ical.ts (calendar export), utils.ts (cn helper)
  pages/        Home, Services, Dentists, Book, Contact, Chat, NotFound
  router.tsx    lazy-loaded routes
  styles.css    Tailwind v4 theme tokens (@theme) + global base styles
```

## Design tokens

Defined in `src/styles.css` under Tailwind v4's `@theme`:

| Token | Value | Use |
| --- | --- | --- |
| `brand-600` | `#0D9488` | primary teal — CTAs, links, accents |
| `ink-900` | `#0F172A` | headings / dark surfaces |
| `mint-50` | `#ECFDF5` | soft section backgrounds |
| `accent-500` | `#F59E0B` | badges, highlights, ratings |

Fonts: Plus Jakarta Sans (headings) + Inter (body), loaded from Google Fonts.

## Features

- **Home** — hero with AI chat mock, trust row, AI features, services preview,
  how-it-works, dentists, stats, testimonials carousel, FAQ, CTA.
- **Services** — category filters, detail drawer (what to expect / before your visit),
  one-tap booking prefill.
- **Dentists** — profile cards with specialisations and availability.
- **Book** — 5-step wizard (service → dentist → date & time → details → review) with a
  sticky summary sidebar, slot picker, validation, confirmation screen and `.ics`
  calendar download.
- **Contact** — form, opening hours, map placeholder, emergency guidance card.
- **AI receptionist** — `/chat` page plus a floating widget on every page, with typed
  replies, quick-reply chips, rich slot/dentist/appointment cards, emergency triage and
  human-handoff states, plus a voice-mode panel (waveform placeholder).
- **Quality** — reusable primitives, skeleton loaders, empty states, 404 page, responsive
  down to 360px, focus-visible rings, `prefers-reduced-motion` support, SEO meta/OG tags.

## Notes

- lucide-react v1 removed brand glyphs; inline brand SVGs live in
  `src/components/ui/SocialIcons.tsx`.
- TypeScript 7 dropped `baseUrl`; all imports in this app are relative.
- `react-router-dom` v7 — `useLocation`, `useNavigate`, `Link` are used directly.
