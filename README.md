# NORA — AI Daily-Life Assistant for Memory Support

**NORA** is an empathetic, accessible web companion designed specifically for people living with Alzheimer's disease, mild cognitive impairment, and memory difficulties.

Built with a dignified, reassuring design philosophy:
- **Soft cream & linen backgrounds** with **muted sage green accents**
- **Dark, high-contrast readable text**
- **Large fonts, generous spacing, and oversized buttons** (minimum 52px tap targets)
- **Zero clutter, zero jarring animations, zero tiny iconography**
- **Accessible speech narration (Text-to-Speech)** using the browser's native speech engine

---

## 🧭 Live Screens & Functionality

### 1. Home Dashboard
- **Personalized Orientation Greeting:** Warm time-of-day greeting for Eleanor Vance with date and location grounding.
- **"What Should I Do Now?" Hero Button:** Prominent, instant help button that answers immediate confusion: tells Eleanor what day and time it is, confirms she is safe at home, highlights her immediate next activity, and offers quick one-tap actions.
- **Up Next Activity Spotlight:** Highlights the next uncompleted task with immediate completion button.
- **Safe Orientation Card:** Reassures Eleanor of her home address, visiting family (Sarah at 2:00 PM), and companion cat Mittens.
- **Quick Access Navigation Tiles:** Direct shortcuts to Routine, Chat, and Contacts.

### 2. Daily Routine
- **Morning, Afternoon, and Evening Sections:** Realistic, respectful daily flow (stretches, tea, garden walk, lunch, nap, family visit, supper, memory photo album).
- **Interactive Completion:** Working buttons to check off activities with immediate positive encouragement toasts ("Well done, Eleanor! A gentle step completed.").
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

## 📁 Project Structure

```
d:\xnora\
├── index.html                   # Entry HTML with accessible Google Fonts preconnect
├── package.json                 # Dependencies (React 18, Vite, Lucide-react)
├── vite.config.js               # Vite configuration
├── vercel.json                  # Vercel SPA deployment configuration
├── .env.example                 # Environment variables reference
├── src\
│   ├── main.jsx                 # React root render
│   ├── App.jsx                  # Main application structure, tabs & modals
│   ├── App.css                  # Component layout, buttons, cards & chat styling
│   ├── index.css                # Accessible design tokens, themes & text-sizes
│   ├── context\
│   │   ├── AccessibilityContext.jsx  # Text size, contrast theme, voice narration
│   │   └── RoutineContext.jsx        # Daily activities state, persistence, progress
│   ├── data\
│   │   ├── userProfile.js            # Fictional profile and orientation facts
│   │   ├── routineData.js            # Morning, afternoon, evening activities
│   │   ├── contactsData.js           # Trusted family & doctor contacts
│   │   └── mockChatResponses.js      # Dementia care dialogue engine & prompt chips
│   ├── services\
│   │   ├── api.js                    # API client with health check & backend integration
│   │   ├── chatService.js            # Bridge between Python backend and local mock
│   │   └── speechService.js          # Browser SpeechSynthesis helper
│   └── components\
│       ├── common\
│       │   ├── Header.jsx            # Live clock, voice toggle, emergency prompt
│       │   ├── Navigation.jsx        # Accessible tab buttons with status badges
│       │   ├── NoticeBanner.jsx      # Transparent demo status and backend checker
│       │   ├── WhatShouldIDoModal.jsx# Reassuring "What do I do now?" modal
│       │   └── CallContactModal.jsx  # Simulated call and quick note modal
│       ├── home\
│       │   └── HomeDashboard.jsx     # Greeting, hero CTA, up next & quick tiles
│       ├── routine\
│       │   ├── DailyRoutine.jsx      # Timeline with filter tabs and progress bar
│       │   └── ActivityCard.jsx      # Large tap checkbox, time, location & audio
│       ├── chat\
│       │   ├── TalkToNora.jsx        # Chat window, prompt chips, typing feedback
│       │   └── ChatMessage.jsx       # Message bubble with audio read-aloud
│       ├── contacts\
│       │   └── TrustedContacts.jsx   # Contact cards and caregiver spotlight
│       └── settings\
│           └── Settings.jsx          # Text size, contrast, voice, and backend guide
```

---

## 🚀 Running the Project Locally

### Prerequisites
Node.js (v18+) and npm. Portable Node.js is already set up in `D:\xnora\nodejs`.

### Development Server
```powershell
# From the project root (D:\xnora):
npm run dev
```
Open your browser to `http://localhost:3000`.

### Production Build & Preview
```powershell
npm run build
npm run preview
```

---

## ☁️ Deployment to Vercel

The application is preconfigured with `vercel.json` for seamless zero-configuration deployment to Vercel:

1. **Push this repository to GitHub / GitLab / Bitbucket.**
2. **Log into [Vercel](https://vercel.com).**
3. **Import the repository:**
   - Framework Preset: **Vite**
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables (Optional):**
   - If your Python backend is already deployed (e.g. on Render, Fly.io, or Railway), set:
     ```
     VITE_API_BASE_URL=https://your-python-backend.com
     VITE_USE_MOCK_CHAT=false
     ```
5. Click **Deploy**. Vercel will build and serve NORA with global CDN edge routing.

---

## 🔌 Connecting Your Python / Gemma Backend

The frontend is built to communicate with a Python backend without any changes to the UI components.

### 1. Expected Endpoints

Your Python backend (FastAPI / Flask) should implement two endpoints:

#### `GET /api/health`
Health check endpoint to verify backend availability.
- **Response:** `{"status": "ok", "model": "gemma-2-9b-it"}`

#### `POST /api/chat`
Handles patient conversations.
- **Request Body:**
  ```json
  {
    "message": "What should I do right now?",
    "history": [
      { "role": "user", "content": "Hello" },
      { "role": "assistant", "content": "Hello Eleanor! How can I help?" }
    ],
    "context": {
      "userName": "Eleanor Vance",
      "nextActivity": "Gentle Garden Patio Walk",
      "currentTime": "2026-10-17T15:30:00.000Z"
    }
  }
  ```
- **Response:**
  ```json
  {
    "reply": "Your next gentle activity is a garden walk on the patio. Take your time, Eleanor.",
    "actionSuggestion": {
      "type": "navigate",
      "target": "routine",
      "label": "View Daily Routine"
    }
  }
  ```

### 2. Fast Python / FastAPI Example Starter
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="NORA Gemma Backend")

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatContext(BaseModel):
    userName: Optional[str] = "Eleanor Vance"
    nextActivity: Optional[str] = ""
    currentTime: Optional[str] = ""

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []
    context: Optional[ChatContext] = None

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "NORA Gemma Companion"}

@app.post("/api/chat")
def chat(req: ChatRequest):
    # Here, pipe req.message + context into your Gemma model pipeline
    # (e.g. via Ollama, HuggingFace transformers, or vLLM)
    prompt = f"System: You are NORA, a calm, reassuring daily assistant for {req.context.userName} who has memory difficulties. Patient: {req.message}"
    
    # Example response:
    reply = f"Hello {req.context.userName}, you are safe at home. Your next activity is {req.context.nextActivity}."
    return {"reply": reply}
```

### 3. Activating the Backend in the Frontend
Create a `.env.local` file in `D:\xnora`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_CHAT=false
```
When running, the frontend will automatically detect the live backend, display the green **"Backend Live"** badge, and send all queries to your Gemma model. If the backend ever disconnects, the frontend automatically falls back to local empathetic responses without crashing.
