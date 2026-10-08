# 🦷 SmileCare AI Dental Receptionist — Complete Setup & Developer Guide

Welcome to **SmileCare AI Dental Receptionist**, a full-stack AI-powered receptionist system built for dental practices using **React 19, Vite, Tailwind CSS v4, Fastify, TypeScript, and Retrieval-Augmented Generation (RAG)**.

---

## 📌 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Quick Start Guide](#-quick-start-guide)
3. [Environment Configuration (Free AI Setup)](#-environment-configuration-free-ai-setup)
4. [Project Features & Architecture](#-project-features--architecture)
5. [API Reference](#-api-reference)
6. [Available Scripts](#-available-scripts)
7. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

Verify your installation:
```bash
node -v
npm -v
```

---

## 🚀 Quick Start Guide

### Step 1: Open Terminal in Project Directory
Open your terminal (PowerShell, Command Prompt, or VS Code / IDE terminal) in the project root:
```bash
cd c:\Users\paran\Downloads\Krina\dental-receptionist\dental-receptionist
```

### Step 2: One-Time Setup (Installs All Dependencies)
Run the setup command to automatically install dependencies for the root, backend server (`server`), and frontend client (`client`):
```bash
npm run setup
```

### Step 3: Launch Development Servers
Start both backend API server (`:3001`) and frontend client (`:5173`) concurrently:
```bash
npm run dev
```

### Step 4: Open Application in Browser
Navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Environment Configuration (Free AI Setup)

The project includes pre-configured environment settings in `server/.env`. By default, it uses the **Free AI Engine**, requiring **zero API keys** or subscriptions:

```env
# LLM Provider Options: 'free_agent' (Free local engine), 'openrouter', 'gemini', 'anthropic'
LLM_PROVIDER=free_agent

# API Keys (leave blank when using free_agent)
OPENROUTER_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=

# Retrieval Settings
EMBEDDING_PROVIDER=local
EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2

# Clinic Settings
CLINIC_NAME=SmileCare Dental Clinic
CLINIC_TZ=Asia/Kolkata
PORT=3001
```

> 💡 **Optional Cloud AI**: If you wish to connect a free OpenRouter model (e.g. `google/gemini-2.0-flash-lite-preview:free`), set `LLM_PROVIDER=openrouter` and add your key in `server/.env`.

---

## 🏛️ Project Features & Architecture

```
                                  +-----------------------------+
                                  |     Patient Web Chat        |
                                  +-----------------------------+
                                                 |
                                                 v
                                  +-----------------------------+
                                  |   Emergency Pre-Check       |
                                  +-----------------------------+
                                     /                       \
                       Emergency matched                   Normal Inquiry
                                  /                             \
                                 v                               v
                  +-----------------------------+   +-----------------------------+
                  |  Urgent Care Escalation Msg |   |    Free AI Agent Engine     |
                  +-----------------------------+   +-----------------------------+
                                                       /       |       \
                                                      v        v        v
                                                  +-------+ +-------+ +-------+
                                                  |  RAG  | |Service| | Slots |
                                                  | Store | |Catalog| |Booking|
                                                  +-------+ +-------+ +-------+
```

### Main Application Views
1. **📊 Executive Dashboard**: Operational overview showing Today's Appointments (18), New Patients (7), AI Conversations (42), and Human Transfers (4).
2. **💬 Patient AI Chat**: Interactive receptionist assistant with tool badges (`⚡ list_services`, `⚡ check_availability`), emergency detector, and live RAG source drawer.
3. **📅 Appointments Manager**: Agenda schedule view with status filters (`Booked`, `Completed`, `Cancelled`, `No-show`) and dentist assignment.
4. **👨‍⚕️ Dentist Directory**: Roster for Dr. Patel (General Dentistry) and Dr. Shah (Orthodontics) with operating shift hours and available days.
5. **🦷 Service Catalog**: Price list in ₹ (INR), procedure duration in minutes, and price notes.
6. **📚 Knowledge Base & RAG**: Upload `.pdf`, `.md`, or `.txt` clinic files, chunk text, and test vector retrieval queries.
7. **📈 Analytics**: Topic intent distribution chart (Appointments 48%, Pricing 19%, Services 14%, Hours 9%, Other 10%).

---

## 📡 REST API Reference

| Method | Endpoint Path | Description |
|---|---|---|
| `GET` | `/api/health` | System status, clinic info, active AI provider |
| `GET` | `/api/stats` | Analytics summary & counts |
| `POST` | `/api/chat` | Send patient message to AI receptionist |
| `GET` | `/api/knowledge` | List uploaded knowledge documents |
| `POST` | `/api/knowledge` | Upload new document (`.pdf`, `.md`, `.txt`) |
| `DELETE` | `/api/knowledge/:id` | Remove document from vector store |
| `GET` | `/api/knowledge/search?q=` | Vector semantic search test |
| `GET` | `/api/appointments` | List all booked appointments |
| `POST` | `/api/appointments` | Book new appointment |
| `PATCH` | `/api/appointments/:id` | Update appointment status |
| `DELETE` | `/api/appointments/:id` | Remove appointment |
| `GET` | `/api/services` | List clinic services & prices |
| `GET` | `/api/dentists` | List dentists & working hours |

---

## 🛠️ Available Scripts

Run from the root directory:

| Script | Command | Purpose |
|---|---|---|
| `npm run setup` | `npm install && npm install --prefix server && npm install --prefix client` | Install all dependencies |
| `npm run dev` | `concurrently "npm run dev --prefix server" "npm run dev --prefix client"` | Launch dev servers |
| `npm run build` | `npm run build --prefix client` | Build frontend for production |
| `npm run typecheck` | `npm run typecheck --prefix server && npm run typecheck --prefix client` | Run TypeScript verification |

---

## 📄 License & Notes

MIT License. Designed for **SmileCare Dental Clinic**. Free for personal and commercial customisation.
