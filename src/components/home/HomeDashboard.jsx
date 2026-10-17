import React from "react";
import {
  Sparkles,
  CalendarCheck,
  MessageSquareHeart,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  ShieldCheck,
  Sun,
  Volume2
} from "lucide-react";
import { useRoutine } from "../../context/RoutineContext";
import { USER_PROFILE } from "../../data/userProfile";
import { speechService } from "../../services/speechService";

export default function HomeDashboard({ onNavigateTab, onOpenWhatToDo, onSelectContact }) {
  const { nextActivity, toggleComplete, completedCount, totalCount, progressPercent } = useRoutine();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const fullDateDisplay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  const handleReadOrientation = () => {
    speechService.speak(
      `${getGreeting()}, ${USER_PROFILE.firstName}. Today is ${fullDateDisplay}. You are safe in your home at ${USER_PROFILE.homeAddress}. Your daughter Sarah is visiting today at 2:00 PM.`
    );
  };

  return (
    <div className="home-dashboard" role="region" aria-label="Home Dashboard">
      {/* Friendly Personalized Greeting */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "var(--font-3xl)", marginBottom: "4px" }}>
              {getGreeting()}, {USER_PROFILE.firstName}
            </h1>
            <p style={{ fontSize: "var(--font-lg)", color: "var(--text-secondary)", margin: 0 }}>
              Today is <strong>{fullDateDisplay}</strong>. A peaceful day at home.
            </p>
          </div>

          <button
            onClick={handleReadOrientation}
            className="btn btn-secondary"
            style={{ borderRadius: "var(--radius-full)", padding: "10px 18px", fontSize: "var(--font-sm)" }}
            aria-label="Listen to today's orientation greeting aloud"
          >
            <Volume2 size={20} color="#52796F" />
            <span>Listen Aloud</span>
          </button>
        </div>
      </div>

      {/* Prominent "What Should I Do Now?" Hero Banner */}
      <section className="hero-action-card" aria-labelledby="hero-title">
        <div className="hero-action-header">
          <div>
            <div className="hero-tag">
              <Sparkles size={16} />
              <span>Right Now Assistance</span>
            </div>
            <h2 id="hero-title">Feeling unsure of what's next?</h2>
            <p>
              Tap this button anytime you wonder what day it is, what you should be doing,
              or if you just need a friendly, reassuring voice.
            </p>
          </div>
        </div>

        <div className="hero-buttons-group">
          <button
            onClick={onOpenWhatToDo}
            className="btn btn-primary btn-large-hero"
            aria-haspopup="dialog"
          >
            <Sparkles size={26} />
            <span>What Should I Do Now?</span>
          </button>

          <button
            onClick={() => onNavigateTab("chat")}
            className="btn btn-secondary btn-large-hero"
          >
            <MessageSquareHeart size={26} color="#52796F" />
            <span>Talk with NORA</span>
          </button>
        </div>
      </section>

      {/* Up Next Activity Spotlight */}
      <section style={{ marginBottom: "28px" }} aria-labelledby="upnext-heading">
        <div className="card-title-row">
          <h2 id="upnext-heading" className="card-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Clock size={24} color="#52796F" />
            <span>Up Next Today</span>
          </h2>
          <button
            onClick={() => onNavigateTab("routine")}
            className="btn-link"
            style={{ fontSize: "var(--font-sm)", fontWeight: 600, color: "var(--brand-sage-dark)" }}
          >
            View all {totalCount} activities →
          </button>
        </div>

        {nextActivity ? (
          <div className="activity-card" style={{ border: "2.5px solid var(--brand-sage-light)" }}>
            <button
              onClick={() => toggleComplete(nextActivity.id)}
              className="complete-checkbox-btn"
              title="Click to mark this activity completed"
              aria-label={`Mark ${nextActivity.title} as completed`}
            >
              <CheckCircle2 size={28} />
            </button>

            <div className="activity-info">
              <div className="activity-meta-row">
                <span className="time-tag">{nextActivity.time}</span>
                <span className="location-tag">📍 {nextActivity.location}</span>
                <span style={{ fontSize: "var(--font-sm)", color: "var(--text-muted)", marginLeft: "auto" }}>
                  {nextActivity.category}
                </span>
              </div>
              <h3 className="activity-title">{nextActivity.title}</h3>
              <p className="activity-note">{nextActivity.note}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  onClick={() => toggleComplete(nextActivity.id)}
                  className="btn btn-primary"
                  style={{ minHeight: "44px", padding: "8px 18px", fontSize: "var(--font-sm)" }}
                >
                  <CheckCircle2 size={18} />
                  <span>Mark Done</span>
                </button>
                <button
                  onClick={() => onNavigateTab("routine")}
                  className="btn btn-secondary"
                  style={{ minHeight: "44px", padding: "8px 18px", fontSize: "var(--font-sm)" }}
                >
                  See Routine
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
            <CheckCircle2 size={44} color="#2E6B4B" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "var(--font-xl)", color: "var(--success-green)", marginBottom: "6px" }}>
              All Activities Finished For Today
            </h3>
            <p style={{ fontSize: "var(--font-base)", margin: 0 }}>
              You have completed every scheduled activity. Sit back, rest, and enjoy a quiet, cozy afternoon!
            </p>
          </div>
        )}
      </section>

      {/* Orientation & Safe Home Reassurance Card */}
      <section className="orientation-card" aria-label="Home Orientation Details">
        <div className="orientation-icon-box" aria-hidden="true">
          <ShieldCheck size={32} />
        </div>
        <div className="orientation-text">
          <h3>You are safely in your home</h3>
          <p style={{ margin: 0 }}>
            {USER_PROFILE.orientationSummary} ({USER_PROFILE.homeAddress}).
            Your daughter Sarah is visiting at 2:00 PM with warm apple rolls.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab("contacts")}
          className="btn btn-secondary"
          style={{ padding: "10px 18px", fontSize: "var(--font-sm)", borderRadius: "var(--radius-full)" }}
        >
          <span>Sarah's Contact</span>
          <ArrowRight size={16} />
        </button>
      </section>

      {/* Quick Access Tiles Grid */}
      <section aria-labelledby="quick-access-heading">
        <h2 id="quick-access-heading" className="card-title" style={{ marginBottom: "16px" }}>
          Quick Access
        </h2>

        <div className="dashboard-grid">
          {/* Daily Routine Tile */}
          <button
            onClick={() => onNavigateTab("routine")}
            className="quick-tile"
            aria-label="Open Daily Routine"
          >
            <div>
              <div className="quick-tile-header">
                <div className="quick-tile-icon">
                  <CalendarCheck size={28} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <h3>Daily Routine</h3>
                  <p>{completedCount} of {totalCount} completed</p>
                </div>
              </div>
              <p style={{ textAlign: "left", fontSize: "var(--font-base)", color: "var(--text-secondary)" }}>
                Morning breakfast, garden walks, meals, and gentle evening wind down.
              </p>
            </div>
            <div className="quick-tile-footer">
              <span>View full day</span>
              <ArrowRight size={18} />
            </div>
          </button>

          {/* Talk to NORA Tile */}
          <button
            onClick={() => onNavigateTab("chat")}
            className="quick-tile"
            aria-label="Talk with NORA"
          >
            <div>
              <div className="quick-tile-header">
                <div className="quick-tile-icon">
                  <MessageSquareHeart size={28} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <h3>Talk to NORA</h3>
                  <p>Compassionate helper</p>
                </div>
              </div>
              <p style={{ textAlign: "left", fontSize: "var(--font-base)", color: "var(--text-secondary)" }}>
                Ask gentle questions anytime: "Where am I?", "Who is visiting?", or "What should I do?"
              </p>
            </div>
            <div className="quick-tile-footer">
              <span>Start conversation</span>
              <ArrowRight size={18} />
            </div>
          </button>

          {/* Trusted Contacts Tile */}
          <button
            onClick={() => onNavigateTab("contacts")}
            className="quick-tile"
            aria-label="Open Trusted Contacts"
          >
            <div>
              <div className="quick-tile-header">
                <div className="quick-tile-icon">
                  <Users size={28} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <h3>Trusted Contacts</h3>
                  <p>Family & caregivers</p>
                </div>
              </div>
              <p style={{ textAlign: "left", fontSize: "var(--font-base)", color: "var(--text-secondary)" }}>
                Call daughter Sarah, Dr. Peter Chen, neighbor Marcus, or the 24/7 support line.
              </p>
            </div>
            <div className="quick-tile-footer">
              <span>See contacts</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
