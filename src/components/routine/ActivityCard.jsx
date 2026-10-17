import React from "react";
import { Check, Clock, MapPin, Volume2 } from "lucide-react";
import { speechService } from "../../services/speechService";

export default function ActivityCard({ activity, onToggleComplete }) {
  const handleReadAloud = (e) => {
    e.stopPropagation();
    speechService.speak(
      `${activity.title} at ${activity.time}, in the ${activity.location}. ${activity.note}`
    );
  };

  return (
    <div
      className={`activity-card ${activity.completed ? "completed" : ""}`}
      id={`activity-${activity.id}`}
    >
      <button
        onClick={() => onToggleComplete(activity.id)}
        className={`complete-checkbox-btn ${activity.completed ? "is-completed" : ""}`}
        aria-label={
          activity.completed
            ? `Mark "${activity.title}" as incomplete`
            : `Mark "${activity.title}" as complete`
        }
        title={activity.completed ? "Mark incomplete" : "Mark complete"}
      >
        {activity.completed ? <Check size={28} strokeWidth={3} /> : null}
      </button>

      <div className="activity-info">
        <div className="activity-meta-row">
          <span className="time-tag">
            <Clock size={16} aria-hidden="true" />
            <span>{activity.time}</span>
          </span>

          <span className="location-tag">
            <MapPin size={16} aria-hidden="true" style={{ display: "inline", verticalAlign: "text-bottom" }} />
            <span>{activity.location}</span>
          </span>

          <span
            style={{
              fontSize: "var(--font-xs)",
              color: "var(--text-muted)",
              marginLeft: "auto",
              backgroundColor: "var(--bg-canvas)",
              padding: "2px 8px",
              borderRadius: "4px"
            }}
          >
            {activity.category}
          </span>
        </div>

        <h3 className="activity-title">{activity.title}</h3>
        <p className="activity-note">{activity.note}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          {activity.completed ? (
            <span className="completed-feedback-pill">
              <Check size={16} />
              <span>Completed {activity.completedAt ? `at ${activity.completedAt}` : ""} — {activity.encouragement}</span>
            </span>
          ) : (
            <button
              onClick={() => onToggleComplete(activity.id)}
              className="btn btn-secondary"
              style={{ minHeight: "40px", padding: "6px 16px", fontSize: "var(--font-sm)" }}
            >
              Mark Done
            </button>
          )}

          <button
            onClick={handleReadAloud}
            className="btn-icon-round"
            style={{ width: "38px", height: "38px" }}
            title="Read activity details aloud"
            aria-label="Read activity details aloud"
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
