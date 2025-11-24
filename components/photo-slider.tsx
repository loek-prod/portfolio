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
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
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

  // Snap to nearest slide
  const snapToNearest = () => {
    const nearest = Math.round(offset)
    animateToIndex(nearest)
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
        return current + diff * 0.15
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentOffset(offset)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentOffset(offset)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = startX - e.clientX
    const slidesMove = diff / (window.innerWidth * (slideWidth / 100))
    setOffset(currentOffset + slidesMove)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = startX - e.touches[0].clientX
    const slidesMove = diff / (window.innerWidth * (slideWidth / 100))
    setOffset(currentOffset + slidesMove)
  }

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false)
      snapToNearest()
    }
  }

  const goToNext = () => {
    const nextIndex = Math.min(Math.round(offset) + 1, photos.length - 1)
    animateToIndex(nextIndex)
  }

  const goToPrev = () => {
    const prevIndex = Math.max(Math.round(offset) - 1, 0)
    animateToIndex(prevIndex)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden select-none">
      <div
        ref={sliderRef}
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {photos.map((photo, index) => {
            const position = getSlidePosition(index)
            const scale = getScale(position)
            const opacity = getOpacity(position)
            const isVisible = Math.abs(position) <= 2

            return (
              <div
                key={index}
                className="absolute transition-all duration-200 ease-out pointer-events-none"
                style={{
                  transform: `translateX(${position * slideWidth}vw) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  width: `${slideWidth}vw`,
                  maxWidth: "1200px",
                  zIndex: Math.round(100 - Math.abs(position) * 10),
                }}
              >
                <div className="relative w-full max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                  <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.alt}
                    width={1200}
                    height={800}
                    className="object-contain w-full h-auto max-h-[80vh]"
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
        onClick={goToPrev}
        disabled={Math.round(offset) === 0}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white text-black rounded-full w-14 h-14 p-0 shadow-xl disabled:opacity-30"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        onClick={goToNext}
        disabled={Math.round(offset) === photos.length - 1}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 bg-white/90 hover:bg-white text-black rounded-full w-14 h-14 p-0 shadow-xl disabled:opacity-30"
        aria-label="Next photo"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
        <span className="text-black font-medium">
          {Math.round(offset) + 1} / {photos.length}
        </span>
      </div>
    </div>
  )
}
