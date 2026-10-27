# 07 — Reminders, Campaigns & Quiet Hours Flow

## 1. Automated Dispatch Engine
When an appointment is confirmed, the scheduler computes scheduled send times for every instruction step in the active approved care protocol for that treatment.

```mermaid
sequenceDiagram
    autonumber
    participant Appt as Appointment Service
    participant Jobs as Reminder Job Queue
    participant Cron as Dispatch Worker
    participant Consent as Consent & TCPA Checker
    participant Gateway as WhatsApp / SMS Provider

    Appt->>Jobs: Generate Reminder Jobs (sendAt = startsAt + offsetMinutes)
    loop Every 60 Seconds
        Cron->>Jobs: Find PENDING jobs where sendAt <= NOW()
        Jobs-->>Cron: Batch of due jobs
        Cron->>Consent: Verify patient consent (OPTED_IN) & Quiet Hours
        alt Quiet Hours (21:00 - 08:00)
            Cron->>Jobs: Postpone sendAt to 08:00 AM next day
        else Patient Opted Out
            Cron->>Jobs: Mark SKIPPED (Patient opted out)
        else Valid
            Cron->>Gateway: Send Message via API
            Gateway-->>Cron: 200 OK (providerMessageId)
            Cron->>Jobs: Mark SENT
        end
    end
```

## 2. Quiet Hours (TCPA Compliance)
- To prevent patient harassment and comply with telecommunication regulations, automated promotional campaigns and non-emergency reminder messages are paused during **Quiet Hours (21:00 – 08:00 in clinic timezone)**.
- If a message falls into quiet hours, its `sendAt` timestamp is shifted automatically to 08:00 AM the following morning.

## 3. Failed Reminders & Manual Retry
- If an SMS/WhatsApp gateway times out or returns an error, the job status moves to `FAILED` with `lastError` recorded.
- In both the **Appointment Drawer** and the **Reminders Overview Page** (`/app/reminders`), staff can view failure reasons and click **Retry Job** to re-queue the job with zero friction.
