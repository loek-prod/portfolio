"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { PhotoSlider } from "@/components/photo-slider"
import { VideoSlider } from "@/components/video-slider"
import { Lightbox } from "@/components/lightbox"
import { RollingText } from "@/components/rolling-text"
import { LoadingScreen } from "@/components/loading-screen"
import { ModeToggle } from "@/components/mode-toggle"
import { ModeIntro } from "@/components/mode-intro"
import { InnovationSection } from "@/components/innovation-section"

const photos = [
  {
    src: "/images/photo5.jpg",
    alt: "Macro photography of textured green leaves",
    category: "Macro",
  },
  {
    src: "/images/photo-architecture1.jpg",
    alt: "Vibrant blue architecture with cacti",
    category: "Architecture",
  },
  {
    src: "/images/photo-pattern.jpg",
    alt: "Ornate decorative circular pattern",
    category: "Detail",
  },
  {
    src: "/images/photo-architecture2.jpg",
    alt: "Vibrant blue architecture with yellow accents",
    category: "Architecture",
  },
  {
    src: "/images/photo-portrait.jpg",
    alt: "Portrait of woman on European street",
    category: "Portrait",
  },
  {
    src: "/images/photo-monkey.jpg",
    alt: "Wildlife photography of monkey on beach",
    category: "Wildlife",
  },
  {
    src: "/images/photo-bridge.jpg",
    alt: "Aerial view of railway bridge",
    category: "Aerial",
  },
  {
    src: "/images/photo-car.jpg",
    alt: "Vintage Mercedes-Benz automotive photography",
    category: "Automotive",
  },
  {
    src: "/images/photo-car-mural.jpg",
    alt: "Car and street art in urban setting",
    category: "Street",
  },
  {
    src: "/images/photo-boat-aerial.jpg",
    alt: "Aerial view of boat and swimmers",
    category: "Aerial",
  },
  {
    src: "/images/photo-terrace-portrait.jpg",
    alt: "Portrait on coastal terrace",
    category: "Portrait",
  },
  {
    src: "/images/photo-alley.jpg",
    alt: "European alley through architectural frame",
    category: "Street",
  },
  {
    src: "/images/photo-laundry.jpg",
    alt: "Building facade with laundry",
    category: "Street",
  },
  {
    src: "/images/photo-palace.jpg",
    alt: "Palace interior with ornate golden ceiling",
    category: "Architecture",
  },
  {
    src: "/images/photo-yellow-coast.jpg",
    alt: "Coastal scene with boats",
    category: "Landscape",
  },
  {
    src: "/images/photo-marrakesh.jpg",
    alt: "Architectural portrait in Marrakesh",
    category: "Portrait",
  },
  {
    src: "/images/photo-street-scene.jpg",
    alt: "Street photography scene",
    category: "Street",
  },
  {
    src: "/images/photo-workers.jpg",
    alt: "Construction workers street scene",
    category: "Street",
  },
  {
    src: "/images/photo3.jpg",
    alt: "Mountain landscape with misty peaks",
    category: "Landscape",
  },
]

const videos = [
  {
    id: "2X-7H1_Nz94",
    title: "",
  },
  {
    id: "fcNs7xLVLB4",
    title: "",
  },
  {
    id: "EFuZUPn6Pfw",
    title: "",
  },
  {
    id: "VGCzEnAJiQ0",
    title: "",
  },
  {
    id: "G_N6h50NA_k",
    title: "",
  },
]

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(false)
  const [showModeIntro, setShowModeIntro] = useState(false)
  const [siteMode, setSiteMode] = useState<"visual" | "innovation">("visual")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = [
    "All",
    "Landscape",
    "Architecture",
    "Portrait",
    "Wildlife",
    "Macro",
    "Detail",
    "Aerial",
    "Automotive",
    "Street",
  ]

  const filteredPhotos =
    selectedCategory === "All" ? photos : photos.filter((photo) => photo.category === selectedCategory)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setShowModeIntro(true)
    sessionStorage.setItem("hasSeenLoading", "true")
  }

  useEffect(() => {
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading")
    if (!hasSeenLoading) {
      setIsLoading(true)
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen photos={photos} onComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-background">
      {showModeIntro && (
        <ModeIntro mode={siteMode} onModeChange={setSiteMode} onComplete={() => setShowModeIntro(false)} />
      )}

      <header id="home" className="relative h-[60vh] overflow-hidden">
        <nav className="absolute top-0 left-0 right-0 z-20 bg-background shadow-md">
          <div className="flex justify-between items-center p-6 md:p-8">
            <div className="text-foreground">
              <h1 className="text-2xl md:text-3xl font-bold">LOEK LUTGENS</h1>
            </div>
            <div className="hidden md:flex gap-6 items-center">
              <button
                onClick={() => scrollToSection("home")}
                className="nav-link text-foreground hover:bg-accent px-4 py-2 rounded-md transition-colors"
              >
                <RollingText text="Home" />
              </button>
              {siteMode === "visual" ? (
                <>
                  <button
                    onClick={() => scrollToSection("videos")}
                    className="nav-link text-foreground hover:bg-accent px-4 py-2 rounded-md transition-colors"
                  >
                    <RollingText text="Videos" />
                  </button>
                  <button
                    onClick={() => scrollToSection("gallery")}
                    className="nav-link text-foreground hover:bg-accent px-4 py-2 rounded-md transition-colors"
                  >
                    <RollingText text="Pictures" />
                  </button>
                </>
              ) : (
                <>
                  {/* Placeholder buttons to maintain spacing */}
                  <button
                    onClick={() => scrollToSection("projects")}
                    className="nav-link text-foreground hover:bg-accent px-4 py-2 rounded-md transition-colors"
                  >
                    <RollingText text="Projects" />
                  </button>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="nav-link text-foreground hover:bg-accent px-4 py-2 rounded-md transition-colors"
                  >
                    <RollingText text="About" />
                  </button>
                </>
              )}
              <Link href="/contact">
                <button className="nav-link text-foreground hover:bg-accent px-4 py-2 rounded-md transition-colors">
                  <RollingText text="Contact" />
                </button>
              </Link>
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
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-foreground hover:bg-accent px-4 py-3 rounded-md transition-colors text-left"
                >
                  Home
                </button>
                {siteMode === "visual" && (
                  <>
                    <button
                      onClick={() => scrollToSection("videos")}
                      className="text-foreground hover:bg-accent px-4 py-3 rounded-md transition-colors text-left"
                    >
                      Videos
                    </button>
                    <button
                      onClick={() => scrollToSection("gallery")}
                      className="text-foreground hover:bg-accent px-4 py-3 rounded-md transition-colors text-left"
                    >
                      Pictures
                    </button>
                  </>
                )}
                <Link href="/contact">
                  <button className="w-full text-foreground hover:bg-accent px-4 py-3 rounded-md transition-colors text-left">
                    Contact
                  </button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-zoom-fade"
          style={{
            backgroundImage: `url('/images/photo3.jpg')`,
          }}
        ></div>
      </header>

      <div className="relative">
        <div
          className={`transition-all duration-500 ease-out ${
            siteMode === "visual"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
          }`}
        >
          <section id="videos" className="-mt-8 md:-mt-12 pt-24 md:pt-32 bg-primary">
            <VideoSlider videos={videos} />
          </section>

          <section
            id="gallery"
            className="relative bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('/images/section-background.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <PhotoSlider photos={filteredPhotos} />
            </div>
          </section>

          <section className="py-20 px-4 md:px-8 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Available for photography and videography projects. Get in touch to discuss your vision.
              </p>

              <div className="flex justify-center gap-6 mb-12">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-background/20 text-primary-foreground border border-border hover:bg-background/30 rounded-full px-8"
                  >
                    Contact Me
                  </Button>
                </Link>
                <a href="https://www.instagram.com/ll_exist/" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-background/20 text-primary-foreground border border-border hover:bg-background/30 rounded-full px-8"
                  >
                    Instagram
                  </Button>
                </a>
              </div>

              <div className="border-t border-border pt-8">
                <p className="text-muted-foreground">© {new Date().getFullYear()} Loek Lutgens. All rights reserved.</p>
              </div>
            </div>
          </section>
        </div>

        <div
          className={`transition-all duration-500 ease-out ${
            siteMode === "innovation"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none absolute inset-0"
          }`}
        >
          <InnovationSection />
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox images={filteredPhotos} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  )
}
