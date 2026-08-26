export type Language = "en" | "de"

export const translations = {
  en: {
    nav: {
      home: "Home",
      contact: "Contact",
    },
    visual: {
      letsWorkTogether: "Let's Work Together",
      workTogetherDescription: "Available for photography and videography projects. Get in touch to discuss your vision.",
      contactMe: "Contact Me",
      instagram: "Instagram",
      copyright: "L'exist. All rights reserved.",
    },
    contact: {
      letsConnect: "Let's Connect",
      description: "Available for photography and videography projects. Whether it's capturing stunning landscapes, creating compelling portraits, or producing engaging video content, I'd love to hear about your vision.",
      email: "Email",
      phone: "Phone",
      sendMessage: "Send me a message",
      basedIn: "Based in Switzerland",
      basedInDescription: "Living in the Lucerne area and available for projects across Europe. Open to travel for the right opportunity.",
      backToPortfolio: "Back to Portfolio",
      viewCV: "View CV",
      cvTitle: "Curriculum Vitae",
      close: "Close",
      download: "Download",
    },
    mobile: {
      backToPortfolio: "Back to Portfolio",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      contact: "Kontakt",
    },
    visual: {
      letsWorkTogether: "Lass uns zusammenarbeiten",
      workTogetherDescription: "Verfügbar für Fotografie- und Videografie-Projekte. Kontaktiere mich, um deine Vision zu besprechen.",
      contactMe: "Kontaktiere mich",
      instagram: "Instagram",
      copyright: "L'exist. Alle Rechte vorbehalten.",
    },
    contact: {
      letsConnect: "Lass uns verbinden",
      description: "Verfügbar für Fotografie- und Videografie-Projekte. Ob es darum geht, atemberaubende Landschaften einzufangen, überzeugende Porträts zu erstellen oder ansprechende Videoinhalte zu produzieren - ich würde gerne von deiner Vision hören.",
      email: "E-Mail",
      phone: "Telefon",
      sendMessage: "Nachricht senden",
      basedIn: "Ansässig in der Schweiz",
      basedInDescription: "Wohnhaft in der Region Luzern und verfügbar für Projekte in ganz Europa. Offen für Reisen bei der richtigen Gelegenheit.",
      backToPortfolio: "Zurück zum Portfolio",
      viewCV: "Lebenslauf ansehen",
      cvTitle: "Lebenslauf",
      close: "Schließen",
      download: "Herunterladen",
    },
    mobile: {
      backToPortfolio: "Zurück zum Portfolio",
    },
  },
}

export function getTranslation(lang: Language) {
  return translations[lang]
}
