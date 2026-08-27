"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Passion Projects", href: "/passion-projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
]

export function MorphicNavbar({
  /** Sitting over a hero photo: keep the pills light-on-dark so they stay legible. */
  overlay = false,
}: {
  overlay?: boolean
} = {}) {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-center">
      <div
        className={`flex items-center justify-between gap-1 rounded-2xl p-1 backdrop-blur-sm ${
          overlay ? "bg-scrim/35" : "bg-muted/50"
        }`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              /* rounded-xl overrides .btn-bubble's pill radius so each pill echoes
                 the container's rounded-2xl instead of being fully round. 12px
                 inner vs 16px outer keeps the 4px p-1 gap visually concentric.
                 Wins on specificity because .btn-bubble sits in @layer components. */
              className={`btn-bubble flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm md:px-5 md:py-2.5 md:text-base ${
                overlay
                  ? isActive
                    ? "border-on-image/50 bg-on-image/20 font-semibold text-on-image"
                    : "text-on-image/75 hover:text-on-image"
                  : isActive
                    ? "border-clay/70 bg-clay/20 font-semibold text-foreground"
                    : "text-muted-foreground hover:text-link"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
