"use client"

import { useEffect } from "react"
import { X, Download, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-context"

interface CVModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CVModal({ isOpen, onClose }: CVModalProps) {
  const { language, t } = useLanguage()

  // URL encode the file names for spaces
  const cvPath = language === "de" 
    ? "/Loek%20Lutgens%20Lebenslauf.pdf" 
    : "/Loek%20Lutgens%20Resume.pdf"

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
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* PDF Viewer - using object tag for better compatibility */}
        <div className="flex-1 min-h-0 p-4 bg-muted/30">
          <object
            data={cvPath}
            type="application/pdf"
            className="w-full h-full min-h-[60vh] rounded-lg border border-border bg-white"
          >
            {/* Fallback for browsers that can't display PDF inline */}
            <div className="w-full h-full min-h-[60vh] rounded-lg border border-border bg-card flex flex-col items-center justify-center gap-6 p-8">
              <div className="bg-primary/10 p-6 rounded-full">
                <FileText className="h-16 w-16 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{cvName}</h3>
                <p className="text-muted-foreground mb-6">
                  {language === "de" 
                    ? "PDF kann nicht im Browser angezeigt werden" 
                    : "PDF cannot be displayed in browser"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={cvPath} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 w-full sm:w-auto">
                    <ExternalLink className="h-4 w-4" />
                    {language === "de" ? "In neuem Tab öffnen" : "Open in New Tab"}
                  </Button>
                </a>
                <a href={cvPath} download={cvName}>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Download className="h-4 w-4" />
                    {t.contact.download}
                  </Button>
                </a>
              </div>
            </div>
          </object>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row justify-end gap-2">
          <a href={cvPath} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ExternalLink className="h-4 w-4" />
              {language === "de" ? "In neuem Tab öffnen" : "Open in New Tab"}
            </Button>
          </a>
          <a href={cvPath} download={cvName}>
            <Button className="gap-2 w-full sm:w-auto">
              <Download className="h-4 w-4" />
              {t.contact.download}
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
