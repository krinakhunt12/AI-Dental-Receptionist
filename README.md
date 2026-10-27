# 🦷 SmileCare AI Dental Receptionist & Practice SaaS

A production-grade, multi-tenant dental practice SaaS built with **React 19, TypeScript, and Tailwind CSS v4** on the frontend and **Node.js, Express, Prisma ORM, and PostgreSQL** on the backend.

Includes **RAG (Retrieval-Augmented Generation)** over clinic documents, live appointment scheduling with slot-conflict constraints, clinical emergency triage, pre/post-operative care protocols, and automated WhatsApp/SMS dispatch.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies for root, server, and client
npm run setup

# 2. Start development servers (frontend :5173, backend :3001)
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

- **Client Port**: `http://localhost:5173`
- **Server API**: `http://localhost:3001`

---

## 🗂️ Flow-Wise Documentation Suite (`docs/`)

All system flows and architectural manuals are organized in the [`docs/`](./docs) directory:

| Document | Description |
|---|---|
| 📖 [Documentation Index](./docs/README.md) | Central documentation map & sitemap |
| 🏗️ [01. Architecture Overview](./docs/01_ARCHITECTURE_OVERVIEW.md) | Multi-tenant isolation model, database schema, tech stack |
| 🔐 [02. Authentication & RBAC](./docs/02_AUTHENTICATION_AND_RBAC_FLOW.md) | JWT token lifecycle, server-enforced `clinicId`, role permissions |
| 🤖 [03. AI Receptionist & RAG](./docs/03_AI_RECEPTIONIST_AND_RAG_FLOW.md) | Conversational triage intake, RAG vector retrieval, tool calls |
| 🚨 [04. Emergency Triage & Escalations](./docs/04_EMERGENCY_TRIAGE_AND_ESCALATION_FLOW.md) | Symptom detection, HIPAA-redacted audit logs, staff alerts |
| 📅 [05. Appointment Scheduling](./docs/05_APPOINTMENT_SCHEDULING_FLOW.md) | Dynamic slot generation, 409 conflict handling, optimistic cancel |
| 📋 [06. Pre & Post-Op Care Protocols](./docs/06_PRE_POST_OP_CARE_PROTOCOLS_FLOW.md) | Protocol versioning (vN to vN+1), doctor approval, fasting rules |
| 🔔 [07. Reminders & Dispatch Scheduler](./docs/07_REMINDERS_CAMPAIGNS_AND_QUIET_HOURS_FLOW.md) | WhatsApp/SMS queues, quiet-hours shifts, failed job retries |
| 🏢 [08. Multi-Tenancy & Billing](./docs/08_MULTI_TENANCY_SUBSCRIPTION_AND_BILLING_FLOW.md) | Tenant scoping, plan limits, usage meters, feature flags |
| 🎨 [09. Frontend UI & Component Guide](./docs/09_FRONTEND_UI_AND_COMPONENT_GUIDE.md) | Fixed layout frame, uniform card heights, TanStack Query caching |
| 🔌 [10. API Specification & Endpoints](./docs/10_API_SPECIFICATION_AND_WEBSOCKET_FLOW.md) | Complete REST API endpoint reference and error formats |

Additionally, see **[HYDRATION_SUMMARY.md](./HYDRATION_SUMMARY.md)** for a deep dive into React hydration, client storage resilience, and the real backend migration.

---

## 🚀 Key Application Modules

1. **📊 Live Clinic Dashboard (`/app`)**:
   - Live KPI cards: Today's appointments, slot utilization %, open escalations, pending reminders.
   - Date range selector: `Today`, `Last 7 Days`, `30 Days` (linked to TanStack Query keys).
   - Real Recharts status trends and procedure breakdown.
   - 60s auto-refresh paused when the browser tab is hidden.
2. **🔔 Staff Alerts & Escalation Center**:
   - Header notification bell with live emergency alert badge count.
   - Visual priority for `EMERGENCY` alerts with one-click **Acknowledge** action.
   - Auto-refreshes every 30s.
3. **📋 Clinical Care Protocols (`/app/care-protocols`)**:
   - Filter by treatment and status (`Draft`, `Approved`, `Archived`).
   - Immutable version policy: editing creates vN+1 while vN remains active.
   - Doctor approval action visible to `DOCTOR`, `DENTIST`, and `CLINIC_OWNER`.
   - Blocks approval if unresolved fasting or clinical placeholders remain.
4. **🔔 Patient Care Reminders (`/app/reminders`)**:
   - Status chips: `All`, `Failed`, `Skipped`, `Pending`, `Sent`.
   - Direct **Retry Job** button for failed WhatsApp/SMS deliveries.
   - Appointment detail drawer with live reminders tab.
5. **🛡️ AI Triage Audit Logs (`/app/triage-logs`)**:
   - Filter by urgency level (`EMERGENCY`, `URGENT`, `ROUTINE`, `NONE`).
   - HIPAA-compliant automatic redaction of patient names, phone numbers, and PHI.
6. **👥 Patients Directory (`/app/patients`)**:
   - 300ms debounced search persisted in URL query parameters.
   - Patient communication consent toggles (WhatsApp & SMS) on patient profile drawer.
7. **⚙️ Clinic Practice Profile (`/app/settings`)**:
   - Live configuration of practice name, primary phone, after-hours emergency hotline, and timezone.
   - Real `GET` and `PATCH /api/clinic` integration.

---

## 🛠️ Verification & Build Commands

```bash
# Verify client build (production Vite bundle)
cd client && npm run build

# Verify server type check
cd server && npx tsc --noEmit
```
Both exit with **code 0** with zero compilation errors.
