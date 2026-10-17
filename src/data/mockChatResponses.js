// Realistic, compassionate mock responses for NORA in demo mode.
// Carefully crafted according to dementia care communication principles:
// Reassurance, gentle orientation, validation, and zero distress.

export const SUGGESTED_PROMPTS = [
  { id: "p1", label: "What should I do right now?", query: "What should I do right now?" },
  { id: "p2", label: "Show my routine", query: "Can you show me my routine for today?" },
  { id: "p3", label: "Where am I right now?", query: "Where am I right now?" },
  { id: "p4", label: "Who is visiting today?", query: "Who is visiting me today?" },
  { id: "p5", label: "What day is it today?", query: "What day and time is it?" },
  { id: "p6", label: "I feel a bit confused", query: "I feel a bit confused and need reassurance" }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: "welcome-1",
    sender: "nora",
    text: "Hello Eleanor! I am NORA, your daily companion. Everything is peaceful today, and you are doing wonderfully. How can I help you feel comfortable right now?",
    timestamp: "Just now",
    canReadAloud: true
  }
];

export function generateLocalMockResponse(userMessage, context = {}) {
  const query = (userMessage || "").toLowerCase().trim();
  const nextActivity = context.nextActivity || "Gentle Garden Patio Walk";
  const completedCount = context.completedCount ?? 2;
  const totalCount = context.totalCount ?? 11;

  if (
    query.includes("what should i do") ||
    query.includes("what's next") ||
    query.includes("next") ||
    query.includes("what now")
  ) {
    return {
      text: `Right now is a wonderful, calm time. Your next gentle activity is: "${nextActivity}". There is no rush at all—take your time. If you'd like, we can also look at your full Daily Routine together.`,
      actionSuggestion: { type: "navigate", target: "routine", label: "View Daily Routine" }
    };
  }

  if (query.includes("routine") || query.includes("schedule") || query.includes("plan")) {
    return {
      text: `You have completed ${completedCount} peaceful activities so far today! Next up is "${nextActivity}". You can tap the Daily Routine tab anytime to see all morning, afternoon, and evening plans.`,
      actionSuggestion: { type: "navigate", target: "routine", label: "Open Daily Routine" }
    };
  }

  if (
    query.includes("where am i") ||
    query.includes("home") ||
    query.includes("lost") ||
    query.includes("address") ||
    query.includes("safe")
  ) {
    return {
      text: "You are safe and sound at your lovely home: 42 Elmwood Gardens, Apartment 3B. Your cozy armchair is right beside you, and your cat Mittens is napping peacefully by the window. You are completely safe and warm.",
      actionSuggestion: { type: "reassurance" }
    };
  }

  if (
    query.includes("sarah") ||
    query.includes("visiting") ||
    query.includes("visit") ||
    query.includes("daughter") ||
    query.includes("who is coming")
  ) {
    return {
      text: "Your daughter Sarah is visiting you today at 2:00 PM! She is bringing warm apple cinnamon rolls and is looking forward to having afternoon tea with you. If you'd like to hear her voice right now, we can call her together.",
      actionSuggestion: { type: "navigate", target: "contacts", label: "Call Sarah (Daughter)" }
    };
  }

  if (
    query.includes("day") ||
    query.includes("date") ||
    query.includes("time") ||
    query.includes("clock") ||
    query.includes("month") ||
    query.includes("year")
  ) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    return {
      text: `Today is ${dateStr}, and the current time is approximately ${timeStr}. It is a calm, pleasant day with no urgent chores.`,
      actionSuggestion: { type: "reassurance" }
    };
  }

  if (
    query.includes("help") ||
    query.includes("confused") ||
    query.includes("anxious") ||
    query.includes("scared") ||
    query.includes("worry") ||
    query.includes("upset")
  ) {
    return {
      text: "Take a deep, slow breath with me. Everything is okay. You are in your familiar home on Elmwood Gardens. Nothing is broken and nothing is wrong. Your daughter Sarah knows where you are and is just a phone call away. Would you like to reach out to Sarah or Dr. Chen?",
      actionSuggestion: { type: "navigate", target: "contacts", label: "Open Trusted Contacts" }
    };
  }

  if (query.includes("mittens") || query.includes("cat") || query.includes("pet")) {
    return {
      text: "Mittens is your sweet orange tabby cat! She loves curling up on the soft rug by the patio sunbeam. She might be having a gentle catnap right now.",
      actionSuggestion: { type: "reassurance" }
    };
  }

  if (query.includes("doctor") || query.includes("dr") || query.includes("chen") || query.includes("medicine")) {
    return {
      text: "Dr. Peter Chen is your caring family physician at Oakwood Clinic. Your next scheduled routine checkup is next month. If you are feeling unwell or have any question, we can call Dr. Chen's office together.",
      actionSuggestion: { type: "navigate", target: "contacts", label: "View Doctor's Contact" }
    };
  }

  if (query.includes("tea") || query.includes("eat") || query.includes("lunch") || query.includes("dinner") || query.includes("hungry")) {
    return {
      text: "A warm cup of chamomile tea with a drop of honey is always a soothing idea. Your lunch of hearty vegetable soup is planned for around 12:45 PM. Would you like to see your meal times in your routine?",
      actionSuggestion: { type: "navigate", target: "routine", label: "Check Routine Meals" }
    };
  }

  // General compassionate fallback
  return {
    text: `Thank you for sharing that with me, Eleanor. I am here by your side. Remember that you are safe in your home, and today is a peaceful day. If there is anything specific you would like to know about your routine or family, just ask me anytime.`,
    actionSuggestion: { type: "navigate", target: "routine", label: "See Today's Routine" }
  };
}
