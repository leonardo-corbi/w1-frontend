"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large" | "x-large";

interface AccessibilityContextType {
  fontSize: FontSize;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontSize, setFontSize] = useState<FontSize>("normal");

  // Carregar preferência do usuário ao iniciar
  useEffect(() => {
    const savedFontSize = localStorage.getItem("accessibility-font-size");
    if (
      savedFontSize &&
      ["normal", "large", "x-large"].includes(savedFontSize)
    ) {
      setFontSize(savedFontSize as FontSize);
    }
  }, []);

  // Salvar preferência quando mudar
  useEffect(() => {
    localStorage.setItem("accessibility-font-size", fontSize);
    // Adicionar classe ao body para permitir estilos globais
    document.body.dataset.fontSize = fontSize;
    //   }, [fontSize])
    console.log("body[data-font-size]:", document.body.dataset.fontSize);
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize((current) => {
      if (current === "normal") return "large";
      if (current === "large") return "x-large";
      return current;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((current) => {
      if (current === "x-large") return "large";
      if (current === "large") return "normal";
      return current;
    });
  };

  const resetFontSize = () => {
    setFontSize("normal");
  };

  return (
    <AccessibilityContext.Provider
      value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
}
