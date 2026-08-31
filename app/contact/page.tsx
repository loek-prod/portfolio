"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Instagram, ArrowLeft, FileText } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { useLanguage } from "@/components/language-context"
import { CVModal } from "@/components/cv-modal"

export default function ContactPage() {
  const [cvModalOpen, setCvModalOpen] = useState(false)
  const { t } = useLanguage()

  // Plain rows: no box, no border, no rounded container. Just a small icon,
  // a muted label and the value in primary text.
  const linkClasses = "group flex w-full items-center gap-4 py-3 text-left"
  // Small bare icon — no filled or outlined circle behind it.
  const iconClasses = "shrink-0 text-link transition-transform group-hover:scale-110"

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPath="/contact" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-foreground hover:bg-earth md:mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.contact.backToPortfolio}
          </Button>
        </Link>

        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="order-2 md:order-1">
            {/* Square corners, no border, no shadow. object-contain shows the
                photo exactly as uploaded — object-cover was cropping into it.
                bg-background on the frame itself means any letterboxing that
                contain leaves is the page's own cream, not the browser's
                default white/transparent showing through. */}
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden bg-background md:max-w-none">
              <Image
                src="/images/loek-profile-2026.jpg"
                alt="Loek Lutgens"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="order-1 space-y-6 md:order-2 md:space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-link">Contact</p>
              <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.95] text-foreground md:text-6xl lg:text-7xl">
                {t.contact.letsConnect}
              </h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t.contact.description}
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <a href="mailto:loeklutgens2@gmail.com" className={linkClasses}>
                <div className={iconClasses}>
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{t.contact.email}</p>
                  <p className="break-all text-base font-semibold text-foreground md:text-lg">
                    loeklutgens2@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/ll_exist/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                <div className={iconClasses}>
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instagram</p>
                  <p className="text-base font-semibold text-foreground md:text-lg">@ll_exist</p>
                </div>
              </a>

              <button type="button" onClick={() => setCvModalOpen(true)} className={linkClasses}>
                <div className={iconClasses}>
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.contact.cvTitle}</p>
                  <p className="text-base font-semibold text-foreground md:text-lg">{t.contact.viewCV}</p>
                </div>
              </button>
            </div>

            <div className="pt-2 md:pt-4">
              <a href="mailto:loeklutgens2@gmail.com">
                <Button
                  size="lg"
                  className="btn-bubble btn-bubble--solid w-full px-8 py-6 text-lg text-primary-foreground md:w-auto"
                >
                  {t.contact.sendMessage}
                </Button>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Dark treatment instead of a rule — the change of background separates it. */}
      <section className="section-dark w-full py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-8">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">{t.contact.basedIn}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.contact.basedInDescription}
          </p>
        </div>
      </section>

      <CVModal isOpen={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </main>
  )
}
