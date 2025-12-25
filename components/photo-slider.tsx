"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  src: string
  alt: string
  category: string
}

interface PhotoSliderProps {
  photos: Photo[]
  onOpenLightbox?: (index: number) => void
}

export function PhotoSlider({ photos, onOpenLightbox }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideWidth, setSlideWidth] = useState(85)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  useEffect(() => {
    const updateWidth = () => {
      setSlideWidth(window.innerWidth < 768 ? 90 : 85)
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const getSlidePosition = (index: number) => {
    return index - currentIndex
  }

  const getScale = (position: number) => {
    const absPos = Math.abs(position)
    if (absPos === 0) return 1.0
    if (absPos === 1) return 0.92
    return 0.85
  }

  const getOpacity = (position: number) => {
    const absPos = Math.abs(position)
    if (absPos === 0) return 1.0
    if (absPos === 1) return 0.7
    return 0.4
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, photos.length - 1))
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsSwiping(true)
    setSwipeOffset(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)
    // Calculate visual offset during swipe
    const diff = currentTouch - touchStart
    setSwipeOffset(diff * 0.3) // Dampen the effect
  }

  const onTouchEnd = () => {
    setIsSwiping(false)
    setSwipeOffset(0)

    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < photos.length - 1) {
      goToNext()
    } else if (isRightSwipe && currentIndex > 0) {
      goToPrev()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleFullscreen = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    if (onOpenLightbox) {
      onOpenLightbox(currentIndex)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[85vh] md:h-screen bg-gradient-to-b from-accent to-background overflow-hidden select-none"
    >
      <div
        className="absolute inset-0 flex items-center justify-center touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isSwiping ? "none" : "transform 0.3s ease-out",
          }}
        >
          {photos.map((photo, index) => {
            const position = getSlidePosition(index)
            const scale = getScale(position)
            const opacity = getOpacity(position)
            const isVisible = Math.abs(position) <= 2
            const isCurrent = position === 0

            return (
              <div
                key={index}
                className="absolute transition-all duration-300 ease-out"
                style={{
                  transform: `translateX(${position * slideWidth}vw) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  width: `${slideWidth}vw`,
                  maxWidth: "1200px",
                  zIndex: Math.round(100 - Math.abs(position) * 10),
                }}
              >
                <div className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center group">
                  <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.alt}
                    width={1200}
                    height={800}
                    className="object-contain max-w-full max-h-full rounded-2xl shadow-2xl"
                    style={{
                      width: "auto",
                      height: "auto",
                    }}
                    sizes="90vw"
                    draggable={false}
                  />

                  {isCurrent && onOpenLightbox && (
                    <button
                      onClick={handleFullscreen}
                      className="absolute top-4 right-4 bg-background/80 hover:bg-background text-foreground rounded-full p-3 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity shadow-lg touch-manipulation z-20"
                      aria-label="View fullscreen"
                    >
                      <Maximize className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                  )}

                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-black/50 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                    <span className="text-white text-xs md:text-sm font-medium">{photo.category}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation buttons - larger touch targets */}
      <Button
        onClick={goToPrev}
        disabled={currentIndex === 0}
        className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 bg-background/90 hover:bg-background text-foreground rounded-full w-14 h-14 md:w-14 md:h-14 p-0 shadow-xl disabled:opacity-30 touch-manipulation"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-7 w-7 md:h-8 md:w-8" />
      </Button>

      <Button
        onClick={goToNext}
        disabled={currentIndex === photos.length - 1}
        className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 bg-background/90 hover:bg-background text-foreground rounded-full w-14 h-14 md:w-14 md:h-14 p-0 shadow-xl disabled:opacity-30 touch-manipulation"
        aria-label="Next photo"
      >
        <ChevronRight className="h-7 w-7 md:h-8 md:w-8" />
      </Button>

      {/* Counter and swipe hint */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 bg-background/90 backdrop-blur-sm px-5 md:px-6 py-2.5 md:py-3 rounded-full shadow-xl">
          <span className="text-foreground font-medium text-sm md:text-base">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
        <span className="text-foreground/60 text-xs md:hidden">Swipe to navigate</span>
      </div>
    </div>
  )
}
