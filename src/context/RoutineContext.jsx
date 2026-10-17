import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_ROUTINE } from "../data/routineData";

const RoutineContext = createContext(null);

export function RoutineProvider({ children }) {
  const [routine, setRoutine] = useState(() => {
    try {
      const saved = localStorage.getItem("nora_routine_state");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to parse saved routine, using default:", e);
    }
    return INITIAL_ROUTINE;
  });

  const [lastFeedback, setLastFeedback] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("nora_routine_state", JSON.stringify(routine));
    } catch (e) {
      console.warn("Failed to persist routine to storage:", e);
    }
  }, [routine]);

  // Toggle activity completion
  const toggleComplete = (id) => {
    setRoutine((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          const now = new Date();
          const timeStr = now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
          });

          if (nextCompleted) {
            setLastFeedback({
              activityId: item.id,
              title: item.title,
              message: item.encouragement || "Well done, Eleanor! A gentle step completed.",
              timestamp: timeStr
            });
          } else {
            // Dismiss feedback if unchecking
            setLastFeedback(null);
          }

          return {
            ...item,
            completed: nextCompleted,
            completedAt: nextCompleted ? timeStr : null
          };
        }
        return item;
      })
    );
  };

  const clearFeedback = () => setLastFeedback(null);

  const resetRoutine = () => {
    setRoutine(INITIAL_ROUTINE);
    setLastFeedback(null);
    localStorage.removeItem("nora_routine_state");
  };

  // Find the next upcoming uncompleted activity
  const nextActivity = routine.find((item) => !item.completed) || null;

  // Counts
  const completedCount = routine.filter((i) => i.completed).length;
  const totalCount = routine.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Periods
  const morningActivities = routine.filter((i) => i.period === "morning");
  const afternoonActivities = routine.filter((i) => i.period === "afternoon");
  const eveningActivities = routine.filter((i) => i.period === "evening");

  const value = {
    routine,
    toggleComplete,
    resetRoutine,
    nextActivity,
    completedCount,
    totalCount,
    progressPercent,
    lastFeedback,
    clearFeedback,
    morningActivities,
    afternoonActivities,
    eveningActivities
  };

  return (
    <RoutineContext.Provider value={value}>
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error("useRoutine must be used within a RoutineProvider");
  }
  return context;
}
