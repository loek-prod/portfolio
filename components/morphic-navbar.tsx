"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "./language-context"

interface MorphicNavbarProps {
  mode: "visual" | "innovation"
  onNavigate?: (id: string) => void
  currentPage?: "home" | "contact"
}

export function MorphicNavbar({ mode, onNavigate, currentPage = "home" }: MorphicNavbarProps) {
  const [activeItem, setActiveItem] = useState("home")
  const { t } = useLanguage()

  // Define nav items based on mode and page
  const getNavItems = () => {
    if (currentPage === "contact") {
      return [
        { id: "home", label: t.nav.home, type: "link", href: "/" },
        { id: "videos", label: t.nav.videos, type: "link", href: "/#videos" },
        { id: "pictures", label: t.nav.pictures, type: "link", href: "/#gallery" },
        { id: "contact", label: t.nav.contact, type: "link", href: "/contact" },
      ]
    }

    if (mode === "visual") {
      return [
        { id: "home", label: t.nav.home, type: "scroll" },
        { id: "videos", label: t.nav.videos, type: "scroll" },
        { id: "gallery", label: t.nav.pictures, type: "scroll" },
        { id: "contact", label: t.nav.contact, type: "link", href: "/contact" },
      ]
    } else {
      return [
        { id: "home", label: t.nav.home, type: "scroll" },
        { id: "projects", label: t.nav.projects, type: "scroll" },
        { id: "about", label: t.nav.about, type: "scroll" },
        { id: "contact", label: t.nav.contact, type: "link", href: "/contact" },
      ]
    }
  }

  const navItems = getNavItems()

  const handleClick = (item: (typeof navItems)[0]) => {
    setActiveItem(item.id)
    if (item.type === "scroll" && onNavigate) {
      onNavigate(item.id)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between gap-1 p-1 rounded-2xl bg-muted/50 backdrop-blur-sm">
        {navItems.map((item, index) => {
          const isActive = activeItem === item.id

          const content = (
            <div
              className={`btn-bubble flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base cursor-pointer ${
                isActive
                  ? "font-semibold text-foreground !bg-white/20 !border-white/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => handleClick(item)}
            >
              {item.label}
            </div>
          )

          if (item.type === "link") {
            return (
              <Link key={item.id} href={item.href || "#"}>
                {content}
              </Link>
            )
          }

          return <div key={item.id}>{content}</div>
        })}
      </div>
    </div>
  )
}
