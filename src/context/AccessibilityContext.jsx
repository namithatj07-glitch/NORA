import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext(null);

export const TEXT_SIZES = {
  normal: { id: "normal", label: "Standard", desc: "18px comfortable reading" },
  large: { id: "large", label: "Large", desc: "22px easier to see" },
  xlarge: { id: "xlarge", label: "Extra Large", desc: "26px high visibility" }
};

export const CONTRAST_MODES = {
  cream: { id: "cream", label: "Soft Cream & Sage", desc: "Warm, gentle on the eyes" },
  highContrast: { id: "highContrast", label: "High Contrast", desc: "Crisp dark tones for clarity" },
  sepia: { id: "sepia", label: "Warm Linen", desc: "Ultra-soft amber paper tone" }
};

export function AccessibilityProvider({ children }) {
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem("nora_text_size") || "large"; // Default to "large" for older adults
  });

  const [contrastMode, setContrastMode] = useState(() => {
    return localStorage.getItem("nora_contrast_mode") || "cream";
  });

  const [autoReadAloud, setAutoReadAloud] = useState(() => {
    return localStorage.getItem("nora_auto_speech") === "true";
  });

  const [calmMode, setCalmMode] = useState(() => {
    return localStorage.getItem("nora_calm_mode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("nora_text_size", textSize);
    document.documentElement.setAttribute("data-text-size", textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem("nora_contrast_mode", contrastMode);
    document.documentElement.setAttribute("data-theme", contrastMode);
  }, [contrastMode]);

  useEffect(() => {
    localStorage.setItem("nora_auto_speech", String(autoReadAloud));
  }, [autoReadAloud]);

  useEffect(() => {
    localStorage.setItem("nora_calm_mode", String(calmMode));
  }, [calmMode]);

  const value = {
    textSize,
    setTextSize,
    contrastMode,
    setContrastMode,
    autoReadAloud,
    setAutoReadAloud,
    calmMode,
    setCalmMode,
    TEXT_SIZES,
    CONTRAST_MODES
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
