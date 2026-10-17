import React, { useState, useEffect } from "react";
import { Clock, HelpCircle, Heart, Volume2, VolumeX } from "lucide-react";
import { useAccessibility } from "../../context/AccessibilityContext";
import { USER_PROFILE } from "../../data/userProfile";
import { speechService } from "../../services/speechService";

export default function Header({ onOpenWhatToDo }) {
  const { autoReadAloud, setAutoReadAloud } = useAccessibility();
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        })
      );
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric"
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !autoReadAloud;
    setAutoReadAloud(next);
    if (!next) {
      speechService.stop();
    } else {
      speechService.speak("Voice assistance is turned on.");
    }
  };

  return (
    <header className="app-header" role="banner">
      <div className="app-container header-content">
        <div className="brand-section">
          <div className="brand-logo-badge" aria-hidden="true">
            N
          </div>
          <div className="brand-text">
            <h1>NORA</h1>
            <p>Your Daily Life Companion • For {USER_PROFILE.firstName}</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-clock-pill" aria-label={`Current date and time: ${dateStr}, ${timeStr}`}>
            <Clock size={18} aria-hidden="true" />
            <span>{dateStr} • {timeStr}</span>
          </div>

          <button
            onClick={toggleSound}
            className="btn-icon-round"
            title={autoReadAloud ? "Voice read-aloud is ON (Click to turn OFF)" : "Voice read-aloud is OFF (Click to turn ON)"}
            aria-label={autoReadAloud ? "Voice read-aloud is ON" : "Voice read-aloud is OFF"}
          >
            {autoReadAloud ? <Volume2 size={22} color="#52796F" /> : <VolumeX size={22} />}
          </button>

          <button
            onClick={onOpenWhatToDo}
            className="quick-help-btn"
            aria-label="What should I do right now? Open reassuring guide"
          >
            <HelpCircle size={18} aria-hidden="true" />
            <span>What do I do now?</span>
          </button>
        </div>
      </div>
    </header>
  );
}
