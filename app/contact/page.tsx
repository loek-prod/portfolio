"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Instagram, ArrowLeft, Menu, X } from "lucide-react"
import { MorphicNavbar } from "@/components/morphic-navbar"
import { ModeToggle } from "@/components/mode-toggle"

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [siteMode, setSiteMode] = useState<"visual" | "innovation">("visual")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="bg-background shadow-md">
        <div className="flex justify-between items-center p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <Link href="/" className="text-foreground">
            <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">LOEK LUTGENS</h1>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <MorphicNavbar mode={siteMode} currentPage="contact" />
            <div className="h-6 w-px bg-border mx-2" />
            <ModeToggle mode={siteMode} onModeChange={setSiteMode} size="compact" />
          </div>

          <button
            className="md:hidden text-foreground p-3 hover:bg-accent rounded-md transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border shadow-lg">
            <div className="flex flex-col p-4 space-y-3">
              <div className="flex justify-center py-4 border-b border-border mb-2">
                <ModeToggle mode={siteMode} onModeChange={setSiteMode} size="compact" />
              </div>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-foreground hover:bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation">
                  Home
                </button>
              </Link>
              <Link href="/#gallery" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-foreground hover:bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation">
                  Pictures
                </button>
              </Link>
              <Link href="/#videos" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-foreground hover:bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation">
                  Videos
                </button>
              </Link>
              <button className="w-full text-foreground bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation">
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <Link href="/">
          <Button variant="ghost" className="mb-6 md:mb-8 text-foreground hover:bg-accent touch-manipulation">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Profile Image */}
          <div className="relative order-2 md:order-1">
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto md:max-w-none rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/loek-profile.jpg" alt="Loek Lutgens" fill className="object-cover" priority />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 md:space-y-8 order-1 md:order-2">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">Let's Connect</h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Available for photography and videography projects. Whether it's capturing stunning landscapes, creating
                compelling portraits, or producing engaging video content, I'd love to hear about your vision.
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Email */}
              <a
                href="mailto:loeklutgens2@gmail.com"
                className="flex items-center gap-4 p-5 md:p-4 rounded-lg hover:bg-accent transition-colors group touch-manipulation"
              >
                <div className="bg-primary text-primary-foreground p-3 md:p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6 md:h-6 md:w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Email</p>
                  <p className="text-base md:text-lg font-semibold break-all">loeklutgens2@gmail.com</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+31620193058"
                className="flex items-center gap-4 p-5 md:p-4 rounded-lg hover:bg-accent transition-colors group touch-manipulation"
              >
                <div className="bg-primary text-primary-foreground p-3 md:p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 md:h-6 md:w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Phone</p>
                  <p className="text-base md:text-lg font-semibold">+31 6 20193058</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ll_exist/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 md:p-4 rounded-lg hover:bg-accent transition-colors group touch-manipulation"
              >
                <div className="bg-primary text-primary-foreground p-3 md:p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Instagram className="h-6 w-6 md:h-6 md:w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Instagram</p>
                  <p className="text-base md:text-lg font-semibold">@ll_exist</p>
                </div>
              </a>
            </div>

            <div className="pt-4 md:pt-6">
              <a href="mailto:loeklutgens2@gmail.com">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg touch-manipulation"
                >
                  Send me a message
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 md:mt-20 text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Based in the Netherlands</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Working on projects throughout Europe and beyond. Open to travel for the right opportunity.
          </p>
        </div>
      </div>
    </div>
  )
}
