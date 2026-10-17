/**
 * NORA API Service Module
 * 
 * Cleanly decouples frontend UI from the Python / Gemma backend service.
 * Supports configurable base URL, error handling, health checks, and automatic
 * graceful fallback to local compassionate responses when the backend is offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK_CHAT === "true";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  forceMock: FORCE_MOCK
};

/**
 * Health check to verify if the Python / Gemma backend is online.
 * @returns {Promise<{ isOnline: boolean, details?: any, error?: string }>}
 */
export async function checkBackendStatus() {
  if (FORCE_MOCK) {
    return {
      isOnline: false,
      mode: "local_mock",
      message: "Configured for local mock mode (VITE_USE_MOCK_CHAT=true)"
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        isOnline: true,
        mode: "backend_live",
        details: data,
        message: "Connected to Python/Gemma backend"
      };
    } else {
      return {
        isOnline: false,
        mode: "local_mock",
        error: `Server responded with status ${response.status}`,
        message: "Backend returned an error. Using local mock responses."
      };
    }
  } catch (err) {
    return {
      isOnline: false,
      mode: "local_mock",
      error: err.name === "AbortError" ? "Connection timed out" : err.message,
      message: "Python backend is currently offline. Using local mock responses."
    };
  }
}

/**
 * Sends a message to the backend chat endpoint (/api/chat).
 * If the server is offline or fails, throws an error with instructions
 * so the caller can switch to the local mock seamlessly.
 *
 * @param {string} userMessage - The patient/caregiver query.
 * @param {Array} history - Previous messages in conversation.
 * @param {Object} context - Optional patient context (e.g. routine status, location).
 * @returns {Promise<{ text: string, actionSuggestion?: Object, source: 'backend' }>}
 */
export async function postChatMessageToBackend(userMessage, history = [], context = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        history: history.slice(-6).map((m) => ({
          role: m.sender === "nora" ? "assistant" : "user",
          content: m.text
        })),
        context: {
          userName: context.userName || "Eleanor Vance",
          nextActivity: context.nextActivity || "",
          currentTime: new Date().toISOString()
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Backend error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.reply || data.text || data.message || "I am right here with you.",
      actionSuggestion: data.actionSuggestion || null,
      source: "backend"
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
