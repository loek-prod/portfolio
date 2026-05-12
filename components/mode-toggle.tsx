"use client"

interface ModeToggleProps {
  mode: "visual" | "innovation"
  onModeChange: (mode: "visual" | "innovation") => void
  size?: "large" | "compact"
}

export function ModeToggle({ mode, onModeChange, size = "compact" }: ModeToggleProps) {
  const isLarge = size === "large"

  return (
    <div className={`relative flex items-center bg-muted rounded-full ${isLarge ? "p-1.5 gap-1" : "p-1 gap-0.5"}`}>
      {/* Visual button */}
      <button
        onClick={() => onModeChange("visual")}
        className={`relative font-medium rounded-full transition-all duration-300 ${
          isLarge ? "px-6 py-3 text-lg" : "px-4 py-1.5 text-sm"
        } ${mode === "visual" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
      >
        Visual
      </button>

      {/* Innovation button */}
      <button
        onClick={() => onModeChange("innovation")}
        className={`relative font-medium rounded-full transition-all duration-300 ${
          isLarge ? "px-6 py-3 text-lg" : "px-4 py-1.5 text-sm"
        } ${mode === "innovation" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"}`}
      >
        Innovation
      </button>
    </div>
  )
}
