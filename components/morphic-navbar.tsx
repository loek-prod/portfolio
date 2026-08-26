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

export function MorphicNavbar() {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between gap-1 rounded-2xl bg-muted/50 p-1 backdrop-blur-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`btn-bubble flex cursor-pointer items-center justify-center px-4 py-2 text-sm md:px-5 md:py-2.5 md:text-base ${
                isActive
                  ? "border-clay/70 bg-clay/20 font-semibold text-foreground"
                  : "text-muted-foreground hover:text-accent"
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
