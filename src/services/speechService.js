/**
 * Speech Service (Text-to-Speech)
 * 
 * Provides accessible, slow, gentle audio reading of text using
 * the standard browser SpeechSynthesis API. Completely client-side,
 * zero external dependencies, with safe fallbacks.
 */

class SpeechService {
  constructor() {
    this.isAvailable = typeof window !== "undefined" && "speechSynthesis" in window;
    this.speakingId = null;
  }

  isSupported() {
    return this.isAvailable;
  }

  speak(text, onEndCallback = null, rate = 0.88, pitch = 1.0) {
    if (!this.isAvailable || !text) return false;

    // Stop any ongoing speech first
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_~]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate; // Slightly slower, calm cadence
    utterance.pitch = pitch;

    // Select a pleasant English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Zira"))
    ) || voices.find((v) => v.lang.startsWith("en"));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      this.speakingId = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.speakingId = null;
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  stop() {
    if (this.isAvailable) {
      window.speechSynthesis.cancel();
      this.speakingId = null;
    }
  }

  isSpeaking() {
    return this.isAvailable && window.speechSynthesis.speaking;
  }
}

export const speechService = new SpeechService();
