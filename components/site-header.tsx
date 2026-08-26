"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { MorphicNavbar, navItems } from "@/components/morphic-navbar"

export function SiteHeader({
  currentPath,
  /** Float the header over a hero image instead of sitting on the page background. */
  overlay = false,
}: {
  currentPath: string
  overlay?: boolean
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"
          : "sticky top-0 z-30 border-b border-clay/40 bg-background"
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 p-4 md:p-6 lg:px-8">
        <Link href="/" aria-label="L'exist home">
          <Image
            src="/images/lexist-logo.png"
            alt="L'exist"
            width={150}
            height={45}
            className="h-auto w-[100px] md:w-[120px] lg:w-[150px]"
            priority
          />
        </Link>
        <div className="hidden md:block">
          <MorphicNavbar />
        </div>
        <button
          className="touch-manipulation rounded-md p-3 text-foreground transition-colors hover:bg-earth md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="border-t border-clay/40 bg-background shadow-lg md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-5 py-4 text-lg transition-colors ${
                  item.href === currentPath
                    ? "bg-earth text-foreground"
                    : "text-foreground hover:bg-earth hover:text-link"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
