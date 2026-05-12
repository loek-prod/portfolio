"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Maximize } from "lucide-react"

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleCardClick = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null)
    } else {
      setSelectedIndex(index)
    }
  }

  const handleFullscreen = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    if (onOpenLightbox) {
      onOpenLightbox(index)
    }
  }

  const handleBackgroundClick = () => {
    setSelectedIndex(null)
  }

  // Responsive card dimensions
  const cardWidth = isMobile ? 200 : 320
  const cardHeight = isMobile ? 150 : 240
  const baseSpacing = isMobile ? 100 : 160
  const verticalSpacing = isMobile ? 70 : 110

  // Calculate position for each card in the diagonal stack
  const getCardStyle = (index: number, total: number) => {
    const isSelected = selectedIndex === index
    const baseRotateY = -45 // Base Y rotation for 3D effect
    
    // Position cards from bottom-left to top-right
    const xOffset = index * baseSpacing
    const yOffset = (total - 1 - index) * verticalSpacing
    
    // Z-index: selected card on top, otherwise based on position
    const zIndex = isSelected ? 1000 : index + 1
    
    // Transform values
    const rotateY = isSelected ? 0 : baseRotateY
    const scale = isSelected ? 1.2 : 1
    const translateZ = isSelected ? 150 : 0
    
    return {
      left: `${xOffset}px`,
      top: `${yOffset}px`,
      transform: `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  }

  // Calculate container dimensions
  const containerWidth = photos.length * baseSpacing + cardWidth
  const containerHeight = photos.length * verticalSpacing + cardHeight

  if (photos.length === 0) {
    return (
      <div className="w-full min-h-[60vh] bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No photos to display</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full bg-background overflow-x-auto overflow-y-hidden"
      style={{ minHeight: isMobile ? "70vh" : "100vh" }}
      onClick={handleBackgroundClick}
    >
      {/* 3D Perspective Container */}
      <div 
        className="relative w-full h-full flex items-center"
        style={{
          perspective: "1500px",
          perspectiveOrigin: "50% 50%",
          minHeight: isMobile ? "70vh" : "100vh",
        }}
      >
        <div 
          className="relative mx-auto"
          style={{
            transformStyle: "preserve-3d",
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
            marginLeft: isMobile ? "5%" : "10%",
            marginTop: isMobile ? "5%" : "0",
          }}
        >
          {photos.map((photo, index) => {
            const isSelected = selectedIndex === index
            const style = getCardStyle(index, photos.length)
            
            return (
              <div
                key={`${photo.src}-${index}`}
                className={`absolute cursor-pointer group ${
                  isSelected ? "ring-4 ring-accent/50 rounded-lg" : ""
                }`}
                style={{
                  ...style,
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transformStyle: "preserve-3d",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick(index)
                }}
              >
                {/* Card with shadow */}
                <div 
                  className="relative w-full h-full rounded-lg overflow-hidden"
                  style={{
                    boxShadow: isSelected 
                      ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)"
                      : "0 20px 40px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes={`${cardWidth}px`}
                    draggable={false}
                  />
                  
                  {/* Overlay on hover/selected */}
                  <div 
                    className={`absolute inset-0 bg-black/0 transition-all duration-300 ${
                      isSelected ? "bg-black/10" : "group-hover:bg-black/10"
                    }`}
                  />
                  
                  {/* Fullscreen button - visible when selected */}
                  {isSelected && onOpenLightbox && (
                    <button
                      onClick={(e) => handleFullscreen(e, index)}
                      className="absolute top-3 right-3 bg-background/90 hover:bg-background text-foreground rounded-full p-2.5 shadow-lg transition-all duration-200 touch-manipulation z-20"
                      aria-label="View fullscreen"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  )}
                  
                  {/* Category label */}
                  <div 
                    className={`absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full transition-opacity duration-300 ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <span className="text-white text-xs font-medium">{photo.category}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-foreground/10 backdrop-blur-sm px-6 py-3 rounded-full">
          <span className="text-foreground/70 text-sm">
            Click a photo to view, click again or outside to deselect
          </span>
        </div>
      </div>

      {/* Photo counter */}
      <div className="absolute top-8 right-8 z-50">
        <div className="bg-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-foreground/70 text-sm font-medium">
            {photos.length} photos
          </span>
        </div>
      </div>
    </div>
  )
}
