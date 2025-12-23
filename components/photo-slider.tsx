"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  src: string
  alt: string
  category: string
}

interface PhotoSliderProps {
  photos: Photo[]
}

export function PhotoSlider({ photos }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const slideWidth = window.innerWidth < 768 ? 90 : 85

  // Calculate position of each slide relative to center (0 = center, -1 = left, 1 = right)
  const getSlidePosition = (index: number) => {
    return index - currentIndex
  }

  // Calculate scale based on distance from center
  const getScale = (position: number) => {
    const absPos = Math.abs(position)
    if (absPos === 0) return 1.0 // center
    if (absPos === 1) return 0.92 // neighbors
    return 0.85 // further away
  }

  // Calculate opacity based on distance from center
  const getOpacity = (position: number) => {
    const absPos = Math.abs(position)
    if (absPos === 0) return 1.0 // center
    if (absPos === 1) return 0.7 // neighbors
    return 0.4 // further away
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, photos.length - 1))
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    const windowWidth = window.innerWidth
    const clickX = e.clientX

    if (clickX > windowWidth / 2) {
      goToNext()
    } else {
      goToPrev()
    }
  }

  return (
    // Improved mobile height and touch handling
    <div className="relative w-full h-[85vh] md:h-screen bg-gradient-to-b from-accent to-background overflow-hidden select-none touch-manipulation">
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer touch-manipulation"
        onClick={handleContainerClick}
      >
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {photos.map((photo, index) => {
            const position = getSlidePosition(index)
            const scale = getScale(position)
            const opacity = getOpacity(position)
            const isVisible = Math.abs(position) <= 2

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
                <div className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center">
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
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-black/50 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                    <span className="text-white text-xs md:text-sm font-medium">{photo.category}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Button
        onClick={(e) => {
          e.stopPropagation()
          goToPrev()
        }}
        disabled={currentIndex === 0}
        className="absolute left-3 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 bg-background/90 hover:bg-background text-foreground rounded-full w-12 h-12 md:w-14 md:h-14 p-0 shadow-xl disabled:opacity-30 pointer-events-auto touch-manipulation"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
      </Button>

      <Button
        onClick={(e) => {
          e.stopPropagation()
          goToNext()
        }}
        disabled={currentIndex === photos.length - 1}
        className="absolute right-3 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 bg-background/90 hover:bg-background text-foreground rounded-full w-12 h-12 md:w-14 md:h-14 p-0 shadow-xl disabled:opacity-30 pointer-events-auto touch-manipulation"
        aria-label="Next photo"
      >
        <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
      </Button>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background/90 backdrop-blur-sm px-5 md:px-6 py-2.5 md:py-3 rounded-full shadow-xl">
        <span className="text-foreground font-medium text-sm md:text-base">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>
    </div>
  )
}
