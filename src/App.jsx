import React, { useState } from "react";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { RoutineProvider } from "./context/RoutineContext";
import Header from "./components/common/Header";
import NoticeBanner from "./components/common/NoticeBanner";
import Navigation from "./components/common/Navigation";
import HomeDashboard from "./components/home/HomeDashboard";
import DailyRoutine from "./components/routine/DailyRoutine";
import TalkToNora from "./components/chat/TalkToNora";
import TrustedContacts from "./components/contacts/TrustedContacts";
import Settings from "./components/settings/Settings";
import WhatShouldIDoModal from "./components/common/WhatShouldIDoModal";
import CallContactModal from "./components/common/CallContactModal";
import { TRUSTED_CONTACTS } from "./data/contactsData";
import { USER_PROFILE } from "./data/userProfile";
import "./App.css";

function MainApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [isWhatToDoOpen, setIsWhatToDoOpen] = useState(false);
  const [activeCallContact, setActiveCallContact] = useState(null);

  const handleOpenWhatToDo = () => {
    setIsWhatToDoOpen(true);
  };

  const handleCloseWhatToDo = () => {
    setIsWhatToDoOpen(false);
  };

  const handleCallSarah = () => {
    setActiveCallContact(TRUSTED_CONTACTS[0]);
  };

  const handleOpenCallModal = (contact) => {
    setActiveCallContact(contact);
  };

  const handleCloseCallModal = () => {
    setActiveCallContact(null);
  };

  return (
    <div className="app-wrapper">
      <Header onOpenWhatToDo={handleOpenWhatToDo} />
      <NoticeBanner />
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="main-content">
        <div className="app-container">
          {activeTab === "home" && (
            <HomeDashboard
              onNavigateTab={setActiveTab}
              onOpenWhatToDo={handleOpenWhatToDo}
              onSelectContact={handleOpenCallModal}
            />
          )}

          {activeTab === "routine" && <DailyRoutine />}

          {activeTab === "chat" && (
            <TalkToNora onNavigateTab={setActiveTab} />
          )}

          {activeTab === "contacts" && (
            <TrustedContacts onOpenCallModal={handleOpenCallModal} />
          )}

          {activeTab === "settings" && <Settings />}
        </div>
      </main>

      {/* Global Modals */}
      <WhatShouldIDoModal
        isOpen={isWhatToDoOpen}
        onClose={handleCloseWhatToDo}
        onNavigateTab={setActiveTab}
        onCallSarah={handleCallSarah}
      />

      <CallContactModal
        contact={activeCallContact}
        isOpen={Boolean(activeCallContact)}
        onClose={handleCloseCallModal}
      />

      {/* Reassuring Dignified Footer */}
      <footer className="app-footer">
        <div className="app-container footer-inner">
          <div>
            <strong>NORA</strong> — Calm & Dignified Daily Life Assistant for {USER_PROFILE.fullName}.
          </div>
          <div>
            Designed with high contrast, calm tones, and memory support principles.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <RoutineProvider>
        <MainApp />
      </RoutineProvider>
    </AccessibilityProvider>
  );
}
