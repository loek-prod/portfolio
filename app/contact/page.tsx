"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Instagram, ArrowLeft, Menu, X } from "lucide-react"
import { RollingText } from "@/components/rolling-text"
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
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">LOEK LUTGENS</h1>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/">
              <button className="nav-link text-foreground hover:bg-accent px-3 py-2 rounded-md transition-colors">
                <RollingText text="Home" />
              </button>
            </Link>
            <Link href="/#gallery">
              <button className="nav-link text-foreground hover:bg-accent px-3 py-2 rounded-md transition-colors">
                <RollingText text="Pictures" />
              </button>
            </Link>
            <Link href="/#videos">
              <button className="nav-link text-foreground hover:bg-accent px-3 py-2 rounded-md transition-colors">
                <RollingText text="Videos" />
              </button>
            </Link>
            <button className="nav-link text-foreground bg-accent px-3 py-2 rounded-md transition-colors">
              <RollingText text="Contact" />
            </button>
            <div className="h-6 w-px bg-border mx-2" />
            <ModeToggle mode={siteMode} onModeChange={setSiteMode} size="compact" />
          </div>

          <button
            className="md:hidden text-foreground p-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border shadow-lg">
            <div className="flex flex-col p-4 space-y-2">
              <div className="flex justify-center py-3 border-b border-border mb-2">
                <ModeToggle mode={siteMode} onModeChange={setSiteMode} size="compact" />
              </div>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-foreground hover:bg-accent px-4 py-3 rounded-md transition-colors text-left">
                  Home
                </button>
              </Link>
              <Link href="/#gallery" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-foreground hover:bg-accent px-4 py-3 rounded-md transition-colors text-left">
                  Pictures
                </button>
              </Link>
              <Link href="/#videos" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-foreground hover:bg-accent px-4 py-3 rounded-md transition-colors text-left">
                  Videos
                </button>
              </Link>
              <button className="w-full text-foreground bg-accent px-4 py-3 rounded-md transition-colors text-left">
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-foreground hover:bg-accent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/loek-profile.jpg" alt="Loek Lutgens" fill className="object-cover" priority />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">Let's Connect</h1>
              <p className="text-xl text-muted-foreground">
                Available for photography and videography projects. Whether it's capturing stunning landscapes, creating
                compelling portraits, or producing engaging video content, I'd love to hear about your vision.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <a
                href="mailto:loeklutgens2@gmail.com"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="bg-primary text-primary-foreground p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Email</p>
                  <p className="text-lg font-semibold">loeklutgens2@gmail.com</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+31620193058"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="bg-primary text-primary-foreground p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Phone</p>
                  <p className="text-lg font-semibold">+31 6 20193058</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ll_exist/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors group"
              >
                <div className="bg-primary text-primary-foreground p-3 rounded-full group-hover:scale-110 transition-transform">
                  <Instagram className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Instagram</p>
                  <p className="text-lg font-semibold">@ll_exist</p>
                </div>
              </a>
            </div>

            <div className="pt-6">
              <a href="mailto:loeklutgens2@gmail.com">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
                >
                  Send me a message
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Based in the Netherlands</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Working on projects throughout Europe and beyond. Open to travel for the right opportunity.
          </p>
        </div>
      </div>
    </div>
  )
}
