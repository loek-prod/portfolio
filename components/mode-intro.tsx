"use client"

import { useEffect, useState } from "react"
import { ModeToggle } from "./mode-toggle"

interface ModeIntroProps {
  mode: "visual" | "innovation"
  onModeChange: (mode: "visual" | "innovation") => void
  onComplete: () => void
}

export function ModeIntro({ mode, onModeChange, onComplete }: ModeIntroProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Wait 1.5 seconds, then start animation to nav
    const animateTimer = setTimeout(() => {
      setIsAnimating(true)
    }, 1500)

    // After animation completes, hide and call onComplete
    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 2100) // 1.5s delay + 0.6s animation

    return () => {
      clearTimeout(animateTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Centered toggle */}
      <div
        className={`relative z-10 transform transition-all duration-600 ease-out ${
          isAnimating ? "scale-50 -translate-y-[40vh] opacity-0" : "scale-100 translate-y-0 opacity-100"
        }`}
        style={{
          transitionDuration: "600ms",
        }}
      >
        <div className="pointer-events-auto">
          <ModeToggle mode={mode} onModeChange={onModeChange} size="large" />
        </div>
        <p className="text-center text-muted-foreground mt-4 text-sm animate-pulse">Explore my work</p>
      </div>
    </div>
  )
}
