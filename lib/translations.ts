export type Language = "en" | "de"

export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      videos: "Videos",
      pictures: "Pictures",
      projects: "Projects",
      about: "About",
      contact: "Contact",
    },
    // Mode toggle
    mode: {
      visual: "Visual",
      innovation: "Innovation",
      exploreWork: "Explore my work",
    },
    // Home page - Visual section
    visual: {
      letsWorkTogether: "Let's Work Together",
      workTogetherDescription: "Available for photography and videography projects. Get in touch to discuss your vision.",
      contactMe: "Contact Me",
      instagram: "Instagram",
      copyright: "L'exist. All rights reserved.",
    },
    // Innovation section
    innovation: {
      title: "Innovation & Projects",
      subtitle: "Beyond visual storytelling, I'm passionate about building innovative solutions and exploring new technologies. Here are some of my ventures.",
      learnMore: "Learn More",
      haveIdea: "Have an idea?",
      haveIdeaDescription: "I'm always looking for exciting new projects and collaborations. Let's build something innovative together.",
      getInTouch: "Get in Touch",
      projects: {
        project1: {
          title: "Project Name 1",
          description: "A brief description of this innovation project. Explain what problem it solves and its impact.",
          role: "Founder & Developer",
        },
        project2: {
          title: "Project Name 2",
          description: "Another innovative project description. Highlight the key features and achievements.",
          role: "Creative Director",
        },
        project3: {
          title: "Project Name 3",
          description: "Description of a technical or business project. What makes it unique?",
          role: "Lead Developer",
        },
        project4: {
          title: "Project Name 4",
          description: "A growth-focused project or business venture. Share the results and learnings.",
          role: "Co-Founder",
        },
      },
    },
    // Contact page
    contact: {
      letsConnect: "Let's Connect",
      description: "Available for photography and videography projects. Whether it's capturing stunning landscapes, creating compelling portraits, or producing engaging video content, I'd love to hear about your vision.",
      email: "Email",
      phone: "Phone",
      sendMessage: "Send me a message",
      basedIn: "Based in the Netherlands",
      basedInDescription: "Working on projects throughout Europe and beyond. Open to travel for the right opportunity.",
      backToPortfolio: "Back to Portfolio",
      viewCV: "View CV",
      cvTitle: "Curriculum Vitae",
      close: "Close",
      download: "Download",
    },
    // Mobile menu
    mobile: {
      backToPortfolio: "Back to Portfolio",
    },
  },
  de: {
    // Navigation
    nav: {
      home: "Startseite",
      videos: "Videos",
      pictures: "Bilder",
      projects: "Projekte",
      about: "Über",
      contact: "Kontakt",
    },
    // Mode toggle
    mode: {
      visual: "Visuell",
      innovation: "Innovation",
      exploreWork: "Entdecke meine Arbeit",
    },
    // Home page - Visual section
    visual: {
      letsWorkTogether: "Lass uns zusammenarbeiten",
      workTogetherDescription: "Verfügbar für Fotografie- und Videografie-Projekte. Kontaktiere mich, um deine Vision zu besprechen.",
      contactMe: "Kontaktiere mich",
      instagram: "Instagram",
      copyright: "L'exist. Alle Rechte vorbehalten.",
    },
    // Innovation section
    innovation: {
      title: "Innovation & Projekte",
      subtitle: "Neben dem visuellen Storytelling begeistere ich mich für die Entwicklung innovativer Lösungen und die Erforschung neuer Technologien. Hier sind einige meiner Unternehmungen.",
      learnMore: "Mehr erfahren",
      haveIdea: "Hast du eine Idee?",
      haveIdeaDescription: "Ich bin immer auf der Suche nach spannenden neuen Projekten und Kooperationen. Lass uns gemeinsam etwas Innovatives aufbauen.",
      getInTouch: "Kontakt aufnehmen",
      projects: {
        project1: {
          title: "Projektname 1",
          description: "Eine kurze Beschreibung dieses Innovationsprojekts. Erkläre, welches Problem es löst und welche Auswirkungen es hat.",
          role: "Gründer & Entwickler",
        },
        project2: {
          title: "Projektname 2",
          description: "Eine weitere innovative Projektbeschreibung. Hebe die wichtigsten Funktionen und Erfolge hervor.",
          role: "Creative Director",
        },
        project3: {
          title: "Projektname 3",
          description: "Beschreibung eines technischen oder geschäftlichen Projekts. Was macht es einzigartig?",
          role: "Lead-Entwickler",
        },
        project4: {
          title: "Projektname 4",
          description: "Ein wachstumsorientiertes Projekt oder Geschäftsvorhaben. Teile die Ergebnisse und Erkenntnisse.",
          role: "Mitgründer",
        },
      },
    },
    // Contact page
    contact: {
      letsConnect: "Lass uns verbinden",
      description: "Verfügbar für Fotografie- und Videografie-Projekte. Ob es darum geht, atemberaubende Landschaften einzufangen, überzeugende Porträts zu erstellen oder ansprechende Videoinhalte zu produzieren - ich würde gerne von deiner Vision hören.",
      email: "E-Mail",
      phone: "Telefon",
      sendMessage: "Nachricht senden",
      basedIn: "Ansässig in den Niederlanden",
      basedInDescription: "Arbeite an Projekten in ganz Europa und darüber hinaus. Offen für Reisen bei der richtigen Gelegenheit.",
      backToPortfolio: "Zurück zum Portfolio",
      viewCV: "Lebenslauf ansehen",
      cvTitle: "Lebenslauf",
      close: "Schließen",
      download: "Herunterladen",
    },
    // Mobile menu
    mobile: {
      backToPortfolio: "Zurück zum Portfolio",
    },
  },
}

export function getTranslation(lang: Language) {
  return translations[lang]
}
