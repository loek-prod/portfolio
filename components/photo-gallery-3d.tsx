"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react"

interface Photo {
  src: string
  alt: string
  category?: string
  aspectRatio?: "panoramic" | "landscape" | "portrait"
}

interface PhotoGallery3DProps {
  photos: Photo[]
  onOpenLightbox?: (index: number) => void
  /** Shorter variant for use as a teaser inside a page, not as a full section. */
  compact?: boolean
}

export function PhotoGallery3D({ photos, onOpenLightbox, compact = false }: PhotoGallery3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  /* Each card used to fill the whole stack box and letterbox the photo inside it
     with object-contain. That left transparent bands beside a portrait photo, and
     the fanned cards behind showed through them — the "leaking" between pictures.
     Fixing it needs two measurements: the box's real pixel size (its width/height
     are vw/min() strings that JS can't read) and each photo's aspect ratio. Every
     card is then sized to its own photo, so there are no gaps to see through. */
  const stackRef = useRef<HTMLDivElement | null>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)
  const [ratios, setRatios] = useState<Record<string, number>>({})

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setBox({ w: r.width, h: r.height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    photos.forEach((photo) => {
      const img = new window.Image()
      img.src = photo.src
      img.onload = () => {
        if (cancelled || !img.naturalHeight) return
        setRatios((prev) =>
          prev[photo.src] ? prev : { ...prev, [photo.src]: img.naturalWidth / img.naturalHeight },
        )
      }
    })
    return () => {
      cancelled = true
    }
  }, [photos])

  /** Largest w/h fitting `bounds` while keeping the photo's own aspect ratio. */
  const fit = (ratio: number, bounds: { w: number; h: number }) =>
    ratio > bounds.w / bounds.h
      ? { w: bounds.w, h: bounds.w / ratio }
      : { w: bounds.h * ratio, h: bounds.h }

  /* The active photo's own rendered frame is the envelope for the whole stack.
     Fitting each card to the full box instead let a tall portrait neighbour stand
     proud above and below a short landscape active photo — pictures leaking into
     each other again, just on the other axis. Bounding every card by the active
     frame means the fan can only emerge sideways, as a deck of photos should. */
  const activeSize =
    box && box.w && box.h && ratios[photos[activeIndex]?.src]
      ? fit(ratios[photos[activeIndex].src], box)
      : null

  const getCardSize = (src: string) => {
    if (!activeSize) return null
    const ratio = ratios[src]
    if (!ratio) return null
    return fit(ratio, activeSize)
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % photos.length)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onOpenLightbox) {
      onOpenLightbox(activeIndex)
    }
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    
    const swipeDistance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50
    
    if (swipeDistance > minSwipeDistance) {
      // Swiped left - go to next
      goToNext()
    } else if (swipeDistance < -minSwipeDistance) {
      // Swiped right - go to previous
      goToPrev()
    }
    
    // Reset
    touchStartX.current = null
    touchEndX.current = null
  }

  /* How far each stacked card peeks past the edge of the one in front of it. A
     plain "offset * spacing" cannot work here: a narrow portrait bounded inside a
     wide landscape active photo stays completely hidden behind it however large
     the step, while the same step around a portrait active photo throws landscape
     neighbours far out into the margin. The offset is therefore derived per card
     from its own fitted width, below. */
  const sliverStep = activeSize ? Math.max(18, activeSize.w * 0.05) : 30
  /* The vertical step stays under the per-step shrink from `scale` (which takes
     at least 3.5% off the height per side), so a stacked card can never rise
     above or drop below the active photo's edge whatever its shape. */
  const verticalStep = activeSize ? activeSize.h * 0.03 : isMobile ? 12 : 24
  // Smaller max sizes to ensure containment with padding
  // The stack box is a fixed frame that every photo letterboxes into, so it must
  // be tall enough for portrait orientations (roughly 2:3) at the given width —
  // otherwise `fill` + object-contain crops tall photos top and bottom.
  const maxImageWidth = isMobile ? "75vw" : compact ? "min(58vw, 620px)" : "min(70vw, 750px)"
  const maxImageHeight = isMobile
    ? compact ? "42vh" : "52vh"
    : compact ? "min(52vh, 520px)" : "min(64vh, 660px)"
  const sectionMinHeight = compact ? (isMobile ? "60vh" : "68vh") : isMobile ? "78vh" : "88vh"

  /* Perspective is applied per card rather than on the shared parent so that the
     stack does NOT need transformStyle: preserve-3d. Inside a preserve-3d context
     the browser sorts siblings by 3D geometry and ignores z-index entirely, and a
     card rotated 45deg swings its near edge in front of the active photo — which
     is what made the neighbours paint over it. Each card is now flattened on its
     own, so the z-index hierarchy below is authoritative and the active photo is
     always on top. The perspective value matches the old parent value, so the
     fanning still looks the same. */
  const cardPerspective = `perspective(${isMobile ? 800 : 1200}px)`

  // Calculate card position relative to active index
  const getCardStyle = (index: number) => {
    const offset = index - activeIndex
    const isActive = offset === 0
    const absOffset = Math.abs(offset)
    
    // Show 5 cards for visible depth effect, hide cards 6+
    const maxVisibleCards = 5
    if (absOffset > maxVisibleCards) {
      return {
        transform: `${cardPerspective} translateX(0) translateY(0) translateZ(-500px) rotateY(-50deg) scale(0.5)`,
        zIndex: 0,
        opacity: 0,
        visibility: "hidden" as const,
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, opacity" as const,
      }
    }
    
    // Y rotation for 3D fanning effect - moderate angle
    const baseRotateY = -45
    
    // Strict z-index hierarchy - active is always on top
    // Each card behind gets progressively lower z-index (large gaps to prevent overlap issues)
    const zIndex = isActive ? 10000 : 5000 - absOffset * 500
    
    // Active card faces viewer, others rotated
    const rotateY = isActive ? 0 : baseRotateY
    
    // Progressive scale reduction creates depth illusion
    const scale = isActive ? 1 : Math.max(0.65, 0.92 - absOffset * 0.07)

    /* Fan diagonally, bottom-left to top-right. The horizontal offset is solved
       per card so its outer edge clears the active photo's edge by exactly
       absOffset * sliverStep: every card is centred and each has its own width,
       so a shared step would hide narrow neighbours entirely behind a wide active
       photo. 0.72 approximates how much rotateY(-45deg) foreshortens the width. */
    const cardSize = getCardSize(photos[index].src)
    let xOffset = offset * sliverStep
    if (activeSize && cardSize) {
      const effHalfW = (cardSize.w * scale * (isActive ? 1 : 0.72)) / 2
      const reach = activeSize.w / 2 - effHalfW + absOffset * sliverStep
      xOffset = Math.sign(offset) * reach
    }
    const yOffset = -offset * verticalStep
    
    // Push cards back in Z-space for real depth. The active card stays at 0:
    // a positive translateZ magnifies it under the perspective projection, which
    // pushed it past the fixed stack height and clipped tall photos top/bottom.
    const translateZ = isActive ? 0 : -absOffset * 60
    
    // Visible opacity for background cards - they should be clearly seen
    // Active: 1, Card 1: 0.85, Card 2: 0.7, Card 3: 0.55, Card 4: 0.4, Card 5: 0.25
    const opacity = isActive ? 1 : Math.max(0.2, 1 - absOffset * 0.18)
    
    return {
      transform: `${cardPerspective} translateX(${xOffset}px) translateY(${yOffset}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex,
      opacity,
      visibility: "visible" as const,
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      willChange: "transform, opacity" as const,
    }
  }

  if (photos.length === 0) {
    return (
      <div className="w-full h-[70vh] md:h-[85vh] bg-transparent flex items-center justify-center">
        <p className="text-muted-foreground">No photos to display</p>
      </div>
    )
  }

  return (
    <div 
      /* Transparent so the surrounding section treatment shows through.
         The foreground-based controls below invert with it automatically. */
      className="relative w-full bg-transparent overflow-hidden flex flex-col"
      style={{ minHeight: sectionMinHeight }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Perspective Container with equal padding on all sides */}
      <div 
        className="flex-1 relative flex items-center justify-center"
        style={{
          padding: isMobile ? "24px 16px" : compact ? "28px 40px" : "48px 40px",
        }}
      >
        {/* No `perspective` here any more: the cards are grandchildren of this
            element and the stack between them is flat, so it never reached them.
            Each card carries its own perspective() instead. */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div 
            ref={stackRef}
            className="relative flex items-center justify-center"
            style={{
              /* Deliberately NOT preserve-3d — see cardPerspective above. */
              width: maxImageWidth,
              height: maxImageHeight,
            }}
          >
          {photos.map((photo, index) => {
            const isActive = index === activeIndex
            const style = getCardStyle(index)
            const absOffset = Math.abs(index - activeIndex)
            
            // Only render cards within visible range (5 cards behind active)
            if (absOffset > 5) return null

            /* Hug the photo's own aspect ratio so no transparent letterbox band
               is left for the cards behind to show through. Falls back to the
               full box for the frame or two before the ratio is measured. */
            const size = getCardSize(photo.src)
            
            return (
              <div
                key={`${photo.src}-${index}`}
                className="absolute flex items-center justify-center"
                style={{
                  ...style,
                  /* Centred with real pixel offsets instead of left/top 50% plus a
                     percentage translate, because a percentage shift inside the
                     card's own perspective projection gets scaled along with the
                     card and drifts off centre. */
                  left: size && box ? `${(box.w - size.w) / 2}px` : 0,
                  top: size && box ? `${(box.h - size.h) / 2}px` : 0,
                  width: size ? `${size.w}px` : "100%",
                  height: size ? `${size.h}px` : "100%",
                  opacity: size ? style.opacity : 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                {/* No card: square corners, no backing, no shadow. Depth in the
                    stack is carried by scale, rotation and opacity alone. */}
                <div
                  className="relative flex h-full w-full items-center justify-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* fill + object-contain so portrait and landscape photos both
                      letterbox inside the stack box instead of overflowing it.
                      Sizing via width/height props clipped tall photos. */}
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 620px"
                    className="object-contain"
                    draggable={false}
                    priority={isActive || absOffset <= 1}
                    quality={isActive ? 90 : 40}
                  />
                  
                  {/* Active card overlay with fullscreen button */}
                  {isActive && (
                    <>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                      
                      {onOpenLightbox && (
                        <button
                          onClick={handleFullscreen}
                          className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-full bg-cream/90 p-3 text-ink shadow-lg transition-all duration-200 hover:bg-cream active:bg-cream md:right-4 md:top-4 md:p-2.5"
                          aria-label="View fullscreen"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      )}
                      
                      {/* Category label */}
                      {photo.category && (
                        <div className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-3 py-1.5 backdrop-blur-sm md:bottom-4 md:left-4">
                          <span className="text-xs font-medium text-cream md:text-sm">{photo.category}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>

      {/* Navigation - below the image, not overlapping */}
      <div className="flex items-center justify-center gap-4 md:gap-6 py-6 md:py-8">
        <button
          onClick={goToPrev}
          className="bg-foreground/10 hover:bg-foreground/20 active:bg-foreground/30 rounded-full p-3 transition-all duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>
        
        <div className="bg-foreground/10 px-4 py-2 rounded-full">
          <span className="text-foreground/80 text-sm font-medium">
            {activeIndex + 1} / {photos.length}
          </span>
        </div>
        
        <button
          onClick={goToNext}
          className="bg-foreground/10 hover:bg-foreground/20 active:bg-foreground/30 rounded-full p-3 transition-all duration-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>
      
      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="text-center pb-4">
          <span className="text-foreground/40 text-xs">Swipe to navigate</span>
        </div>
      )}
    </div>
  )
}
