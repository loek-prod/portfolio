"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"

interface Photo {
  src: string
  alt: string
  category?: string
  aspectRatio?: "panoramic" | "landscape" | "portrait"
}

interface PhotoGallery3DProps {
  photos: Photo[]
  onOpenLightbox?: (index: number) => void
  /** Shorter variant for use as a teaser inside a page, not as a full section. */
  compact?: boolean
}

export function PhotoGallery3D({ photos, onOpenLightbox, compact = false }: PhotoGallery3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onOpenLightbox) {
      onOpenLightbox(activeIndex)
    }
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50
    
    if (swipeDistance > minSwipeDistance) {
      // Swiped left - go to next
      goToNext()
    } else if (swipeDistance < -minSwipeDistance) {
      // Swiped right - go to previous
      goToPrev()
    }
    
    // Reset
    touchStartX.current = null
    touchEndX.current = null
  }

  // Responsive values - sized to fit within padded container
  const stackSpacing = isMobile ? 15 : 35
  const verticalStep = isMobile ? 12 : 24
  // Smaller max sizes to ensure containment with padding
  const maxImageWidth = isMobile ? "75vw" : compact ? "min(58vw, 620px)" : "min(70vw, 750px)"
  const maxImageHeight = isMobile
    ? compact ? "28vh" : "35vh"
    : compact ? "min(34vh, 340px)" : "min(50vh, 500px)"
  const sectionMinHeight = compact ? (isMobile ? "44vh" : "50vh") : isMobile ? "70vh" : "85vh"

  // Calculate card position relative to active index
  const getCardStyle = (index: number) => {
    const offset = index - activeIndex
    const isActive = offset === 0
    const absOffset = Math.abs(offset)
    
    // Show 5 cards for visible depth effect, hide cards 6+
    const maxVisibleCards = 5
    if (absOffset > maxVisibleCards) {
      return {
        transform: "translateX(0) translateY(0) translateZ(-500px) rotateY(-50deg) scale(0.5)",
        zIndex: 0,
        opacity: 0,
        visibility: "hidden" as const,
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, opacity" as const,
      }
    }
    
    // Y rotation for 3D fanning effect - moderate angle
    const baseRotateY = -45
    
    // Position cards diagonally - fanning from bottom-left to top-right
    const xOffset = offset * stackSpacing
    const yOffset = -offset * verticalStep
    
    // Strict z-index hierarchy - active is always on top
    // Each card behind gets progressively lower z-index (large gaps to prevent overlap issues)
    const zIndex = isActive ? 10000 : 5000 - absOffset * 500
    
    // Active card faces viewer, others rotated
    const rotateY = isActive ? 0 : baseRotateY
    
    // Progressive scale reduction creates depth illusion
    const scale = isActive ? 1 : Math.max(0.65, 0.92 - absOffset * 0.07)
    
    // Push cards back in Z-space for real depth
    const translateZ = isActive ? 100 : -absOffset * 60
    
    // Visible opacity for background cards - they should be clearly seen
    // Active: 1, Card 1: 0.85, Card 2: 0.7, Card 3: 0.55, Card 4: 0.4, Card 5: 0.25
    const opacity = isActive ? 1 : Math.max(0.2, 1 - absOffset * 0.18)
    
    return {
      transform: `translateX(${xOffset}px) translateY(${yOffset}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      opacity,
      visibility: "visible" as const,
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      willChange: "transform, opacity" as const,
    }
  }

  if (photos.length === 0) {
    return (
      <div className="w-full h-[70vh] md:h-[85vh] bg-transparent flex items-center justify-center">
        <p className="text-muted-foreground">No photos to display</p>
      </div>
    )
  }

  return (
    <div 
      /* Transparent so the surrounding section treatment shows through.
         The foreground-based controls below invert with it automatically. */
      className="relative w-full bg-transparent overflow-hidden flex flex-col"
      style={{ minHeight: sectionMinHeight }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Perspective Container with equal padding on all sides */}
      <div 
        className="flex-1 relative flex items-center justify-center"
        style={{
          padding: isMobile ? "24px 16px" : compact ? "28px 40px" : "48px 40px",
        }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: isMobile ? "800px" : "1200px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div 
            className="relative flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              width: maxImageWidth,
              height: maxImageHeight,
            }}
          >
          {photos.map((photo, index) => {
            const isActive = index === activeIndex
            const style = getCardStyle(index)
            const absOffset = Math.abs(index - activeIndex)
            
            // Only render cards within visible range (5 cards behind active)
            if (absOffset > 5) return null
            
            return (
              <div
                key={`${photo.src}-${index}`}
                className="absolute flex items-center justify-center"
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                  width: "100%",
                  height: "100%",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                {/* No card: square corners, no backing, no shadow. Depth in the
                    stack is carried by scale, rotation and opacity alone. */}
                <div
                  className="relative max-w-full max-h-full"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={750}
                    height={500}
                    className="relative h-auto w-auto"
                    style={{ maxWidth: maxImageWidth, maxHeight: maxImageHeight, objectFit: "contain" }}
                    draggable={false}
                    priority={isActive || absOffset <= 1}
                    quality={isActive ? 90 : 40}
                  />
                  
                  {/* Active card overlay with fullscreen button */}
                  {isActive && (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                      
                      {onOpenLightbox && (
                        <button
                          onClick={handleFullscreen}
                          className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-full bg-cream/90 p-3 text-ink shadow-lg transition-all duration-200 hover:bg-cream active:bg-cream md:right-4 md:top-4 md:p-2.5"
                          aria-label="View fullscreen"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      )}
                      
                      {/* Category label */}
                      {photo.category && (
                        <div className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1.5 backdrop-blur-sm md:bottom-4 md:left-4">
                          <span className="text-xs font-medium text-cream md:text-sm">{photo.category}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>

      {/* Navigation - below the image, not overlapping */}
      <div className="flex items-center justify-center gap-4 md:gap-6 py-6 md:py-8">
        <button
          onClick={goToPrev}
          className="bg-foreground/10 hover:bg-foreground/20 active:bg-foreground/30 rounded-full p-3 transition-all duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        
        <div className="bg-foreground/10 px-4 py-2 rounded-full">
          <span className="text-foreground/80 text-sm font-medium">
            {activeIndex + 1} / {photos.length}
          </span>
        </div>
        
        <button
          onClick={goToNext}
          className="bg-foreground/10 hover:bg-foreground/20 active:bg-foreground/30 rounded-full p-3 transition-all duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>
      
      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="text-center pb-4">
          <span className="text-foreground/40 text-xs">Swipe to navigate</span>
        </div>
      )}
    </div>
  )
}
