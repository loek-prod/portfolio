"use client"

import { useLanguage } from "./language-context"
import { LanguageDropdown } from "./language-dropdown"

interface ModeToggleProps {
  mode: "visual" | "innovation"
  onModeChange: (mode: "visual" | "innovation") => void
  size?: "large" | "compact"
  showLanguage?: boolean
}

export function ModeToggle({ mode, onModeChange, size = "compact", showLanguage = true }: ModeToggleProps) {
  const isLarge = size === "large"
  const { t } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <div className={`relative flex items-center bg-muted rounded-full ${isLarge ? "p-1.5 gap-1" : "p-1 gap-0.5"}`}>
        {/* Visual button */}
        <button
          onClick={() => onModeChange("visual")}
          className={`relative font-medium rounded-full transition-all duration-300 ${
            isLarge ? "px-6 py-3 text-lg" : "px-4 py-1.5 text-sm"
          } ${mode === "visual" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
        >
          {t.mode.visual}
        </button>

        {/* Innovation button */}
        <button
          onClick={() => onModeChange("innovation")}
          className={`relative font-medium rounded-full transition-all duration-300 ${
            isLarge ? "px-6 py-3 text-lg" : "px-4 py-1.5 text-sm"
          } ${mode === "innovation" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
        >
          {t.mode.innovation}
        </button>
      </div>
      {showLanguage && !isLarge && <LanguageDropdown />}
    </div>
  )
}
