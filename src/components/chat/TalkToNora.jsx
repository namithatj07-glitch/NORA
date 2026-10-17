import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  RotateCcw,
  Volume2,
  HelpCircle,
  MessageSquareHeart,
  Mic,
  Info
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import { chatService } from "../../services/chatService";
import { SUGGESTED_PROMPTS, INITIAL_CHAT_MESSAGES } from "../../data/mockChatResponses";
import { useRoutine } from "../../context/RoutineContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { speechService } from "../../services/speechService";
import { USER_PROFILE } from "../../data/userProfile";

export default function TalkToNora({ onNavigateTab }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("nora_chat_history");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not parse saved chat history:", e);
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { nextActivity, completedCount, totalCount } = useRoutine();
  const { autoReadAloud } = useAccessibility();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem("nora_chat_history", JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not save chat history:", e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      const response = await chatService.sendMessage(text, messages, {
        userName: USER_PROFILE.fullName,
        nextActivity: nextActivity ? nextActivity.title : "All activities completed",
        completedCount,
        totalCount
      });

      const noraMsg = {
        id: `nora-${Date.now()}`,
        sender: "nora",
        text: response.text,
        actionSuggestion: response.actionSuggestion,
        source: response.source,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, noraMsg]);

      if (autoReadAloud) {
        speechService.speak(response.text);
      }
    } catch (error) {
      const errorMsg = {
        id: `nora-error-${Date.now()}`,
        sender: "nora",
        text: "I am right here with you, Eleanor. Take a gentle breath. You can also view your Daily Routine or call Sarah whenever you'd like.",
        timestamp: "Now"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    speechService.stop();
    setMessages(INITIAL_CHAT_MESSAGES);
    sessionStorage.removeItem("nora_chat_history");
  };

  return (
    <div className="talk-to-nora-view" role="region" aria-label="Talk to NORA Chat Screen">
      {/* Title Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "var(--font-3xl)", marginBottom: "4px" }}>
              Talk to NORA
            </h1>
            <p style={{ fontSize: "var(--font-base)", color: "var(--text-secondary)", margin: 0 }}>
              Your compassionate, patient assistant. Ask anything without worry.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleResetChat}
              className="btn btn-secondary"
              style={{ borderRadius: "var(--radius-full)", padding: "10px 18px", fontSize: "var(--font-sm)" }}
              title="Start a fresh conversation"
            >
              <RotateCcw size={16} />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="chat-window">
        {/* Messages Feed */}
        <div className="chat-messages-container" role="log" aria-live="polite">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onNavigateTab={onNavigateTab}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble-row nora">
              <div className="chat-avatar nora-avatar">N</div>
              <div className="chat-bubble nora" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>NORA is thinking with care</span>
                <span className="dot-flashing" style={{ display: "inline-flex", gap: "4px" }}>
                  <span>•</span><span>•</span><span>•</span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="suggested-prompts-bar" aria-label="Suggested questions you can ask">
          <span style={{ fontSize: "var(--font-xs)", color: "var(--text-muted)", alignSelf: "center", fontWeight: 600 }}>
            Quick questions:
          </span>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSendMessage(prompt.query)}
              className="prompt-chip"
              disabled={isTyping}
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="chat-input-bar">
          <input
            ref={inputRef}
            type="text"
            className="chat-text-input"
            placeholder="Type your question here, or tap a quick question above..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            aria-label="Ask NORA a question"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() || isTyping}
            className="btn btn-primary"
            style={{ minWidth: "120px" }}
            aria-label="Send message to NORA"
          >
            <Send size={20} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
