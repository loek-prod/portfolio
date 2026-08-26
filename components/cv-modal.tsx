"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-context"

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
}

// PNG pages for each language — page 1 always first
const CV_PAGES = {
  en: [
    { src: "/images/cv/resume-1.png", alt: "Loek Lutgens Resume - Page 1" },
    { src: "/images/cv/resume-2.png", alt: "Loek Lutgens Resume - Page 2" },
  ],
  de: [
    { src: "/images/cv/lebenslauf-1.png", alt: "Loek Lutgens Lebenslauf - Seite 1" },
    { src: "/images/cv/lebenslauf-2.png", alt: "Loek Lutgens Lebenslauf - Seite 2" },
  ],
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
  const { language, t } = useLanguage()

  const pages = language === "de" ? CV_PAGES.de : CV_PAGES.en
  const cvPdfPath = language === "de"
    ? "/Loek%20Lutgens%20Lebenslauf.pdf"
    : "/Loek%20Lutgens%20Resume.pdf"
  const cvPdfName = language === "de"
    ? "Loek Lutgens Lebenslauf.pdf"
    : "Loek Lutgens Resume.pdf"

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-background rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — sticky */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-accent/15 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-link" />
            </div>
            <h2 className="text-lg font-semibold">{t.contact.cvTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a href={cvPdfPath} download={cvPdfName}>
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
                <Download className="h-4 w-4" />
                {t.contact.download}
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable PNG pages */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3 bg-muted/30">
          {pages.map((page, i) => (
            <div key={i} className="w-full overflow-hidden rounded-lg border border-border bg-cream shadow-sm">
              <Image
                src={page.src}
                alt={page.alt}
                width={900}
                height={1272}
                className="w-full h-auto block"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Footer with download — always visible on mobile */}
        <div className="px-5 py-3 border-t border-border shrink-0 flex justify-end sm:hidden">
          <a href={cvPdfPath} download={cvPdfName} className="w-full">
            <Button className="gap-2 w-full">
              <Download className="h-4 w-4" />
              {t.contact.download}
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
