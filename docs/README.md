# 📚 SmileCare AI — System & Architecture Documentation Index

Welcome to the centralized documentation directory for **SmileCare AI Dental SaaS**. This directory houses in-depth, flow-wise architectural and operational manuals detailing each subsystem of the platform.

---

## 🗂️ Flow-Wise Documentation Sitemap

| Document | Topic | Key Flows Covered |
|---|---|---|
| [01. Architecture Overview](./01_ARCHITECTURE_OVERVIEW.md) | High-Level Architecture | Multi-tenant isolation, Prisma DB schema, server & client topology |
| [02. Authentication & RBAC](./02_AUTHENTICATION_AND_RBAC_FLOW.md) | Identity & Access Control | JWT lifecycle, server-enforced `clinicId`, role permissions matrix |
| [03. AI Receptionist & RAG](./03_AI_RECEPTIONIST_AND_RAG_FLOW.md) | Conversational AI Engine | Vector embedding retrieval, tool executions, fallback handlers |
| [04. Emergency Triage & Escalations](./04_EMERGENCY_TRIAGE_AND_ESCALATION_FLOW.md) | Clinical Safety Triggers | Redacted audit logs, symptom matching, staff alert notifications |
| [05. Appointment Scheduling](./05_APPOINTMENT_SCHEDULING_FLOW.md) | Slot Engine & Booking | Working hours, conflict constraint handling, optimistic cancel |
| [06. Pre & Post-Op Care Protocols](./06_PRE_POST_OP_CARE_PROTOCOLS_FLOW.md) | Clinical Protocol Lifecycle | Immutable versions (vN to vN+1), doctor approval, fasting validations |
| [07. Reminders & Dispatch Scheduler](./07_REMINDERS_CAMPAIGNS_AND_QUIET_HOURS_FLOW.md) | Notifications & TCPA | Automated WhatsApp/SMS queues, quiet-hours delays, failed job retries |
| [08. Multi-Tenancy & Billing](./08_MULTI_TENANCY_SUBSCRIPTION_AND_BILLING_FLOW.md) | SaaS Tenancy & Plans | Tenant isolation guarantees, subscription quotas, feature gating |
| [09. Frontend UI & Component Guide](./09_FRONTEND_UI_AND_COMPONENT_GUIDE.md) | UI System & Query Layer | TanStack Query clinic-scoping, responsive layouts, design tokens |
| [10. API Specification & Endpoints](./10_API_SPECIFICATION_AND_WEBSOCKET_FLOW.md) | Backend REST Contract | All clinic-scoped endpoints, Zod schemas, standard ApiError format |

---

## 🚀 Quick Run Commands

```bash
# Install all dependencies across client and server
npm run setup

# Launch dev servers concurrently (Client :5173, Server :3001)
npm run dev

# Run client production build
cd client && npm run build

# Run server type check
cd server && npx tsc --noEmit
```
