"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Video {
  id: string
  title: string
}

interface VideoSliderProps {
  videos: Video[]
}

export function VideoSlider({ videos }: VideoSliderProps) {
  const [offset, setOffset] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set())
  const sliderRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([])
  const animationRef = useRef<number>()

  const slideWidth = 85 // percentage of viewport

  const getSlidePosition = (index: number) => {
    return index - offset
  }

  const getScale = (position: number) => {
    const absPos = Math.abs(position)
    if (absPos === 0) return 1.0 // center
    if (absPos === 1) return 0.92 // neighbors
    return 0.85 // further away
  }

  const getOpacity = (position: number) => {
    const absPos = Math.abs(position)
    if (absPos === 0) return 1.0 // center
    if (absPos === 1) return 0.7 // neighbors
    return 0.4 // further away
  }

  const animateToIndex = (targetIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(videos.length - 1, targetIndex))

    const animate = () => {
      setOffset((current) => {
        const diff = clampedIndex - current
        if (Math.abs(diff) < 0.01) {
          setActiveIndex(clampedIndex)
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

  const togglePlayPause = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const iframe = videoRefs.current[index]
    if (iframe && iframe.contentWindow) {
      if (playingVideos.has(index)) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
        setPlayingVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(index)
          return newSet
        })
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
        setPlayingVideos((prev) => new Set(prev).add(index))
      }
    }
  }

  const goToNext = () => {
    const nextIndex = Math.min(Math.round(offset) + 1, videos.length - 1)
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
    <div className="relative w-full bg-primary overflow-hidden select-none flex flex-col items-center py-8">
      <div
        ref={sliderRef}
        className="relative w-full h-[70vh] flex items-center justify-center cursor-pointer"
        onClick={handleContainerClick}
      >
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {videos.map((video, index) => {
            const position = getSlidePosition(index)
            const scale = getScale(position)
            const opacity = getOpacity(position)
            const isVisible = Math.abs(position) <= 2
            const isPlaying = playingVideos.has(index)

            return (
              <div
                key={index}
                className="absolute transition-all duration-200 ease-out"
                style={{
                  transform: `translateX(${position * slideWidth}vw) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  width: `${slideWidth}vw`,
                  maxWidth: "1400px",
                  zIndex: Math.round(100 - Math.abs(position) * 10),
                  pointerEvents: isVisible ? "auto" : "none",
                  willChange: "transform, opacity",
                }}
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl group">
                  <iframe
                    ref={(el) => (videoRefs.current[index] = el)}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&controls=0`}
                    title={video.title || `Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full pointer-events-auto"
                  ></iframe>
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    <button
                      onClick={(e) => togglePlayPause(index, e)}
                      className="bg-background/90 hover:bg-background rounded-full p-6 transition-all hover:scale-110 pointer-events-auto cursor-pointer"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <Pause className="h-10 w-10 text-foreground" fill="currentColor" />
                      ) : (
                        <Play className="h-10 w-10 text-foreground" fill="currentColor" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative w-full flex items-center justify-center gap-4 mt-4 z-50">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            goToPrev()
          }}
          disabled={Math.round(offset) === 0}
          className="bg-background/20 hover:bg-background/30 backdrop-blur-sm text-primary-foreground border-border rounded-full w-12 h-12 md:w-14 md:h-14 p-0 disabled:opacity-30 pointer-events-auto"
          aria-label="Previous video"
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
        </Button>

        <div className="flex items-center gap-3 bg-background/10 backdrop-blur-sm px-6 py-3 rounded-full">
          <span className="text-primary-foreground font-medium">
            {Math.round(offset) + 1} / {videos.length}
          </span>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          disabled={Math.round(offset) === videos.length - 1}
          className="bg-background/20 hover:bg-background/30 backdrop-blur-sm text-primary-foreground border-border rounded-full w-12 h-12 md:w-14 md:h-14 p-0 disabled:opacity-30 pointer-events-auto"
          aria-label="Next video"
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
        </Button>
      </div>
    </div>
  )
}
