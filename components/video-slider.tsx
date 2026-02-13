"use client"

import type React from "react"
import { useState, useRef, useEffect, useId, memo } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GLASS_SHADOW =
  "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]"

const GlassFilter = memo(({ id, scale = 70 }: { id: string; scale?: number }) => (
  <svg className="hidden">
    <title>Glass Effect Filter</title>
    <defs>
      <filter colorInterpolationFilters="sRGB" height="200%" id={id} width="200%" x="-50%" y="-50%">
        <feTurbulence baseFrequency="0.05 0.05" numOctaves="1" result="turbulence" seed="1" type="fractalNoise" />
        <feGaussianBlur in="turbulence" result="blurredNoise" stdDeviation="2" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="blurredNoise"
          result="displaced"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="B"
        />
        <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
        <feComposite in="finalBlur" in2="finalBlur" operator="over" />
      </filter>
    </defs>
  </svg>
))
GlassFilter.displayName = "GlassFilter"

function LiquidGlassButton({
  children,
  onClick,
  className,
  ariaLabel,
}: {
  children: React.ReactNode
  onClick: (e: React.MouseEvent | React.TouchEvent) => void
  className?: string
  ariaLabel: string
}) {
  const filterId = useId()

  return (
    <>
      <button
        onClick={onClick}
        onTouchEnd={(e) => {
          e.preventDefault()
          onClick(e)
        }}
        className={cn(
          "relative rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation",
          "bg-white/20 backdrop-blur-md border border-white/30",
          className,
        )}
        aria-label={ariaLabel}
      >
        <div className={cn("pointer-events-none absolute inset-0 rounded-full transition-all", GLASS_SHADOW)} />
        <div
          className="-z-10 pointer-events-none absolute inset-0 isolate overflow-hidden rounded-full"
          style={{ backdropFilter: `url("#${filterId}")` }}
        />
        <span className="relative z-10">{children}</span>
      </button>
      <GlassFilter id={filterId} scale={70} />
    </>
  )
}

interface Video {
  id: string
  title: string
  portrait?: boolean
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
  const [showControls, setShowControls] = useState(true)
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)

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
        setShowControls(true)
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
        setPlayingVideos((prev) => new Set(prev).add(index))
      }
    }
  }

  const openFullscreen = (index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const video = videos[index]
    if (!video) return

    // Open YouTube video directly - works on all devices including iOS
    window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")
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
                  className={cn(
                    "relative w-full rounded-xl md:rounded-2xl overflow-hidden shadow-2xl group",
                    video.portrait ? "aspect-[9/16]" : "aspect-video"
                  )}
                  onClick={handleVideoAreaTap}
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
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-opacity duration-500 z-10",
                      isCurrent && showControls ? "opacity-100" : "opacity-0 pointer-events-none",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleVideoAreaTap()
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <LiquidGlassButton
                        onClick={(e) => togglePlayPause(index, e)}
                        ariaLabel={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6 md:h-8 md:w-8 text-white" fill="currentColor" />
                        ) : (
                          <Play className="h-6 w-6 md:h-8 md:w-8 text-white" fill="currentColor" />
                        )}
                      </LiquidGlassButton>

                      <LiquidGlassButton
                        onClick={(e) => openFullscreen(index, e)}
                        ariaLabel="Watch fullscreen on YouTube"
                      >
                        <ExternalLink className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </LiquidGlassButton>
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
