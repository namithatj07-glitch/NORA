import React, { useState } from "react";
import {
  Sun,
  Sunset,
  Moon,
  CheckCircle,
  RotateCcw,
  Sparkles,
  X,
  Volume2
} from "lucide-react";
import { useRoutine } from "../../context/RoutineContext";
import ActivityCard from "./ActivityCard";
import { speechService } from "../../services/speechService";

export default function DailyRoutine() {
  const {
    routine,
    toggleComplete,
    resetRoutine,
    completedCount,
    totalCount,
    progressPercent,
    lastFeedback,
    clearFeedback,
    morningActivities,
    afternoonActivities,
    eveningActivities
  } = useRoutine();

  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'morning' | 'afternoon' | 'evening'

  const handleReadSummary = () => {
    speechService.speak(
      `Daily Routine: You have completed ${completedCount} out of ${totalCount} peaceful activities for today. Keep taking it easy, Eleanor.`
    );
  };

  const getFilteredList = () => {
    if (activeFilter === "morning") return { morning: morningActivities };
    if (activeFilter === "afternoon") return { afternoon: afternoonActivities };
    if (activeFilter === "evening") return { evening: eveningActivities };
    return {
      morning: morningActivities,
      afternoon: afternoonActivities,
      evening: eveningActivities
    };
  };

  const sectionsToRender = getFilteredList();

  return (
    <div className="daily-routine-view" role="region" aria-label="Daily Routine View">
      {/* Title & Progress Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <h1 style={{ fontSize: "var(--font-3xl)", marginBottom: "4px" }}>
              Daily Routine
            </h1>
            <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", margin: 0 }}>
              Gentle, familiar daily flow for Eleanor Vance. Take all the time you need.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleReadSummary}
              className="btn btn-secondary"
              style={{ borderRadius: "var(--radius-full)", padding: "10px 18px", fontSize: "var(--font-sm)" }}
              aria-label="Read routine summary aloud"
            >
              <Volume2 size={20} color="#52796F" />
              <span>Read Summary</span>
            </button>

            <button
              onClick={resetRoutine}
              className="btn btn-secondary"
              style={{ borderRadius: "var(--radius-full)", padding: "10px 18px", fontSize: "var(--font-sm)" }}
              title="Reset routine tasks to initial demo state"
            >
              <RotateCcw size={18} />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Progress Card */}
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "2px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontWeight: 600, fontSize: "var(--font-base)", color: "var(--text-primary)" }}>
              Today's Progress: {completedCount} of {totalCount} completed
            </span>
            <span style={{ fontWeight: 700, fontSize: "var(--font-base)", color: "var(--brand-sage-dark)" }}>
              {progressPercent}%
            </span>
          </div>
          {/* Accessible visual progress bar */}
          <div
            style={{
              width: "100%",
              height: "14px",
              backgroundColor: "var(--bg-surface-soft)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden"
            }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                backgroundColor: "var(--brand-sage)",
                borderRadius: "var(--radius-full)",
                transition: "width 0.4s ease"
              }}
            />
          </div>
        </div>

        {/* Celebratory Feedback Alert */}
        {lastFeedback && (
          <div className="feedback-toast" role="alert">
            <div className="feedback-toast-text">
              <Sparkles size={24} />
              <span>
                <strong>{lastFeedback.title}:</strong> {lastFeedback.message}
              </span>
            </div>
            <button
              onClick={clearFeedback}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--success-green)" }}
              aria-label="Dismiss feedback message"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Filter Segmented Controls */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { id: "all", label: `All Day (${totalCount})` },
            { id: "morning", label: `Morning (${morningActivities.length})` },
            { id: "afternoon", label: `Afternoon (${afternoonActivities.length})` },
            { id: "evening", label: `Evening (${eveningActivities.length})` }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`btn ${activeFilter === f.id ? "btn-primary" : "btn-secondary"}`}
              style={{
                borderRadius: "var(--radius-full)",
                minHeight: "44px",
                padding: "8px 20px",
                fontSize: "var(--font-sm)",
                whiteSpace: "nowrap"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Morning Section */}
        {sectionsToRender.morning && sectionsToRender.morning.length > 0 && (
          <section aria-labelledby="morning-section-heading">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Sun size={24} color="#B67139" aria-hidden="true" />
              <h2 id="morning-section-heading" style={{ fontSize: "var(--font-xl)", margin: 0 }}>
                Morning Routine (8:00 AM – 12:00 PM)
              </h2>
            </div>
            <div>
              {sectionsToRender.morning.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onToggleComplete={toggleComplete}
                />
              ))}
            </div>
          </section>
        )}

        {/* Afternoon Section */}
        {sectionsToRender.afternoon && sectionsToRender.afternoon.length > 0 && (
          <section aria-labelledby="afternoon-section-heading">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Sunset size={24} color="#52796F" aria-hidden="true" />
              <h2 id="afternoon-section-heading" style={{ fontSize: "var(--font-xl)", margin: 0 }}>
                Afternoon Routine (12:00 PM – 5:00 PM)
              </h2>
            </div>
            <div>
              {sectionsToRender.afternoon.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onToggleComplete={toggleComplete}
                />
              ))}
            </div>
          </section>
        )}

        {/* Evening Section */}
        {sectionsToRender.evening && sectionsToRender.evening.length > 0 && (
          <section aria-labelledby="evening-section-heading">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <Moon size={24} color="#354F52" aria-hidden="true" />
              <h2 id="evening-section-heading" style={{ fontSize: "var(--font-xl)", margin: 0 }}>
                Evening Routine (6:00 PM – 9:00 PM)
              </h2>
            </div>
            <div>
              {sectionsToRender.evening.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onToggleComplete={toggleComplete}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
