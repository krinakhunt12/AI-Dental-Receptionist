# 10 — API Specification & Endpoints Guide

## 1. Overview
All endpoints are authenticated via Bearer JWT tokens, clinic-scoped from server-side context (`req.clinicId`), Zod-validated, and formatted according to `ApiError`.

## 2. API Endpoints Catalog

### Dashboard & Analytics
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary?from&to` | Aggregates today's appointments, upcoming, new patients, cancellations, no-shows, completed, slot utilization %, pending reminders, failed reminders, open escalations |
| `GET` | `/api/dashboard/appointments-trend?from&to&interval` | Counts by status over time (day or week) |
| `GET` | `/api/dashboard/treatments-breakdown?from&to` | Appointments grouped by treatment procedure |
| `GET` | `/api/dashboard/dentist-utilization?from&to` | Booked vs available slots per dentist |
| `GET` | `/api/dashboard/ai-receptionist?from&to` | Conversations handled, bookings made by AI, escalations, triage urgency counts |

### Appointments & Slots
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/appointments?from&to&dentistId&status&search&page&limit` | Paginated appointments list with search and doctor filtering |
| `POST` | `/api/appointments` | Book new slot (validates working hours & conflict constraint) |
| `PATCH` | `/api/appointments/:id` | Reschedule appointment slot or update status |
| `POST` | `/api/appointments/:id/cancel` | Cancel slot and free dentist availability |
| `GET` | `/api/slots?dentistId&date` | Dynamic slot generation based on roster and existing bookings |

### Patients Directory & Consent
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/patients?search&page&limit` | Search patients by name, phone, or email |
| `GET` | `/api/patients/:id` | Patient details, medical notes, appointment history |
| `PATCH` | `/api/patients/:id/consent` | Update WhatsApp/SMS reminder consent status (`OPTED_IN` / `OPTED_OUT`) |

### Staff Notifications & Escalations
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/notifications/staff?unreadOnly` | Fetch escalation alerts and failed reminder notices (auto-polled every 30s) |
| `PATCH` | `/api/notifications/staff/:id/acknowledge` | Acknowledge alert and dismiss badge |

### Clinical Care Protocols
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/care-protocols?treatmentId&status` | List protocols filtered by procedure and status |
| `GET` | `/api/care-protocols/:id` | Protocol details, instructions, escalation rules |
| `POST` | `/api/care-protocols/:id/approve` | Doctor approval (validates fasting / timing placeholders) |
| `POST` | `/api/care-protocols/:id/instructions` | Add pre-op / post-op instruction step |

### Reminders & Triage Logs
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/reminder-jobs?status&page&limit` | Monitor scheduled WhatsApp/SMS reminders |
| `POST` | `/api/reminder-jobs/:id/retry` | Re-queue a failed reminder job |
| `GET` | `/api/triage/logs?urgency&page&limit` | HIPAA-redacted triage audit logs |
| `POST` | `/api/triage/message` | Patient triage evaluation endpoint |

### Clinic Profile & Team
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/clinic` | Get clinic practice name, emergency phone, timezone, working hours |
| `PATCH` | `/api/clinic` | Update clinic settings and configuration |
| `GET` | `/api/users` | List staff members and role permissions |
