"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PhotoSlider } from "@/components/photo-slider"
import { VideoSlider } from "@/components/video-slider"
import { Lightbox } from "@/components/lightbox"
import { RollingText } from "@/components/rolling-text"
import { LoadingScreen } from "@/components/loading-screen"

const photos = [
  {
    src: "/images/photo3.jpg",
    alt: "Mountain landscape with misty peaks",
    category: "Landscape",
  },
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
]

const videos = [
  {
    id: "fcNs7xLVLB4",
    title: "",
  },
  {
    id: "qH0-j4DaPyw",
    title: "",
  },
  {
    id: "EFuZUPn6Pfw",
    title: "",
  },
  {
    id: "2X-7H1_Nz94",
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
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

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
  }

  if (isLoading) {
    return <LoadingScreen photos={photos} onComplete={() => setIsLoading(false)} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header id="home" className="relative h-[60vh] overflow-hidden">
        {/* Navigation Bar */}
        <nav className="absolute top-0 left-0 right-0 z-20 bg-white shadow-md">
          <div className="flex justify-between items-center p-6 md:p-8">
            <div className="text-black">
              <h1 className="text-2xl md:text-3xl font-bold">LOEK LUTGENS</h1>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => scrollToSection("home")}
                className="nav-link text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
              >
                <RollingText text="Home" />
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="nav-link text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
              >
                <RollingText text="Pictures" />
              </button>
              <button
                onClick={() => scrollToSection("videos")}
                className="nav-link text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
              >
                <RollingText text="Videos" />
              </button>
              <Link href="/contact">
                <button className="nav-link text-black hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">
                  <RollingText text="Contact" />
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Background Image with Animation */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-zoom-fade"
          style={{
            backgroundImage: `url('/images/photo3.jpg')`,
          }}
        ></div>
      </header>

      <section id="gallery">
        <PhotoSlider photos={filteredPhotos} />
      </section>

      <section id="videos">
        <VideoSlider videos={videos} />
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 md:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Available for photography and videography projects. Get in touch to discuss your vision.
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30 rounded-full px-8"
              >
                Contact Me
              </Button>
            </Link>
            <a href="https://www.instagram.com/ll_exist/" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30 rounded-full px-8"
              >
                Instagram
              </Button>
            </a>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400">© {new Date().getFullYear()} Loek Lutgens. All rights reserved.</p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox images={filteredPhotos} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  )
}
