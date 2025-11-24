"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
  const [offset, setOffset] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const slideWidth = 85 // percentage of viewport

  // Calculate position of each slide relative to center (0 = center, -1 = left, 1 = right)
  const getSlidePosition = (index: number) => {
    return index - offset
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

  const animateToIndex = (targetIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(photos.length - 1, targetIndex))

    const animate = () => {
      setOffset((current) => {
        const diff = clampedIndex - current
        if (Math.abs(diff) < 0.01) {
          return clampedIndex
        }
        // Smooth easing (lerp)
        return current + diff * 0.25
      })

      if (Math.abs(offset - clampedIndex) > 0.01) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    animationRef.current = requestAnimationFrame(animate)
  }

  const goToNext = () => {
    const nextIndex = Math.min(Math.round(offset) + 1, photos.length - 1)
    animateToIndex(nextIndex)
  }

  const goToPrev = () => {
    const prevIndex = Math.max(Math.round(offset) - 1, 0)
    animateToIndex(prevIndex)
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

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-accent to-background overflow-hidden select-none">
      <div
        ref={sliderRef}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
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
                className="absolute transition-all duration-200 ease-out"
                style={{
                  transform: `translateX(${position * slideWidth}vw) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  width: `${slideWidth}vw`,
                  maxWidth: "1200px",
                  zIndex: Math.round(100 - Math.abs(position) * 10),
                  willChange: "transform, opacity",
                }}
              >
                <div className="relative w-full h-[80vh] flex items-center justify-center">
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
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-medium">{photo.category}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={(e) => {
          e.stopPropagation()
          goToPrev()
        }}
        disabled={Math.round(offset) === 0}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 bg-background/90 hover:bg-background text-foreground rounded-full w-14 h-14 p-0 shadow-xl disabled:opacity-30 pointer-events-auto"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        onClick={(e) => {
          e.stopPropagation()
          goToNext()
        }}
        disabled={Math.round(offset) === photos.length - 1}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 bg-background/90 hover:bg-background text-foreground rounded-full w-14 h-14 p-0 shadow-xl disabled:opacity-30 pointer-events-auto"
        aria-label="Next photo"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
        <span className="text-foreground font-medium">
          {Math.round(offset) + 1} / {photos.length}
        </span>
      </div>
    </div>
  )
}
