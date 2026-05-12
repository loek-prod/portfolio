"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"

interface Photo {
  src: string
  alt: string
  category: string
}

interface PhotoGallery3DProps {
  photos: Photo[]
  onOpenLightbox?: (index: number) => void
}

export function PhotoGallery3D({ photos, onOpenLightbox }: PhotoGallery3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)

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

  // Calculate card position relative to active index
  const getCardStyle = (index: number) => {
    const offset = index - activeIndex
    const isActive = offset === 0
    
    // Tight stacking - cards barely separated
    const stackSpacing = 25 // Very tight horizontal spacing
    const verticalStep = 18 // Very tight vertical spacing
    const baseRotateY = -55 // Strong rotation for non-active cards
    
    // Position relative to active card
    const xOffset = offset * stackSpacing
    const yOffset = -offset * verticalStep
    
    // Z-index: active card on top, cards behind have lower z-index
    // Cards in front (positive offset) should be behind the active card too
    const zIndex = isActive ? 100 : 50 - Math.abs(offset)
    
    // Transform values
    const rotateY = isActive ? 0 : baseRotateY
    const scale = isActive ? 1 : 0.85
    const translateZ = isActive ? 100 : -Math.abs(offset) * 30
    const opacity = isActive ? 1 : Math.max(0.3, 1 - Math.abs(offset) * 0.15)
    
    return {
      transform: `
        translateX(${xOffset}px) 
        translateY(${yOffset}px) 
        translateZ(${translateZ}px)
        rotateY(${rotateY}deg) 
        scale(${scale})
      `,
      zIndex,
      opacity,
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  }

  if (photos.length === 0) {
    return (
      <div className="w-full h-[70vh] bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No photos to display</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] bg-background overflow-hidden">
      {/* 3D Perspective Container */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div 
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            width: "280px",
            height: "380px",
          }}
        >
          {photos.map((photo, index) => {
            const isActive = index === activeIndex
            const style = getCardStyle(index)
            
            return (
              <div
                key={`${photo.src}-${index}`}
                className="absolute inset-0 cursor-pointer"
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => !isActive && setActiveIndex(index)}
              >
                {/* Card */}
                <div 
                  className="relative w-full h-full rounded-xl overflow-hidden"
                  style={{
                    boxShadow: isActive 
                      ? "0 30px 60px -15px rgba(0, 0, 0, 0.4)"
                      : "0 15px 35px -10px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="280px"
                    draggable={false}
                    priority={Math.abs(index - activeIndex) < 3}
                  />
                  
                  {/* Active card overlay with fullscreen button */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      
                      {onOpenLightbox && (
                        <button
                          onClick={handleFullscreen}
                          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-foreground rounded-full p-2.5 shadow-lg transition-all duration-200 touch-manipulation"
                          aria-label="View fullscreen"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      )}
                      
                      {/* Category label */}
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-white text-sm font-medium">{photo.category}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
        <button
          onClick={goToPrev}
          className="bg-foreground/10 hover:bg-foreground/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 touch-manipulation"
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
          className="bg-foreground/10 hover:bg-foreground/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 touch-manipulation"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>
    </div>
  )
}
