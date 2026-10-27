# 05 — Appointment Scheduling Flow

## 1. Slot Calculation Engine
Available appointment slots are dynamically generated on the server (`GET /slots?dentistId&date`) based on:
1. **Dentist Working Hours**: Defined per dentist (`daysOfWeek`, `startTime`, `endTime`, `slotDuration`).
2. **Existing Appointments**: Filtered by `{ clinicId, dentistId, date, status: { not: 'Cancelled' } }`.
3. **Database Constraints**: Multi-column unique index `[clinicId, dentistId, startsAt]` preventing double-booking race conditions.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient / Staff
    participant UI as Appointment UI
    participant Server as Slot Engine
    participant DB as PostgreSQL

    Patient->>UI: Selects Dentist & Date (2026-10-30)
    UI->>Server: GET /api/slots?dentistId=d1&date=2026-10-30
    Server->>DB: Query WorkingHours & Existing Bookings
    DB-->>Server: Roster: 09:00–17:00; Booked: 11:00, 14:00
    Server-->>UI: Available: [09:00, 10:00, 12:00, 15:00, 16:00]
    UI->>Patient: Displays interactive slot grid
```

## 2. Concurrency & 409 Conflict Handling
- If two users attempt to book the same slot simultaneously:
  1. The first request commits cleanly.
  2. The second request hits the PostgreSQL constraint or application lock and returns `409 Conflict`.
  3. The TanStack Query client catches the 409 error in `useCreateAppointment`, immediately invalidates that dentist's slot cache `queryKeys.slots(clinicId, dentistId, date)`, and alerts the user to select another slot.

## 3. Optimistic Cancellation with Rollback
In `useCancelAppointment`:
- TanStack Query applies an optimistic cache update instantly marking the appointment status as `Cancelled` in both the list and detail cache views.
- If the server request fails (e.g. network disconnection or server error), the error handler rolls the cache back to its pre-cancellation snapshot and restores the slot.
