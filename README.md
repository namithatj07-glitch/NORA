# NORA — AI Daily-Life Assistant for Memory Support

**NORA** is an empathetic, accessible daily-life assistant prototype designed specifically to support people living with Alzheimer's disease, mild cognitive impairment, and memory difficulties with everyday activities, routines, and daily commitments.

The project combines:
1. **An Offline AI Backend** powered by Python, Gemma 3:1B (via Ollama), and local routine management.
2. **A Responsive, Accessible Web Frontend** built with React + Vite, designed with dignified, high-contrast, calm ergonomics and voice narration.

---

## 🌸 Design Philosophy & Accessibility

Memory difficulties can make daily routines, remembering necessary items, and managing commitments challenging. NORA is designed with deep empathy and respect:
- **Soft cream & linen backgrounds** with **muted sage green accents**
- **Dark, high-contrast readable text** (WCAG AAA compliant)
- **Large fonts, generous spacing, and oversized buttons** (minimum 52px tap targets)
- **Zero clutter, zero jarring animations, zero tiny iconography**
- **Accessible speech narration (Text-to-Speech)** using the browser's native speech engine

---

## 🧭 Frontend Screens & Features

### 1. Home Dashboard
- **Personalized Orientation Greeting:** Warm time-of-day greeting for Eleanor Vance with date and location grounding.
- **"What Should I Do Now?" Hero Button:** Prominent, instant help button that answers immediate confusion: tells Eleanor what day and time it is, confirms she is safe at home, highlights her immediate next activity, and offers quick one-tap actions.
- **Up Next Activity Spotlight:** Highlights the next uncompleted task with immediate completion button.
- **Safe Orientation Card:** Reassures Eleanor of her home address, visiting family (Sarah at 2:00 PM), and companion cat Mittens.
- **Quick Access Navigation Tiles:** Direct shortcuts to Routine, Chat, and Contacts.

### 2. Daily Routine
- **Morning, Afternoon, and Evening Sections:** Realistic, respectful daily flow (stretches, tea, garden walk, lunch, nap, family visit, supper, memory photo album).
- **Interactive Completion:** Working buttons to check off activities with immediate positive encouragement toasts (*"Well done, Eleanor! A gentle step completed."*).
- **Daily Progress Bar:** Shows completed count (e.g. 3 of 11) with percentage and encouraging visual indicator.
- **Demo Reset:** One-click button to reset tasks to uncompleted for easy testing and demonstrations.

### 3. Talk to NORA
- **Empathetic Chat Interface:** Large readable message bubbles, distinct patient and assistant styling.
- **Suggested Prompt Chips:** One-click common queries:
  - *"What should I do right now?"*
  - *"Show my routine"*
  - *"Where am I right now?"*
  - *"Who is visiting today?"*
  - *"What day is it today?"*
  - *"I feel a bit confused"*
- **Compassionate Local Demo Engine:** Context-aware responses built on dementia care principles (validation, reassurance, zero distress, gentle redirection).
- **Read Aloud Button:** Browser speech synthesis on every NORA response.
- **Decoupled Architecture:** Chat logic is isolated in `src/services/chatService.js` and `src/services/api.js` for future connection to the Python/Gemma backend.

### 4. Trusted Contacts
- **Dignified Contact Cards:** Fictional family and care network:
  - **Sarah Miller** (Daughter & Primary Caregiver — visiting today at 2:00 PM)
  - **Dr. Peter Chen** (Family Physician — Oakwood Clinic)
  - **Marcus Vance** (Friendly Neighbor across the hall)
  - **Nurse Clara O'Reilly** (Community Wellness Care)
  - **24/7 Memory Support Helpline**
- **Clear Call Actions:**
  - One-tap simulated call dialog with ringing state and reassurance.
  - Direct device dialer link (`tel:`) for mobile/tablet use.
  - Pre-composed quick messages (e.g. *"Thinking of you"*, *"Could you give me a gentle call?"*).

### 5. Settings & Accessibility
- **Text Size Selector:** Standard (18px), Large (22px — default), and Extra Large (26px) with dynamic live reading preview.
- **Contrast Modes:** Soft Cream & Sage (Default), High Contrast (Deep crisp text on bright surface), and Warm Linen (Soft Sepia).
- **Voice Assistance Toggle:** Option to auto-read NORA's answers aloud.
- **Orientation Facts Review:** Review safe address, pet details, and caregiver schedule.
- **Python / Gemma Integration Guide:** Real-time health check test against the configured backend URL.

---

## 🧠 Python Backend & Offline AI

- **Local AI Conversation:** Gemma 3:1B model through Ollama.
- **Locally Stored Routines:** Using JSON (`routines.json`, `nora_memory.json`).
- **Saved-Item Lookup:** Step-by-step guidance for dressing and daily items with pauses.
- **Schedule Management:** Display with times, days, and enabled status.
- **Scheduled Reminders:** Automated reminder checks while the program is running.

### How to Run the Python Backend
1. Install Ollama: [https://ollama.com](https://ollama.com).
2. Download the Gemma model: `ollama run gemma3:1b`.
3. Install the Python Ollama package: `pip install ollama`.
4. Open a terminal in the project folder and run:
   ```bash
   python gemma_test.py
   ```

---

## 💻 How to Run the Web Frontend

### Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## ☁️ Deployment on Vercel

The frontend includes `vercel.json` and is ready for one-click deployment:
1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Deploy!

---

## 🔌 Connecting the Python Backend & Frontend

1. Ensure the Python backend exposes `GET /api/health` and `POST /api/chat`.
2. In the frontend root, create a `.env.local` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_USE_MOCK_CHAT=false
   ```
3. The frontend will automatically detect the live backend, display the green **"Backend Live"** badge, and send all queries to your Gemma model. If the backend is ever offline, NORA automatically falls back to local empathetic responses without crashing.

---

## 🛡️ Safety & Disclaimer

NORA is an assistive technology prototype, not a cure, diagnosis, or clinical treatment for Alzheimer's disease or any dementia-related illness. It is designed to assist and reassure, not to replace family caregivers, medical providers, or healthcare professionals.
