# 03 — AI Receptionist & RAG Flow

## 1. Overview
The AI Receptionist functions as an autonomous conversational front desk that answers patient inquiries 24/7 across website chat, WhatsApp, and phone intake.

```mermaid
sequenceDiagram
    autonumber
    actor Patient as Patient
    participant Widget as AI Receptionist
    participant RAG as Vector RAG Engine
    participant LLM as AI Language Model
    participant Clinic as Staff Notifications

    Patient->>Widget: "How much does a root canal cost and do you have slots this Friday?"
    Widget->>RAG: Similarity Search(Treatment Catalog & Fee Guide)
    RAG-->>Widget: Matched context chunks & fee policies
    Widget->>LLM: Prompt + Chunks + Tool Definitions
    LLM->>Widget: Call Tool: check_slots(dentistId, "2026-10-30")
    Widget-->>LLM: Available slots: 10:00 AM, 2:30 PM
    LLM-->>Widget: Grounded response with pricing & available slots
    Widget->>Patient: Friendly clinic response
```

## 2. Key AI Capabilities
- **Grounded Information Retrieval**: All fees, pre-op restrictions, and doctor schedules are grounded strictly in clinic documents stored in `KnowledgeBase`.
- **Hallucination Prevention**: If a policy or treatment is missing from the clinic's database, the model politely offers a staff callback instead of inventing numbers.
- **Tool Execution**: Tools include `list_services`, `check_availability`, `book_appointment`, and `escalate_to_staff`.
