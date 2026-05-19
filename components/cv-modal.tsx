"use client"

import { useEffect } from "react"
import { X, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-context"

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
  const { language, t } = useLanguage()

  const cvPath = language === "de" 
    ? "/Loek Lutgens Lebenslauf.pdf" 
    : "/Loek Lutgens Resume.pdf"

  const cvName = language === "de" 
    ? "Loek Lutgens Lebenslauf.pdf" 
    : "Loek Lutgens Resume.pdf"

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
    }
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div 
        className="relative bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">{t.contact.cvTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a href={cvPath} download={cvName}>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {t.contact.download}
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 min-h-0 p-4">
          <iframe
            src={`${cvPath}#toolbar=0`}
            className="w-full h-full min-h-[60vh] rounded-lg border border-border"
            title={t.contact.cvTitle}
          />
        </div>

        {/* Footer - mobile friendly */}
        <div className="p-4 border-t border-border flex justify-end gap-2 md:hidden">
          <a href={cvPath} download={cvName} className="flex-1">
            <Button className="w-full gap-2">
              <Download className="h-4 w-4" />
              {t.contact.download}
            </Button>
          </a>
          <Button variant="outline" onClick={onClose}>
            {t.contact.close}
          </Button>
        </div>
      </div>
    </div>
  )
}
