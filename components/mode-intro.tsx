"use client"

import { useEffect, useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { useLanguage } from "./language-context"

interface ModeIntroProps {
  mode: "visual" | "innovation"
  onModeChange: (mode: "visual" | "innovation") => void
  onComplete: () => void
}

export function ModeIntro({ mode, onModeChange, onComplete }: ModeIntroProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const animateTimer = setTimeout(() => setIsAnimating(true), 1500)
    const completeTimer = setTimeout(onComplete, 2100)
    return () => {
      clearTimeout(animateTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (isAnimating) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div className="relative z-10">
        <div className="pointer-events-auto">
          <ModeToggle mode={mode} onModeChange={onModeChange} size="large" showLanguage={false} />
        </div>
        <p className="text-center text-muted-foreground mt-4 text-sm animate-pulse">{t.mode.exploreWork}</p>
      </div>
    </div>
  )
}
