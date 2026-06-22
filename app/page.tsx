"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { PhotoGallery3D } from "@/components/photo-gallery-3d"
import { VideoSlider } from "@/components/video-slider"
import { Lightbox } from "@/components/lightbox"
import { LoadingScreen } from "@/components/loading-screen"
import { ModeToggle } from "@/components/mode-toggle"
import { ModeIntro } from "@/components/mode-intro"
import { InnovationSection } from "@/components/innovation-section"
import { MorphicNavbar } from "@/components/morphic-navbar"
import { VideoFilter } from "@/components/video-filter"
import { useLanguage } from "@/components/language-context"

// Sorted by orientation: horizontal/landscape/panoramic first, then vertical/portrait last.
// This ensures that when viewing a horizontal image, cards stacked behind are also horizontal (same width).
// When viewing vertical images at the end, cards behind are also vertical (narrower).
// This prevents wider cards from poking out behind narrower cards.
const photos = [
  // Panoramic photos first (extra wide, >2:1 ratio)
  {
    src: "/images/photo-bridge.jpg",
    alt: "Aerial view of railway bridge",
    category: "Aerial",
    aspectRatio: "panoramic" as const,
  },
  {
    src: "/images/photo-boat-aerial.jpg",
    alt: "Aerial view of boat and swimmers",
    category: "Aerial",
    aspectRatio: "panoramic" as const,
  },
  // Landscape photos second (standard horizontal, 3:2 or 16:9)
  {
    src: "/images/photo5.jpg",
    alt: "Macro photography of textured green leaves",
    category: "Macro",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-architecture1.jpg",
    alt: "Vibrant blue architecture with cacti",
    category: "Architecture",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-pattern.jpg",
    alt: "Ornate decorative circular pattern",
    category: "Detail",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-architecture2.jpg",
    alt: "Vibrant blue architecture with yellow accents",
    category: "Architecture",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-monkey.jpg",
    alt: "Wildlife photography of monkey on beach",
    category: "Wildlife",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-car.jpg",
    alt: "Vintage Mercedes-Benz automotive photography",
    category: "Automotive",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-car-mural.jpg",
    alt: "Car and street art in urban setting",
    category: "Street",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-palace.jpg",
    alt: "Palace interior with ornate golden ceiling",
    category: "Architecture",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-yellow-coast.jpg",
    alt: "Coastal scene with boats",
    category: "Landscape",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-street-scene.jpg",
    alt: "Street photography scene",
    category: "Street",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo-workers.jpg",
    alt: "Construction workers street scene",
    category: "Street",
    aspectRatio: "landscape" as const,
  },
  {
    src: "/images/photo3.jpg",
    alt: "Mountain landscape with misty peaks",
    category: "Landscape",
    aspectRatio: "landscape" as const,
  },
  // Portrait photos last (vertical orientation)
  {
    src: "/images/photo-portrait.jpg",
    alt: "Portrait of woman on European street",
    category: "Portrait",
    aspectRatio: "portrait" as const,
  },
  {
    src: "/images/photo-terrace-portrait.jpg",
    alt: "Portrait on coastal terrace",
    category: "Portrait",
    aspectRatio: "portrait" as const,
  },
  {
    src: "/images/photo-alley.jpg",
    alt: "European alley through architectural frame",
    category: "Street",
    aspectRatio: "portrait" as const,
  },
  {
    src: "/images/photo-laundry.jpg",
    alt: "Building facade with laundry",
    category: "Street",
    aspectRatio: "portrait" as const,
  },
  {
    src: "/images/photo-marrakesh.jpg",
    alt: "Architectural portrait in Marrakesh",
    category: "Portrait",
    aspectRatio: "portrait" as const,
  },
]

const videos = [
  // Corporate
  {
    id: "yIeWBFi1t4c",
    title: "",
    portrait: false,
    category: "Corporate",
  },
  {
    id: "VGCzEnAJiQ0",
    title: "",
    portrait: false,
    category: "Corporate",
  },
  {
    id: "2X-7H1_Nz94",
    title: "",
    portrait: false,
    category: "Corporate",
  },
  {
    id: "G_N6h50NA_k",
    title: "",
    portrait: false,
    category: "Corporate",
  },
  {
    id: "RU18Qln-Xvo",
    title: "",
    portrait: false,
    category: "Corporate",
  },
  {
    id: "PhP4les8tj8",
    title: "",
    portrait: false,
    category: "Corporate",
  },
  // AI Films
  {
    id: "Y6I4mEgfGM0",
    title: "",
    portrait: true,
    category: "AI Films",
  },
  {
    id: "-V9JmMuPD8M",
    title: "",
    portrait: true,
    category: "AI Films",
  },
  {
    id: "L8oyrBfeTM4",
    title: "",
    portrait: false,
    category: "AI Films",
  },
  // Stories
  {
    id: "R87DgrzpIrE",
    title: "",
    portrait: false,
    category: "Stories",
  },
  {
    id: "MIV0ZJXb2j0",
    title: "",
    portrait: false,
    category: "Stories",
  },
  {
    id: "u-5Frj2SZ-0",
    title: "",
    portrait: true,
    category: "Stories",
  },
  {
    id: "QI_jcTsU46U",
    title: "",
    portrait: false,
    category: "Stories",
  },
  {
    id: "ZQJp0i4v4rg",
    title: "",
    portrait: false,
    category: "Stories",
  },
]

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(false)
  const [showModeIntro, setShowModeIntro] = useState(false)
  const [siteMode, setSiteMode] = useState<"visual" | "innovation">("visual")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedVideoCategory, setSelectedVideoCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

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

  const videoCategories = ["All", "Corporate", "AI Films", "Stories"]

  // For the "All" view, order videos by: Stories first, then Corporate, then AI Films.
  // Array.prototype.sort is stable, so the relative order within each category is preserved.
  const allVideoCategoryOrder = ["Stories", "Corporate", "AI Films"]
  const allVideosOrdered = [...videos].sort(
    (a, b) => allVideoCategoryOrder.indexOf(a.category) - allVideoCategoryOrder.indexOf(b.category),
  )

  const filteredVideos =
    selectedVideoCategory === "All"
      ? allVideosOrdered
      : videos.filter((video) => video.category === selectedVideoCategory)

  // For the photo gallery, order by orientation: standard landscape (16:9 / wide screen ratios) first,
  // then panoramic landscape, then upright/portrait last.
  // Stable sort preserves the existing relative order within each group, so the 3D effect is unaffected.
  const orientationRank = (aspectRatio?: "panoramic" | "landscape" | "portrait") => {
    if (aspectRatio === "portrait") return 2
    if (aspectRatio === "panoramic") return 1
    return 0 // landscape (16:9 / wide screen options) first
  }
  const orientationOrderedPhotos = [...photos].sort(
    (a, b) => orientationRank(a.aspectRatio) - orientationRank(b.aspectRatio),
  )

  const filteredPhotos =
    selectedCategory === "All"
      ? orientationOrderedPhotos
      : orientationOrderedPhotos.filter((photo) => photo.category === selectedCategory)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setMobileMenuOpen(false)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setShowModeIntro(true)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasSeenLoading", "true")
    }
  }

  useEffect(() => {
    setMounted(true)
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading")
    if (!hasSeenLoading) {
      setIsLoading(true)
    }
  }, [])

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return <LoadingScreen photos={photos} onComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-background">
      {showModeIntro && (
        <ModeIntro mode={siteMode} onModeChange={setSiteMode} onComplete={() => setShowModeIntro(false)} />
      )}

      <header id="home" className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <nav className="absolute top-0 left-0 right-0 z-20 bg-background shadow-md">
          <div className="flex justify-between items-center p-4 md:p-6 lg:p-8">
            <div className="text-foreground">
              <Image
                src="/images/lexist-logo.png"
                alt="L'exist"
                width={150}
                height={45}
                className="w-[100px] md:w-[120px] lg:w-[150px] h-auto"
                priority
              />
            </div>
            <div className="hidden md:flex gap-6 items-center">
              <MorphicNavbar mode={siteMode} onNavigate={scrollToSection} currentPage="home" />
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
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-foreground hover:bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation"
                >
                  {t.nav.home}
                </button>
                {siteMode === "visual" && (
                  <>
                    <button
                      onClick={() => scrollToSection("videos")}
                      className="text-foreground hover:bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation"
                    >
                      {t.nav.videos}
                    </button>
                    <button
                      onClick={() => scrollToSection("gallery")}
                      className="text-foreground hover:bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation"
                    >
                      {t.nav.pictures}
                    </button>
                  </>
                )}
                <Link href="/contact">
                  <button className="w-full text-foreground hover:bg-accent px-5 py-4 rounded-md transition-colors text-left text-lg touch-manipulation">
                    {t.nav.contact}
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

      <div className="relative" style={{ minHeight: siteMode === "visual" ? "auto" : undefined }}>
        <div
          className={`transition-all duration-500 ease-out ${
            siteMode === "visual"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none absolute inset-x-0 top-0"
          }`}
        >
          <section id="videos" className="bg-primary">
            <VideoSlider 
              videos={filteredVideos} 
              key={selectedVideoCategory}
              filterComponent={
                <VideoFilter
                  categories={videoCategories}
                  selectedCategory={selectedVideoCategory}
                  onCategoryChange={setSelectedVideoCategory}
                />
              }
            />
          </section>

          <section id="gallery" className="relative">
            <PhotoGallery3D photos={filteredPhotos} onOpenLightbox={openLightbox} />
          </section>

          <section className="py-12 md:py-20 px-4 md:px-8 bg-primary text-primary-foreground">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">{t.visual.letsWorkTogether}</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto px-4">
                {t.visual.workTogetherDescription}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 md:mb-12 px-4">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-background/20 text-primary-foreground border border-border hover:bg-background/30 rounded-full px-8 py-6 text-lg touch-manipulation"
                  >
                    {t.visual.contactMe}
                  </Button>
                </Link>
                <a
                  href="https://www.instagram.com/ll_exist/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-background/20 text-primary-foreground border border-border hover:bg-background/30 rounded-full px-8 py-6 text-lg touch-manipulation"
                  >
                    {t.visual.instagram}
                  </Button>
                </a>
              </div>

              <div className="border-t border-border pt-8">
                <p className="text-sm md:text-base text-muted-foreground">
                  © {new Date().getFullYear()} {t.visual.copyright}
                </p>
                <p className="text-xs text-muted-foreground/50 mt-2">
                  v124
                </p>
              </div>
            </div>
          </section>
        </div>

        <div
          className={`transition-all duration-500 ease-out ${
            siteMode === "innovation"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden"
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
