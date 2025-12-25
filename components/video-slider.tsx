"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Video {
  id: string
  title: string
}

interface VideoSliderProps {
  videos: Video[]
}

export function VideoSlider({ videos }: VideoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set())
  const [slideWidth, setSlideWidth] = useState(70)
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([])
  const containerRefs = useRef<(HTMLDivElement | null)[]>([])

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const minSwipeDistance = 50

  useEffect(() => {
    const updateWidth = () => {
      setSlideWidth(window.innerWidth < 768 ? 85 : 70)
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

  const togglePlayPause = (index: number, e: React.MouseEvent | React.TouchEvent) => {
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

  const toggleFullscreen = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    const container = containerRefs.current[index]
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    }
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1))
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
    const diff = currentTouch - touchStart
    setSwipeOffset(diff * 0.3)
  }

  const onTouchEnd = () => {
    setIsSwiping(false)
    setSwipeOffset(0)

    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < videos.length - 1) {
      goToNext()
    } else if (isRightSwipe && currentIndex > 0) {
      goToPrev()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div className="relative w-full bg-primary overflow-hidden select-none pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12">
      <div
        className="relative w-full h-[45vh] md:h-[50vh] lg:h-[55vh] touch-pan-y"
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
          {videos.map((video, index) => {
            const position = getSlidePosition(index)
            const scale = getScale(position)
            const opacity = getOpacity(position)
            const isVisible = Math.abs(position) <= 2
            const isPlaying = playingVideos.has(index)
            const isCurrent = position === 0

            return (
              <div
                key={index}
                className="absolute transition-all duration-300 ease-out"
                style={{
                  transform: `translateX(${position * slideWidth}vw) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  width: `${slideWidth}vw`,
                  maxWidth: "1400px",
                  zIndex: Math.round(100 - Math.abs(position) * 10),
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <div
                  ref={(el) => (containerRefs.current[index] = el)}
                  className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl group"
                >
                  <iframe
                    ref={(el) => (videoRefs.current[index] = el)}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&controls=0`}
                    title={video.title || `Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>

                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-primary/30 transition-opacity duration-300 z-10 ${isCurrent ? "opacity-100 md:opacity-0 md:group-hover:opacity-100" : "opacity-0"}`}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <button
                        onClick={(e) => togglePlayPause(index, e)}
                        className="bg-background/90 hover:bg-background rounded-full p-4 md:p-5 transition-all hover:scale-110 touch-manipulation"
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8 md:h-10 md:w-10 text-foreground" fill="currentColor" />
                        ) : (
                          <Play className="h-8 w-8 md:h-10 md:w-10 text-foreground" fill="currentColor" />
                        )}
                      </button>
                      <button
                        onClick={(e) => toggleFullscreen(index, e)}
                        className="bg-background/90 hover:bg-background rounded-full p-4 md:p-5 transition-all hover:scale-110 touch-manipulation"
                        aria-label="Toggle fullscreen"
                      >
                        <Maximize className="h-8 w-8 md:h-10 md:w-10 text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation buttons and counter */}
      <div className="relative w-full flex flex-col items-center gap-4 mt-8 md:mt-12 z-50 px-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="bg-background/20 hover:bg-background/30 backdrop-blur-sm text-primary-foreground border-border rounded-full w-14 h-14 md:w-14 md:h-14 p-0 disabled:opacity-30 touch-manipulation"
            aria-label="Previous video"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </Button>

          <div className="flex items-center gap-3 bg-background/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-primary-foreground font-medium text-base md:text-lg">
              {currentIndex + 1} / {videos.length}
            </span>
          </div>

          <Button
            onClick={goToNext}
            disabled={currentIndex === videos.length - 1}
            className="bg-background/20 hover:bg-background/30 backdrop-blur-sm text-primary-foreground border-border rounded-full w-14 h-14 md:w-14 md:h-14 p-0 disabled:opacity-30 touch-manipulation"
            aria-label="Next video"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </Button>
        </div>

        <span className="text-primary-foreground/60 text-xs md:hidden">Swipe to navigate</span>
      </div>
    </div>
  )
}
