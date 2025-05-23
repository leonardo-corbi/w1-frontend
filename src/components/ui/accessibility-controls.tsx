"use client";

import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export function AccessibilityControls() {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } =
    useAccessibility();

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
      <Button
        variant="outline"
        size="sm"
        onClick={decreaseFontSize}
        disabled={fontSize === "normal"}
        aria-label="Diminuir tamanho da fonte"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={increaseFontSize}
        disabled={fontSize === "x-large"}
        aria-label="Aumentar tamanho da fonte"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={resetFontSize}
        disabled={fontSize === "normal"}
        aria-label="Restaurar tamanho padrão da fonte"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
