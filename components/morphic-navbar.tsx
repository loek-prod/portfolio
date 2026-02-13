"use client"

import { useState } from "react"
import Link from "next/link"

interface MorphicNavbarProps {
  mode: "visual" | "innovation"
  onNavigate?: (id: string) => void
  currentPage?: "home" | "contact"
}

export function MorphicNavbar({ mode, onNavigate, currentPage = "home" }: MorphicNavbarProps) {
  const [activeItem, setActiveItem] = useState("home")

  // Define nav items based on mode and page
  const getNavItems = () => {
    if (currentPage === "contact") {
      return [
        { id: "home", label: "Home", type: "link", href: "/" },
        { id: "videos", label: "Videos", type: "link", href: "/#videos" },
        { id: "pictures", label: "Pictures", type: "link", href: "/#gallery" },
        { id: "contact", label: "Contact", type: "link", href: "/contact" },
      ]
    }

    if (mode === "visual") {
      return [
        { id: "home", label: "Home", type: "scroll" },
        { id: "videos", label: "Videos", type: "scroll" },
        { id: "gallery", label: "Pictures", type: "scroll" },
        { id: "contact", label: "Contact", type: "link", href: "/contact" },
      ]
    } else {
      return [
        { id: "home", label: "Home", type: "scroll" },
        { id: "projects", label: "Projects", type: "scroll" },
        { id: "about", label: "About", type: "scroll" },
        { id: "contact", label: "Contact", type: "link", href: "/contact" },
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
      <div className="flex items-center justify-between overflow-hidden rounded-xl bg-muted/50 backdrop-blur-sm">
        {navItems.map((item, index) => {
          const isActive = activeItem === item.id
          const isFirst = index === 0
          const isLast = index === navItems.length - 1
          const prevActive = index > 0 && activeItem === navItems[index - 1].id
          const nextActive = index < navItems.length - 1 && activeItem === navItems[index + 1].id

          const content = (
            <div
              className={`flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base transition-all duration-300 cursor-pointer ${
                isActive
                  ? "mx-2 rounded-xl bg-muted-foreground/20 font-semibold text-foreground"
                  : `text-muted-foreground hover:text-foreground ${
                      (prevActive || isFirst) && "rounded-l-xl"
                    } ${(nextActive || isLast) && "rounded-r-xl"}`
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
