import React, { useState, useEffect } from "react";
import { Info, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { chatService } from "../../services/chatService";
import { apiConfig } from "../../services/api";

export default function NoticeBanner() {
  const [status, setStatus] = useState(chatService.getStatus());
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    const updated = await chatService.updateStatus();
    setStatus(updated);
    setChecking(false);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="demo-notice-bar" role="status">
      <div className="app-container demo-notice-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Info size={16} aria-hidden="true" color="#52796F" />
          <span>
            <strong>Frontend Demo Mode:</strong> Using local compassionate responses.
            Target Python backend: <code>{apiConfig.baseUrl}</code>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="demo-status-pill">
            <span
              className={`demo-status-dot ${status.isOnline ? "" : "offline"}`}
              aria-hidden="true"
            />
            {status.isOnline ? "Backend Live" : "Local Assisted Mode"}
          </span>

          <button
            onClick={checkConnection}
            disabled={checking}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              fontSize: "0.82rem",
              borderRadius: "4px",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              background: "var(--bg-surface)"
            }}
            title="Check connection to Python backend"
          >
            <RefreshCw size={12} className={checking ? "spin" : ""} />
            {checking ? "Checking..." : "Check Backend"}
          </button>
        </div>
      </div>
    </div>
  );
}
