"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Video {
  id: string
  title: string
}

interface VideoCarouselProps {
  videos: Video[]
}

export function VideoCarousel({ videos }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextVideo = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % videos.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }

  const prevVideo = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }

  const getVideoPosition = (index: number) => {
    const diff = index - currentIndex
    const totalVideos = videos.length

    // Normalize the difference to be between -totalVideos/2 and totalVideos/2
    let normalizedDiff = diff
    if (Math.abs(diff) > totalVideos / 2) {
      normalizedDiff = diff > 0 ? diff - totalVideos : diff + totalVideos
    }

    return normalizedDiff
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevVideo()
      if (e.key === "ArrowRight") nextVideo()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, isTransitioning])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Carousel Container */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[2000px]">
        {videos.map((video, index) => {
          const position = getVideoPosition(index)
          const isActive = position === 0
          const isAdjacent = Math.abs(position) === 1
          const isVisible = Math.abs(position) <= 2

          return (
            <div
              key={video.id}
              className={`absolute transition-all duration-700 ease-in-out ${
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                transform: `
                  translateX(${position * 40}%) 
                  translateZ(${isActive ? "0px" : `-${Math.abs(position) * 300}px`})
                  rotateY(${position * -15}deg)
                  scale(${isActive ? 1 : 0.7 - Math.abs(position) * 0.1})
                `,
                zIndex: isActive ? 20 : 10 - Math.abs(position),
                width: isActive ? "90%" : "70%",
                maxWidth: isActive ? "1400px" : "900px",
              }}
            >
              <div
                className={`relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl transition-all duration-700 ${
                  isActive ? "ring-4 ring-white/30" : ""
                }`}
              >
                {isActive || isAdjacent ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}${isActive ? "?autoplay=0" : ""}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white/50">Loading...</span>
                  </div>
                )}

                {/* Overlay for non-active videos */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-700"></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={prevVideo}
        disabled={isTransitioning}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 rounded-full w-14 h-14 p-0 disabled:opacity-50"
        aria-label="Previous video"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        onClick={nextVideo}
        disabled={isTransitioning}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 rounded-full w-14 h-14 p-0 disabled:opacity-50"
        aria-label="Next video"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                setCurrentIndex(index)
                setTimeout(() => setIsTransitioning(false), 600)
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe Instructions */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 text-white/60 text-sm">
        Use arrow keys or swipe to navigate
      </div>
    </div>
  )
}
