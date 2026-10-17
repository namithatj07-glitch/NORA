import React from "react";
import { Phone, MessageSquare, Clock, Heart, Shield, Volume2 } from "lucide-react";
import { TRUSTED_CONTACTS } from "../../data/contactsData";
import { USER_PROFILE } from "../../data/userProfile";
import { speechService } from "../../services/speechService";

export default function TrustedContacts({ onOpenCallModal }) {
  const handleReadContacts = () => {
    speechService.speak(
      `Your trusted contacts: Sarah Miller, your daughter, is visiting today at 2:00 PM. Dr. Peter Chen is your family doctor. Marcus Vance is your neighbor across the hall. You can tap Call anytime.`
    );
  };

  return (
    <div className="trusted-contacts-view" role="region" aria-label="Trusted Contacts">
      {/* Title Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "8px" }}>
          <div>
            <h1 style={{ fontSize: "var(--font-3xl)", marginBottom: "4px" }}>
              Trusted Contacts
            </h1>
            <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", margin: 0 }}>
              People who love and support Eleanor Vance. They are always happy to hear from you.
            </p>
          </div>

          <button
            onClick={handleReadContacts}
            className="btn btn-secondary"
            style={{ borderRadius: "var(--radius-full)", padding: "10px 18px", fontSize: "var(--font-sm)" }}
            aria-label="Read contacts list aloud"
          >
            <Volume2 size={20} color="#52796F" />
            <span>Read Aloud</span>
          </button>
        </div>
      </div>

      {/* Primary Caregiver Spotlight Card */}
      <div
        style={{
          backgroundColor: "var(--bg-accent-soft)",
          border: "2.5px solid var(--brand-sage)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            className="contact-avatar"
            style={{
              backgroundColor: "var(--brand-sage)",
              color: "#FAF7F2",
              width: "64px",
              height: "64px",
              fontSize: "1.4rem"
            }}
          >
            SM
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
              <span
                style={{
                  backgroundColor: "var(--brand-sage-bg)",
                  color: "var(--brand-sage-dark)",
                  fontSize: "var(--font-xs)",
                  padding: "2px 10px",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 700
                }}
              >
                PRIMARY CAREGIVER
              </span>
              <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)" }}>
                {USER_PROFILE.primaryCaregiver.visitTime}
              </span>
            </div>
            <h2 style={{ fontSize: "var(--font-xl)", margin: 0 }}>
              Sarah Miller ({USER_PROFILE.primaryCaregiver.relationship})
            </h2>
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", margin: "4px 0 0" }}>
              Lives 10 minutes away • Bringing warm apple cinnamon rolls today at 2:00 PM
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenCallModal(TRUSTED_CONTACTS[0])}
          className="btn btn-primary"
          style={{ minWidth: "180px", fontSize: "var(--font-base)" }}
        >
          <Phone size={20} />
          <span>Call Sarah</span>
        </button>
      </div>

      {/* Grid of All Contacts */}
      <div className="contacts-grid">
        {TRUSTED_CONTACTS.map((contact) => (
          <div key={contact.id} className="contact-card">
            <div>
              <div className="contact-header">
                <div
                  className="contact-avatar"
                  style={{
                    backgroundColor: contact.avatarBg,
                    color: contact.avatarColor
                  }}
                >
                  {contact.initials}
                </div>
                <div>
                  <h3 className="contact-name">{contact.name}</h3>
                  <p className="contact-relationship">{contact.relationship}</p>
                </div>
              </div>

              {contact.statusBadge && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "var(--bg-canvas)",
                    border: "1px solid var(--border-subtle)",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--font-xs)",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    margin: "12px 0"
                  }}
                >
                  <Clock size={12} />
                  <span>{contact.statusBadge}</span>
                </div>
              )}

              <p className="contact-notes">{contact.notes}</p>
            </div>

            <div className="contact-actions">
              <button
                onClick={() => onOpenCallModal(contact)}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                <Phone size={20} />
                <span>Call {contact.name.split(" ")[0]}</span>
              </button>

              <button
                onClick={() => onOpenCallModal(contact)}
                className="btn btn-secondary"
                style={{ width: "100%", fontSize: "var(--font-sm)" }}
              >
                <MessageSquare size={18} color="#52796F" />
                <span>Send Quick Note</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
