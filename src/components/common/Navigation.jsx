import React from "react";
import { Home, CalendarCheck, MessageSquareHeart, Users, Sliders } from "lucide-react";
import { useRoutine } from "../../context/RoutineContext";

export default function Navigation({ activeTab, onSelectTab }) {
  const { completedCount, totalCount } = useRoutine();

  const navItems = [
    {
      id: "home",
      label: "Home Dashboard",
      icon: Home,
      badge: null
    },
    {
      id: "routine",
      label: "Daily Routine",
      icon: CalendarCheck,
      badge: `${completedCount}/${totalCount}`
    },
    {
      id: "chat",
      label: "Talk to NORA",
      icon: MessageSquareHeart,
      badge: "Ready"
    },
    {
      id: "contacts",
      label: "Trusted Contacts",
      icon: Users,
      badge: null
    },
    {
      id: "settings",
      label: "Settings & Comfort",
      icon: Sliders,
      badge: null
    }
  ];

  return (
    <nav className="app-nav" aria-label="Main Navigation">
      <div className="app-container">
        <div className="nav-tabs-list" role="tablist">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                id={`tab-${item.id}`}
                className={`nav-tab-item ${isActive ? "active" : ""}`}
                onClick={() => onSelectTab(item.id)}
              >
                <Icon size={22} aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="tab-badge" aria-label={`Status: ${item.badge}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
