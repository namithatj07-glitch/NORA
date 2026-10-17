import React, { useState } from "react";
import { X, Phone, PhoneOff, MessageSquare, Check, Heart } from "lucide-react";
import { speechService } from "../../services/speechService";

export default function CallContactModal({ contact, isOpen, onClose }) {
  const [callStatus, setCallStatus] = useState("ready"); // 'ready' | 'calling' | 'messageSent'
  const [sentMessage, setSentMessage] = useState("");

  if (!isOpen || !contact) return null;

  const handleStartSimulatedCall = () => {
    setCallStatus("calling");
    speechService.speak(
      `Connecting to ${contact.name}, ${contact.relationship}. Please hold on comfortably.`
    );
  };

  const handleEndCall = () => {
    speechService.stop();
    setCallStatus("ready");
    onClose();
  };

  const handleSendQuickNote = (msg) => {
    setSentMessage(msg);
    setCallStatus("messageSent");
    speechService.speak(`Note saved for ${contact.name}: ${msg}`);
    setTimeout(() => {
      setCallStatus("ready");
    }, 4000);
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={handleEndCall}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "560px" }}
      >
        <div className="modal-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              className="contact-avatar"
              style={{
                backgroundColor: contact.avatarBg,
                color: contact.avatarColor,
                width: "48px",
                height: "48px",
                fontSize: "1.2rem"
              }}
            >
              {contact.initials}
            </div>
            <div>
              <h2 id="contact-modal-title" style={{ fontSize: "var(--font-xl)", margin: 0 }}>
                {contact.name}
              </h2>
              <p style={{ fontSize: "var(--font-sm)", color: "var(--brand-sage-dark)", margin: 0 }}>
                {contact.relationship}
              </p>
            </div>
          </div>
          <button
            onClick={handleEndCall}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        {callStatus === "calling" ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "var(--brand-sage-bg)",
                color: "var(--brand-sage-dark)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                animation: "pulse 2s infinite"
              }}
            >
              <Phone size={36} />
            </div>
            <h3 style={{ fontSize: "var(--font-xl)", marginBottom: "8px" }}>
              Ringing {contact.name}...
            </h3>
            <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Sarah's phone is ringing. She knows it's you and will answer shortly. Take your time.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                className="btn btn-secondary"
                style={{ textDecoration: "none" }}
              >
                Open Device Dialer ({contact.phone})
              </a>
              <button
                onClick={handleEndCall}
                className="btn"
                style={{ backgroundColor: "#B85D5D", color: "#FFFFFF" }}
              >
                <PhoneOff size={20} />
                <span>End Call</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                backgroundColor: "var(--bg-surface-soft)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                marginBottom: "20px"
              }}
            >
              <p style={{ fontSize: "var(--font-base)", margin: 0 }}>
                📞 <strong>Phone Number:</strong> {contact.phone}
              </p>
              {contact.statusBadge && (
                <p style={{ fontSize: "var(--font-sm)", color: "var(--brand-sage-dark)", marginTop: "6px", fontWeight: 600 }}>
                  🗓️ {contact.statusBadge}
                </p>
              )}
            </div>

            {callStatus === "messageSent" && (
              <div
                style={{
                  backgroundColor: "var(--success-green-bg)",
                  border: "1.5px solid var(--success-green-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px"
                }}
              >
                <Check size={20} color="#2E6B4B" />
                <span style={{ fontSize: "var(--font-sm)", color: "var(--success-green)", fontWeight: 600 }}>
                  Quick note sent: "{sentMessage}"
                </span>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              <button
                onClick={handleStartSimulatedCall}
                className="btn btn-primary"
                style={{ width: "100%", fontSize: "var(--font-lg)" }}
              >
                <Phone size={22} />
                <span>Call {contact.name} Now</span>
              </button>

              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                className="btn btn-secondary"
                style={{ width: "100%", textDecoration: "none" }}
              >
                Direct Device Dial ({contact.phone})
              </a>
            </div>

            {contact.quickMessages && contact.quickMessages.length > 0 && (
              <div>
                <h4 style={{ fontSize: "var(--font-base)", marginBottom: "12px", color: "var(--text-primary)" }}>
                  Or send a friendly pre-written note:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {contact.quickMessages.map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendQuickNote(msg)}
                      className="btn btn-secondary"
                      style={{
                        justifyContent: "flex-start",
                        textAlign: "left",
                        padding: "12px 16px",
                        fontSize: "var(--font-sm)"
                      }}
                    >
                      <MessageSquare size={16} color="#52796F" style={{ flexShrink: 0 }} />
                      <span>{msg}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
