import React from "react";
import { Volume2, ArrowRight } from "lucide-react";
import { speechService } from "../../services/speechService";

export default function ChatMessage({ message, onNavigateTab }) {
  const isNora = message.sender === "nora";

  const handleReadAloud = () => {
    speechService.speak(message.text);
  };

  return (
    <div className={`chat-bubble-row ${isNora ? "nora" : "user"}`}>
      <div
        className={`chat-avatar ${isNora ? "nora-avatar" : "user-avatar"}`}
        aria-hidden="true"
      >
        {isNora ? "N" : "E"}
      </div>

      <div>
        <div className={`chat-bubble ${isNora ? "nora" : "user"}`}>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>{message.text}</p>
        </div>

        {isNora && (
          <div className="bubble-actions-row">
            <button
              onClick={handleReadAloud}
              className="bubble-audio-btn"
              title="Read this message aloud"
              aria-label="Read this message aloud"
            >
              <Volume2 size={16} />
              <span>Read Aloud</span>
            </button>

            {message.actionSuggestion && message.actionSuggestion.target && (
              <button
                onClick={() => onNavigateTab(message.actionSuggestion.target)}
                className="btn btn-secondary"
                style={{
                  minHeight: "34px",
                  padding: "4px 12px",
                  fontSize: "var(--font-xs)",
                  borderRadius: "var(--radius-full)"
                }}
              >
                <span>{message.actionSuggestion.label}</span>
                <ArrowRight size={14} />
              </button>
            )}

            {message.source && (
              <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                {message.source === "backend" ? "Python Backend" : "Local Assisted"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
