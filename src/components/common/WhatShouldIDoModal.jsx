import React, { useEffect } from "react";
import { X, CheckCircle, Volume2, ArrowRight, HeartHandshake, PhoneCall, Sparkles } from "lucide-react";
import { useRoutine } from "../../context/RoutineContext";
import { USER_PROFILE } from "../../data/userProfile";
import { speechService } from "../../services/speechService";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function WhatShouldIDoModal({ isOpen, onClose, onNavigateTab, onCallSarah }) {
  const { nextActivity, toggleComplete } = useRoutine();
  const { autoReadAloud } = useAccessibility();

  const reassuranceText = nextActivity
    ? `Hello Eleanor. You are safe in your home. Right now, your next gentle activity is ${nextActivity.title} at ${nextActivity.time}. ${nextActivity.note}`
    : "Hello Eleanor. You are safe at home. You have completed all scheduled activities for today! Relax and enjoy a restful afternoon.";

  useEffect(() => {
    if (isOpen && autoReadAloud) {
      speechService.speak(reassuranceText);
    }
  }, [isOpen, autoReadAloud, reassuranceText]);

  if (!isOpen) return null;

  const handleReadAloud = () => {
    speechService.speak(reassuranceText);
  };

  const handleMarkDone = () => {
    if (nextActivity) {
      toggleComplete(nextActivity.id);
      speechService.speak(`Wonderful! ${nextActivity.title} is marked as done.`);
    }
    onClose();
  };

  const handleTalkToNora = () => {
    onClose();
    onNavigateTab("chat");
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                padding: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--brand-sage-bg)",
                color: "var(--brand-sage-dark)"
              }}
            >
              <Sparkles size={24} />
            </span>
            <h2 id="modal-title" style={{ fontSize: "var(--font-xl)", margin: 0 }}>
              What Should I Do Now?
            </h2>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        {/* Calm orientation box */}
        <div
          style={{
            backgroundColor: "var(--bg-accent-soft)",
            border: "2px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            marginBottom: "24px"
          }}
        >
          <p style={{ fontSize: "var(--font-base)", color: "var(--text-primary)", fontWeight: 500, margin: 0 }}>
            🌸 <strong>Take your time, Eleanor.</strong> You are safe in your comfortable home at {USER_PROFILE.homeAddress}.
            There is no hurry and nothing urgent is missing.
          </p>
        </div>

        {/* Immediate Next Activity */}
        {nextActivity ? (
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "2.5px solid var(--brand-sage)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 4px 14px rgba(82, 121, 111, 0.1)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span className="time-tag">{nextActivity.time}</span>
              <span className="location-tag">📍 {nextActivity.location}</span>
            </div>
            <h3 style={{ fontSize: "var(--font-xl)", marginBottom: "8px", color: "var(--text-primary)" }}>
              {nextActivity.title}
            </h3>
            <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", marginBottom: "18px" }}>
              {nextActivity.note}
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleMarkDone}
                className="btn btn-primary"
                style={{ flex: 1, minWidth: "200px" }}
              >
                <CheckCircle size={22} />
                <span>Mark as Done</span>
              </button>
              <button
                onClick={handleReadAloud}
                className="btn btn-secondary"
                title="Listen to this aloud"
              >
                <Volume2 size={22} />
                <span>Listen Aloud</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "var(--success-green-bg)",
              border: "2px solid var(--success-green-border)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              textAlign: "center",
              marginBottom: "24px"
            }}
          >
            <CheckCircle size={40} color="#2E6B4B" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "var(--font-xl)", color: "var(--success-green)" }}>
              All Activities Finished!
            </h3>
            <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)" }}>
              You have completed every planned activity for today. Rest comfortably, listen to music, or relax with a warm drink.
            </p>
          </div>
        )}

        {/* Additional Reassurance Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleTalkToNora}
            className="btn btn-secondary"
            style={{ justifyContent: "space-between", width: "100%", padding: "16px 20px" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <HeartHandshake size={24} color="#52796F" />
              <span>Ask NORA a gentle question</span>
            </span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => {
              onClose();
              if (onCallSarah) onCallSarah();
            }}
            className="btn btn-secondary"
            style={{ justifyContent: "space-between", width: "100%", padding: "16px 20px" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <PhoneCall size={24} color="#B67139" />
              <span>Call Sarah ({USER_PROFILE.primaryCaregiver.relationship})</span>
            </span>
            <span style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)" }}>
              {USER_PROFILE.primaryCaregiver.phone}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
