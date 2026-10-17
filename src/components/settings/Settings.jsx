import React, { useState } from "react";
import {
  Type,
  Eye,
  Volume2,
  Server,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Shield,
  Heart
} from "lucide-react";
import { useAccessibility, TEXT_SIZES, CONTRAST_MODES } from "../../context/AccessibilityContext";
import { useRoutine } from "../../context/RoutineContext";
import { USER_PROFILE } from "../../data/userProfile";
import { speechService } from "../../services/speechService";
import { apiConfig, checkBackendStatus } from "../../services/api";

export default function Settings() {
  const {
    textSize,
    setTextSize,
    contrastMode,
    setContrastMode,
    autoReadAloud,
    setAutoReadAloud
  } = useAccessibility();

  const { resetRoutine } = useRoutine();
  const [resetDone, setResetDone] = useState(false);
  const [backendTestStatus, setBackendTestStatus] = useState(null);
  const [testingBackend, setTestingBackend] = useState(false);

  const handleTestSpeech = () => {
    speechService.speak(
      "Hello Eleanor! This is NORA speaking. The voice is clear, calm, and ready to assist you anytime."
    );
  };

  const handleReset = () => {
    resetRoutine();
    setResetDone(true);
    speechService.speak("Demo activities have been reset.");
    setTimeout(() => setResetDone(false), 3000);
  };

  const handleTestBackend = async () => {
    setTestingBackend(true);
    const result = await checkBackendStatus();
    setBackendTestStatus(result);
    setTestingBackend(false);
  };

  return (
    <div className="settings-view" role="region" aria-label="Settings and Accessibility">
      {/* Title Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "var(--font-3xl)", marginBottom: "4px" }}>
          Settings & Comfort
        </h1>
        <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", margin: 0 }}>
          Adjust text size, contrast, and voice assistance for comfortable daily viewing.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {/* Text Size Preference */}
        <section className="card" aria-labelledby="text-size-heading">
          <div className="card-title-row">
            <h2 id="text-size-heading" className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Type size={24} color="#52796F" />
              <span>Text Size</span>
            </h2>
            <span style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
              Current: <strong>{TEXT_SIZES[textSize]?.label}</strong>
            </span>
          </div>

          <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", marginBottom: "18px" }}>
            Choose the font size that is most comfortable and effortless for you to read.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            {Object.values(TEXT_SIZES).map((item) => (
              <button
                key={item.id}
                onClick={() => setTextSize(item.id)}
                className={`btn ${textSize === item.id ? "btn-primary" : "btn-secondary"}`}
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "16px 20px",
                  height: "auto",
                  textAlign: "left"
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{item.label}</span>
                <span style={{ fontSize: "0.85rem", opacity: 0.85, fontWeight: 400 }}>{item.desc}</span>
              </button>
            ))}
          </div>

          {/* Live Preview Box */}
          <div
            style={{
              backgroundColor: "var(--bg-canvas)",
              border: "1.5px dashed var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px"
            }}
          >
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)", marginBottom: "4px" }}>
              Live Reading Preview:
            </p>
            <p style={{ fontSize: "var(--font-base)", margin: 0, fontWeight: 500, color: "var(--text-primary)" }}>
              "NORA is your daily companion. Eleanor is safe and warm in her home at Elmwood Gardens."
            </p>
          </div>
        </section>

        {/* Color Contrast Theme */}
        <section className="card" aria-labelledby="contrast-heading">
          <div className="card-title-row">
            <h2 id="contrast-heading" className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Eye size={24} color="#52796F" />
              <span>Color & Contrast Mode</span>
            </h2>
            <span style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
              Current: <strong>{CONTRAST_MODES[contrastMode]?.label}</strong>
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            {Object.values(CONTRAST_MODES).map((item) => (
              <button
                key={item.id}
                onClick={() => setContrastMode(item.id)}
                className={`btn ${contrastMode === item.id ? "btn-primary" : "btn-secondary"}`}
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "16px 20px",
                  height: "auto",
                  textAlign: "left"
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{item.label}</span>
                <span style={{ fontSize: "0.85rem", opacity: 0.85, fontWeight: 400 }}>{item.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Voice Assistance */}
        <section className="card" aria-labelledby="voice-heading">
          <div className="card-title-row">
            <h2 id="voice-heading" className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Volume2 size={24} color="#52796F" />
              <span>Voice Assistance (Read Aloud)</span>
            </h2>
          </div>

          <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", marginBottom: "18px" }}>
            NORA can read responses, routines, and reassurance reminders aloud using your device's built-in calm speech synthesizer.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "18px" }}>
            <div>
              <span style={{ fontSize: "var(--font-base)", fontWeight: 600, display: "block" }}>
                Auto-read NORA's chat answers aloud
              </span>
              <span style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
                Automatically speaks NORA's response whenever a message is sent
              </span>
            </div>

            <button
              onClick={() => setAutoReadAloud(!autoReadAloud)}
              className={`btn ${autoReadAloud ? "btn-primary" : "btn-secondary"}`}
              style={{ minWidth: "140px" }}
            >
              {autoReadAloud ? "Enabled (ON)" : "Disabled (OFF)"}
            </button>
          </div>

          <button
            onClick={handleTestSpeech}
            className="btn btn-secondary"
            style={{ fontSize: "var(--font-sm)" }}
          >
            <Volume2 size={18} />
            <span>Test Voice Sound Now</span>
          </button>
        </section>

        {/* Patient Profile & Orientation Review */}
        <section className="card" aria-labelledby="profile-heading">
          <div className="card-title-row">
            <h2 id="profile-heading" className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Heart size={24} color="#52796F" />
              <span>Personal Orientation & Comfort Facts</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div style={{ backgroundColor: "var(--bg-canvas)", padding: "16px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                Safe Home Address
              </span>
              <p style={{ fontSize: "var(--font-base)", margin: "4px 0 0", fontWeight: 600 }}>
                {USER_PROFILE.homeAddress}, {USER_PROFILE.town}
              </p>
            </div>

            <div style={{ backgroundColor: "var(--bg-canvas)", padding: "16px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                Companion Pet
              </span>
              <p style={{ fontSize: "var(--font-base)", margin: "4px 0 0", fontWeight: 600 }}>
                {USER_PROFILE.pet.name} ({USER_PROFILE.pet.type})
              </p>
              <p style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                {USER_PROFILE.pet.habit}
              </p>
            </div>

            <div style={{ backgroundColor: "var(--bg-canvas)", padding: "16px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                Primary Caregiver
              </span>
              <p style={{ fontSize: "var(--font-base)", margin: "4px 0 0", fontWeight: 600 }}>
                {USER_PROFILE.primaryCaregiver.name} ({USER_PROFILE.primaryCaregiver.relationship})
              </p>
              <p style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", margin: "2px 0 0" }}>
                {USER_PROFILE.primaryCaregiver.phone} • {USER_PROFILE.primaryCaregiver.visitTime}
              </p>
            </div>
          </div>
        </section>

        {/* Backend & Deployment Integration Guide */}
        <section className="card" aria-labelledby="backend-heading">
          <div className="card-title-row">
            <h2 id="backend-heading" className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Server size={24} color="#52796F" />
              <span>Python / Gemma Backend Connection</span>
            </h2>
          </div>

          <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", marginBottom: "14px" }}>
            This frontend is completely prepared to connect to your FastAPI / Flask Python backend hosting Gemma.
            Current configured base URL:
          </p>

          <div
            style={{
              backgroundColor: "var(--bg-canvas)",
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              fontFamily: "monospace",
              fontSize: "var(--font-sm)",
              marginBottom: "16px",
              border: "1px solid var(--border-subtle)"
            }}
          >
            VITE_API_BASE_URL: {apiConfig.baseUrl}
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
            <button
              onClick={handleTestBackend}
              disabled={testingBackend}
              className="btn btn-secondary"
              style={{ fontSize: "var(--font-sm)" }}
            >
              <Server size={18} />
              <span>{testingBackend ? "Checking..." : "Test Backend Endpoint"}</span>
            </button>

            {backendTestStatus && (
              <span
                style={{
                  fontSize: "var(--font-sm)",
                  color: backendTestStatus.isOnline ? "var(--success-green)" : "var(--warm-amber)",
                  fontWeight: 600
                }}
              >
                {backendTestStatus.message}
              </span>
            )}
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-surface-soft)",
              padding: "16px",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--font-xs)",
              color: "var(--text-secondary)",
              lineHeight: 1.6
            }}
          >
            <strong>Expected Python Endpoints:</strong>
            <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
              <li><code>GET /api/health</code> — returns <code>&#123; "status": "ok" &#125;</code></li>
              <li><code>POST /api/chat</code> — receives <code>&#123; "message": "...", "history": [...], "context": &#123;...&#125; &#125;</code> and returns <code>&#123; "reply": "..." &#125;</code></li>
            </ul>
          </div>
        </section>

        {/* Demo Data Reset */}
        <section className="card" style={{ borderColor: "var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 className="card-title" style={{ fontSize: "var(--font-lg)", marginBottom: "4px" }}>
                Reset Demo Activities
              </h2>
              <p style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)", margin: 0 }}>
                Restore all routine items to uncompleted state for demonstration purposes.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ fontSize: "var(--font-sm)" }}
            >
              <RotateCcw size={18} />
              <span>{resetDone ? "Demo Reset Done!" : "Reset Demo Data"}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
