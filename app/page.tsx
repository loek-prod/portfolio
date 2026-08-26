"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Lightbox } from "@/components/lightbox"
import { LoadingScreen } from "@/components/loading-screen"
import { MorphicNavbar, navItems } from "@/components/morphic-navbar"
import { PhotoGallery3D } from "@/components/photo-gallery-3d"
import { useLanguage } from "@/components/language-context"

const photos = [
  { src: "/images/photo-bridge.jpg", alt: "Aerial view of railway bridge", category: "Aerial", aspectRatio: "panoramic" as const },
  { src: "/images/photo-boat-aerial.jpg", alt: "Aerial view of boat and swimmers", category: "Aerial", aspectRatio: "panoramic" as const },
  { src: "/images/photo5.jpg", alt: "Macro photography of textured green leaves", category: "Macro", aspectRatio: "landscape" as const },
  { src: "/images/photo-architecture1.jpg", alt: "Vibrant blue architecture with cacti", category: "Architecture", aspectRatio: "landscape" as const },
  { src: "/images/photo-pattern.jpg", alt: "Ornate decorative circular pattern", category: "Detail", aspectRatio: "landscape" as const },
  { src: "/images/photo-architecture2.jpg", alt: "Vibrant blue architecture with yellow accents", category: "Architecture", aspectRatio: "landscape" as const },
  { src: "/images/photo-monkey.jpg", alt: "Wildlife photography of monkey on beach", category: "Wildlife", aspectRatio: "landscape" as const },
  { src: "/images/photo-car.jpg", alt: "Vintage Mercedes-Benz automotive photography", category: "Automotive", aspectRatio: "landscape" as const },
  { src: "/images/photo-car-mural.jpg", alt: "Car and street art in urban setting", category: "Street", aspectRatio: "landscape" as const },
  { src: "/images/photo-palace.jpg", alt: "Palace interior with ornate golden ceiling", category: "Architecture", aspectRatio: "landscape" as const },
  { src: "/images/photo-yellow-coast.jpg", alt: "Coastal scene with boats", category: "Landscape", aspectRatio: "landscape" as const },
  { src: "/images/photo-street-scene.jpg", alt: "Street photography scene", category: "Street", aspectRatio: "landscape" as const },
  { src: "/images/photo-workers.jpg", alt: "Construction workers street scene", category: "Street", aspectRatio: "landscape" as const },
  { src: "/images/photo3.jpg", alt: "Mountain landscape with misty peaks", category: "Landscape", aspectRatio: "landscape" as const },
  { src: "/images/photo-portrait.jpg", alt: "Portrait of woman on European street", category: "Portrait", aspectRatio: "portrait" as const },
  { src: "/images/photo-terrace-portrait.jpg", alt: "Portrait on coastal terrace", category: "Portrait", aspectRatio: "portrait" as const },
  { src: "/images/photo-alley.jpg", alt: "European alley through architectural frame", category: "Street", aspectRatio: "portrait" as const },
  { src: "/images/photo-laundry.jpg", alt: "Building facade with laundry", category: "Street", aspectRatio: "portrait" as const },
  { src: "/images/photo-marrakesh.jpg", alt: "Architectural portrait in Marrakesh", category: "Portrait", aspectRatio: "portrait" as const },
]

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  const orientationRank = (aspectRatio?: "panoramic" | "landscape" | "portrait") => {
    if (aspectRatio === "portrait") return 2
    if (aspectRatio === "panoramic") return 1
    return 0
  }
  const orderedPhotos = [...photos].sort(
    (a, b) => orientationRank(a.aspectRatio) - orientationRank(b.aspectRatio),
  )

  useEffect(() => {
    setMounted(true)
    if (!sessionStorage.getItem("hasSeenLoading")) setIsLoading(true)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    sessionStorage.setItem("hasSeenLoading", "true")
  }

  if (!mounted) return null
  if (isLoading) return <LoadingScreen photos={photos} onComplete={handleLoadingComplete} />

  return (
    <main className="min-h-screen bg-background">
      <header className="relative h-[50vh] overflow-hidden md:h-[60vh]">
        <nav className="absolute inset-x-0 top-0 z-20 bg-background shadow-md">
          <div className="flex items-center justify-between p-4 md:p-6 lg:p-8">
            <Link href="/" aria-label="L'exist home">
              <Image src="/images/lexist-logo.png" alt="L'exist" width={150} height={45} className="h-auto w-[100px] md:w-[120px] lg:w-[150px]" priority />
            </Link>
            <div className="hidden md:flex">
              <MorphicNavbar />
            </div>
            <button
              className="touch-manipulation rounded-md p-3 text-foreground transition-colors hover:bg-earth md:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="border-t border-clay bg-background shadow-lg md:hidden">
              <div className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="rounded-md px-5 py-4 text-lg text-foreground transition-colors hover:bg-earth hover:text-accent">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
        <div className="hero-zoom-fade absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/photo3.jpg')" }} />
      </header>

      <section id="gallery" className="relative">
        <PhotoGallery3D
          photos={orderedPhotos}
          onOpenLightbox={(index) => {
            setLightboxIndex(index)
            setLightboxOpen(true)
          }}
        />
      </section>

      <section className="bg-earth px-4 py-12 text-foreground md:px-8 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl">{t.visual.letsWorkTogether}</h2>
          <p className="mx-auto mb-8 max-w-2xl px-4 text-lg leading-relaxed text-muted-foreground md:mb-12 md:text-xl">{t.visual.workTogetherDescription}</p>
          <div className="mb-8 flex flex-col justify-center gap-4 px-4 sm:flex-row md:mb-12">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="btn-bubble btn-bubble--solid w-full px-8 py-6 text-lg text-primary-foreground sm:w-auto">{t.visual.contactMe}</Button>
            </Link>
            <a href="https://www.instagram.com/ll_exist/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="btn-bubble w-full px-8 py-6 text-lg text-foreground sm:w-auto">{t.visual.instagram}</Button>
            </a>
          </div>
          <div className="border-t border-clay pt-8">
            <p className="text-sm text-muted-foreground md:text-base">© {new Date().getFullYear()} {t.visual.copyright}</p>
            <p className="mt-2 text-xs text-muted-foreground/50">v125</p>
          </div>
        </div>
      </section>

      {lightboxOpen && <Lightbox images={orderedPhotos} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}
    </main>
  )
}
