# 🦷 SmileCare AI Dental Receptionist

A full-stack, intelligent receptionist application for dental practices. Built with **React 19, Vite, Tailwind CSS v4** on the frontend and **Node.js, Fastify, TypeScript** on the backend.

Includes **RAG (Retrieval-Augmented Generation)** over clinic documents, real-time appointment booking, emergency detection, dentist schedules, service price catalogs, and a zero-cost **Free AI Engine**!

---

## ⚡ Quick Start

```bash
# 1. Install dependencies for root, server, and client
npm run setup

# 2. Start development servers (frontend :5173, backend :3001)
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

> 📄 **Complete Guide**: For detailed step-by-step instructions, API documentation, and feature list, see [RUN_GUIDE.md](file:///c:/Users/paran/Downloads/Krina/dental-receptionist/dental-receptionist/RUN_GUIDE.md).

---

## 🚀 Key Application Features

- **📊 Dashboard**: KPI summary cards for Today's Appointments (18), New Patients (7), AI Conversations (42), and Human Transfers (4).
- **💬 Patient AI Chat**: Interactive receptionist with tool execution tracking (`⚡ list_services`, `⚡ check_availability`), RAG knowledge context drawer, and emergency pre-check.
- **📅 Appointments**: Schedule agenda with status filters (`Booked`, `Completed`, `Cancelled`, `No-show`) and dentist assignment.
- **👨‍⚕️ Dentists**: Roster for Dr. Patel (General Dentistry) and Dr. Shah (Orthodontics) with operating hours.
- **🦷 Services & Prices**: Standard treatment fee catalog in ₹ (INR) and duration times.
- **📚 Knowledge Base**: Drag & drop PDF/MD/TXT document uploader with vector search test sandbox.
- **📈 Analytics**: Topic request intent distribution chart (Appointments 48%, Pricing 19%, Services 14%, Hours 9%, Other 10%).

---

## 🛠️ Tech Stack & Scripts

- **Frontend**: React 19, Vite, Tailwind CSS v4, TypeScript
- **Backend**: Fastify, Node.js, Transformers.js (On-device embeddings), unpdf
- **AI Engine**: Built-in Free Local AI Agent, OpenRouter, Google Gemini, Anthropic Claude

| Command | Description |
|---|---|
| `npm run setup` | Installs dependencies across root, server, and client |
| `npm run dev` | Starts server (`:3001`) and client (`:5173`) concurrently |
| `npm run typecheck` | Runs TypeScript verification |
| `npm run build` | Builds client for production |

---

## 📄 Documentation Links

- 📖 **[RUN_GUIDE.md](file:///c:/Users/paran/Downloads/Krina/dental-receptionist/dental-receptionist/RUN_GUIDE.md)** — Complete step-by-step developer guide.
- 📋 **[one.md](file:///c:/Users/paran/Downloads/Krina/dental-receptionist/dental-receptionist/one.md)** — Project plan & blueprint specification.
