"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"

interface Photo {
  src: string
  alt: string
  category: string
  aspectRatio?: "panoramic" | "landscape" | "portrait"
}

interface PhotoGallery3DProps {
  photos: Photo[]
  onOpenLightbox?: (index: number) => void
}

export function PhotoGallery3D({ photos, onOpenLightbox }: PhotoGallery3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

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

  // Responsive values
  const stackSpacing = isMobile ? 15 : 30
  const verticalStep = isMobile ? 12 : 22
  const maxWidth = isMobile ? "90vw" : "min(85vw, 900px)"
  const maxHeight = isMobile ? "45vh" : "min(65vh, 650px)"

  // Calculate card position relative to active index
  const getCardStyle = (index: number) => {
    const offset = index - activeIndex
    const isActive = offset === 0
    const absOffset = Math.abs(offset)
    
    // Only show cards within a limited range (clip distant cards)
    const maxVisibleCards = 5
    if (absOffset > maxVisibleCards) {
      return {
        transform: "translateX(0) translateY(0) translateZ(-500px) rotateY(-55deg) scale(0.5)",
        zIndex: 0,
        opacity: 0,
        visibility: "hidden" as const,
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, opacity" as const,
      }
    }
    
    const baseRotateY = -55
    const xOffset = offset * stackSpacing
    const yOffset = -offset * verticalStep
    
    // Strict z-index: active card is 1000, others decrease sharply
    const zIndex = isActive ? 1000 : 100 - absOffset * 20
    
    const rotateY = isActive ? 0 : baseRotateY
    
    // More aggressive scale reduction for background cards
    const scale = isActive ? 1 : Math.max(0.6, 0.85 - absOffset * 0.08)
    
    // Push non-active cards much further back in Z-space
    const translateZ = isActive ? 150 : -absOffset * 80
    
    // More aggressive opacity drop-off
    const opacity = isActive ? 1 : Math.max(0.1, 0.6 - absOffset * 0.15)
    
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
      <div className="w-full h-[60vh] md:h-[70vh] bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No photos to display</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] bg-background overflow-hidden">
      {/* 3D Perspective Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: isMobile ? "800px" : "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div 
          className="relative flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            width: maxWidth,
            height: maxHeight,
          }}
        >
          {photos.map((photo, index) => {
            const isActive = index === activeIndex
            const style = getCardStyle(index)
            const absOffset = Math.abs(index - activeIndex)
            
            // Don't render cards that are too far from active
            if (absOffset > 5) return null
            
            return (
              <div
                key={`${photo.src}-${index}`}
                className="absolute cursor-pointer flex items-center justify-center"
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                  width: "100%",
                  height: "100%",
                  // Ensure non-active cards don't intercept clicks
                  pointerEvents: isActive ? "auto" : "none",
                }}
                onClick={() => !isActive && setActiveIndex(index)}
              >
                {/* Card - adapts to image aspect ratio */}
                <div 
                  className="relative rounded-xl overflow-hidden max-w-full max-h-full"
                  style={{
                    boxShadow: isActive 
                      ? "0 30px 60px -15px rgba(0, 0, 0, 0.5)"
                      : `0 ${15 - absOffset * 2}px ${35 - absOffset * 5}px -10px rgba(0, 0, 0, ${0.3 - absOffset * 0.05})`,
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={900}
                    height={650}
                    className={`w-auto h-auto object-contain ${
                      isMobile 
                        ? "max-w-[90vw] max-h-[45vh]" 
                        : "max-w-[min(85vw,900px)] max-h-[min(65vh,650px)]"
                    }`}
                    draggable={false}
                    priority
                    quality={isActive ? 90 : 60}
                  />
                  
                  {/* Active card overlay with fullscreen button */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      
                      {onOpenLightbox && (
                        <button
                          onClick={handleFullscreen}
                          className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 hover:bg-white active:bg-white text-foreground rounded-full p-3 md:p-2.5 shadow-lg transition-all duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="View fullscreen"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      )}
                      
                      {/* Category label */}
                      <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-white text-xs md:text-sm font-medium">{photo.category}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation - touch-friendly 44px minimum tap targets */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 md:gap-6">
        <button
          onClick={goToPrev}
          className="bg-foreground/10 hover:bg-foreground/20 active:bg-foreground/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        
        <div className="bg-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-foreground/80 text-sm font-medium">
            {activeIndex + 1} / {photos.length}
          </span>
        </div>
        
        <button
          onClick={goToNext}
          className="bg-foreground/10 hover:bg-foreground/20 active:bg-foreground/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>
    </div>
  )
}
