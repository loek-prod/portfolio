"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface LightboxProps {
  images: Array<{ src: string; alt: string; category: string }>
  initialIndex: number
  onClose: () => void
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setSwipeOffset(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)
    setSwipeOffset(currentTouch - touchStart)
  }

  const onTouchEnd = () => {
    setSwipeOffset(0)
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) {
      goToNext()
    } else if (distance < -minSwipeDistance) {
      goToPrevious()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [onClose, goToNext, goToPrevious])

  return (
    <div className="fixed inset-0 z-50 bg-primary/95 flex items-center justify-center">
      {/* Close Button - larger touch target */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-background/10 hover:bg-background/20 text-primary-foreground rounded-full w-14 h-14 p-0 touch-manipulation"
        aria-label="Close lightbox"
      >
        <X className="h-7 w-7" />
      </Button>

      {/* Previous Button - larger touch target */}
      <Button
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 bg-background/10 hover:bg-background/20 text-primary-foreground rounded-full w-14 h-14 p-0 touch-manipulation"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      {/* Next Button - larger touch target */}
      <Button
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 bg-background/10 hover:bg-background/20 text-primary-foreground rounded-full w-14 h-14 p-0 touch-manipulation"
        aria-label="Next image"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="relative max-w-7xl max-h-full"
          style={{
            transform: `translateX(${swipeOffset * 0.5}px)`,
            transition: swipeOffset !== 0 ? "none" : "transform 0.3s ease-out",
          }}
        >
          <Image
            src={images[currentIndex].src || "/placeholder.svg"}
            alt={images[currentIndex].alt}
            width={1920}
            height={1080}
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain select-none"
            priority
            draggable={false}
          />
        </div>
      </div>

      {/* Image Info - improved mobile layout */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground text-center">
        <p className="text-sm mb-2">
          {currentIndex + 1} / {images.length}
        </p>
        <span className="bg-background/20 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
          {images[currentIndex].category}
        </span>
      </div>

      {/* Swipe hint for mobile */}
      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 text-xs md:text-sm">
        Swipe or use arrows to navigate
      </div>
    </div>
  )
}
