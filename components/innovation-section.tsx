"use client"

import { Hammer } from "lucide-react"
import { useLanguage } from "./language-context"

export function InnovationSection() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Hammer className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{t.innovation.title}</h2>
        <p className="text-lg text-muted-foreground text-pretty">
          Work in progress — there&apos;s nothing to show here yet. Check back soon.
        </p>
      </div>
    </div>
  )
}
