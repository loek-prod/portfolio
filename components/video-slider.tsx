"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function VideoControlButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: (e: React.MouseEvent | React.TouchEvent) => void
  ariaLabel: string
}) {
  return (
    <button
      onClick={onClick}
      className="btn-bubble p-3 md:p-4 text-white touch-manipulation"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

interface Video {
  id: string
  title: string
  portrait?: boolean
  category?: string
}

interface VideoSliderProps {
  videos: Video[]
  filterComponent?: React.ReactNode
}

export function VideoSlider({ videos, filterComponent }: VideoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set())
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set())
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([])
  const containerRefs = useRef<(HTMLDivElement | null)[]>([])
  const [showControls, setShowControls] = useState(true)
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fsElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      setIsFullscreen(!!fsElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  const minSwipeDistance = 50
  const slideWidth = typeof window !== "undefined" && window.innerWidth < 768 ? 85 : 70

  useEffect(() => {
    const currentIsPlaying = playingVideos.has(currentIndex)

    if (currentIsPlaying) {
      // Hide controls after 2 seconds when playing
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)
    } else {
      // Show controls when paused
      setShowControls(true)
    }

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
    }
  }, [playingVideos, currentIndex])

  const handleVideoAreaTap = () => {
    setShowControls(true)
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }
    if (playingVideos.has(currentIndex)) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

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

  const loadAndPlayVideo = (index: number) => {
    // Load the iframe if not already loaded
    if (!loadedVideos.has(index)) {
      setLoadedVideos((prev) => new Set(prev).add(index))
      // Wait a tick for iframe to mount, then play
      setTimeout(() => {
        const iframe = videoRefs.current[index]
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
          setPlayingVideos((prev) => new Set(prev).add(index))
        }
      }, 500)
    } else {
      const iframe = videoRefs.current[index]
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
        setPlayingVideos((prev) => new Set(prev).add(index))
      }
    }
  }

  const togglePlayPause = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    
    if (playingVideos.has(index)) {
      // Pause
      const iframe = videoRefs.current[index]
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
        setPlayingVideos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(index)
          return newSet
        })
        setShowControls(true)
      }
    } else {
      // Load and play
      loadAndPlayVideo(index)
    }
  }

  const requestFsOnElement = (el: HTMLElement) => {
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if ((el as any).webkitRequestFullscreen) {
      ;(el as any).webkitRequestFullscreen()
    } else if ((el as any).mozRequestFullScreen) {
      ;(el as any).mozRequestFullScreen()
    } else if ((el as any).msRequestFullscreen) {
      ;(el as any).msRequestFullscreen()
    }
  }

  const toggleFullscreen = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const fsElement =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement

    // If already in fullscreen, exit
    if (fsElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      }
      return
    }

    const iframe = videoRefs.current[index]
    const container = containerRefs.current[index]

    // iOS Safari only supports fullscreen on <video> / <iframe> elements, not <div>.
    // Try iframe first (works on iOS), fall back to container div (works on desktop).
    if (iframe && (iframe as any).webkitRequestFullscreen && !container?.requestFullscreen) {
      // Make sure the video is loaded before going fullscreen on iOS
      if (!loadedVideos.has(index)) {
        setLoadedVideos((prev) => new Set(prev).add(index))
        setTimeout(() => {
          const iframeEl = videoRefs.current[index]
          if (iframeEl) requestFsOnElement(iframeEl)
        }, 300)
      } else {
        requestFsOnElement(iframe)
      }
      return
    }

    // Desktop: go fullscreen on the container div so controls are included
    if (container) {
      requestFsOnElement(container)
    }
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1))
    setShowControls(true)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setShowControls(true)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setSwipeOffset(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)
    setSwipeOffset((currentTouch - touchStart) * 0.3)
  }

  const onTouchEnd = () => {
    setSwipeOffset(0)
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance && currentIndex < videos.length - 1) {
      goToNext()
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      goToPrev()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div className="relative w-full bg-primary overflow-hidden select-none">
      {/* Filter centered in top spacing */}
      {filterComponent && (
        <div className="flex items-center justify-center py-10 md:py-14 lg:py-16">
          {filterComponent}
        </div>
      )}
      {!filterComponent && <div className="pt-16 md:pt-24 lg:pt-32" />}
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
            transition: swipeOffset !== 0 ? "none" : "transform 0.3s ease-out",
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
                className="absolute transition-all duration-300 ease-out flex items-center justify-center"
                style={{
                  transform: `translateX(${position * slideWidth}vw) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  width: `${slideWidth}vw`,
                  height: "100%",
                  maxWidth: "1400px",
                  zIndex: Math.round(100 - Math.abs(position) * 10),
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <div
                  ref={(el) => (containerRefs.current[index] = el)}
                  className={cn(
                    "relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl group",
                    video.portrait ? "h-full aspect-[9/16] mx-auto" : "w-full aspect-video"
                  )}
                  style={{ willChange: "transform" }}
                  onClick={handleVideoAreaTap}
                >
                  {/* Show thumbnail until video is loaded */}
                  {!loadedVideos.has(index) && (
                    <Image
                      src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                      alt={video.title || `Video ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 85vw, 70vw"
                      priority={Math.abs(index - currentIndex) <= 1}
                    />
                  )}
                  
                  {/* Load iframe only when requested */}
                  {loadedVideos.has(index) && (
                    <iframe
                      ref={(el) => (videoRefs.current[index] = el)}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&controls=0&autoplay=1`}
                      title={video.title || `Video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  )}

                  {/* Center play/pause controls */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-opacity duration-500 z-10",
                      isCurrent && showControls ? "opacity-100" : "opacity-0 pointer-events-none",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVideoAreaTap()
                    }}
                  >
                    <VideoControlButton
                      onClick={(e) => togglePlayPause(index, e)}
                      ariaLabel={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" />
                      ) : (
                        <Play className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" />
                      )}
                    </VideoControlButton>
                  </div>

                  {/* Fullscreen button — always visible on current slide, bottom-right corner */}
                  {isCurrent && (
                    <div className="absolute bottom-3 right-3 z-20">
                      <VideoControlButton
                        onClick={(e) => toggleFullscreen(index, e)}
                        ariaLabel={isFullscreen ? "Exit fullscreen" : "Watch fullscreen"}
                      >
                        {isFullscreen ? (
                          <Minimize className="h-4 w-4 md:h-5 md:w-5" />
                        ) : (
                          <Maximize className="h-4 w-4 md:h-5 md:w-5" />
                        )}
                      </VideoControlButton>
                    </div>
                  )}
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
            className="btn-bubble text-primary-foreground w-12 h-12 md:w-14 md:h-14 min-w-[44px] min-h-[44px] p-0 disabled:opacity-30 touch-manipulation"
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
            className="btn-bubble text-primary-foreground w-12 h-12 md:w-14 md:h-14 min-w-[44px] min-h-[44px] p-0 disabled:opacity-30 touch-manipulation"
            aria-label="Next video"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </Button>
        </div>

        <span className="text-primary-foreground/60 text-xs md:hidden">Swipe to navigate</span>
      </div>
      
      {/* Bottom spacing to match top */}
      <div className="py-6 md:py-10 lg:py-12" />
    </div>
  )
}
