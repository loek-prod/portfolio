"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const FRAGMENT = "Hi, I'm Loek, a filmmaker based in Switzerland."
const FULL_TEXT =
  "Hi, I'm Loek, a filmmaker and content creator based in Switzerland. My approach for client work is simple: listen first, build a concept, then bring it to the screen."

/** Square window that tracks the cursor. Square, per the sharp-corner treatment. */
const WINDOW_SIZE = 180
/** Cursor easing: fraction of remaining distance closed per frame. Low = more lag. */
const FOLLOW_EASE = 0.12
/** Fallback reveal if the visitor never interacts. */
const IDLE_REVEAL_MS = 4500

type Mode = "idle" | "following" | "expanded"

export function HeroIntroReveal() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [isTouch, setIsTouch] = useState(false)
  const [mode, setMode] = useState<Mode>("idle")

  /* Cursor position drives a clip-path, not element position, so the text itself
     never moves — only the window through which it is visible. Kept in a ref and
     written straight to CSS vars so the follow loop never triggers React renders. */
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const hasPositioned = useRef(false)

  /* Only treat this as a touch device when there is no hover capability AND the
     primary pointer is coarse. An OR here misreports hybrid laptops and some
     headless/remote browsers as touch, which silently disables the desktop
     cursor reveal. Real mouse input also clears the flag on first move below. */
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches)
  }, [])

  /* ---------------------------------------------------------------- desktop */

  const writeVars = useCallback((x: number, y: number) => {
    const host = hostRef.current
    if (!host) return
    host.style.setProperty("--reveal-x", `${x}px`)
    host.style.setProperty("--reveal-y", `${y}px`)
  }, [])

  const runFollow = useCallback(() => {
    const c = current.current
    const t = target.current
    c.x += (t.x - c.x) * FOLLOW_EASE
    c.y += (t.y - c.y) * FOLLOW_EASE
    writeVars(c.x, c.y)
    rafRef.current = requestAnimationFrame(runFollow)
  }, [writeVars])

  useEffect(() => {
    if (isTouch || mode === "idle") return
    rafRef.current = requestAnimationFrame(runFollow)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [isTouch, mode, runFollow])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // A real mouse/pen move is proof of a cursor, so trust the event over the
      // media query. Deferred to a microtask because calling setState straight
      // from this handler can land inside React's render phase and warn about
      // updating a component while another is rendering.
      if (event.pointerType === "touch") return
      if (isTouch) queueMicrotask(() => setIsTouch(false))
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      target.current = { x, y }

      // First move: start the window under the cursor instead of easing in from 0,0.
      if (!hasPositioned.current) {
        hasPositioned.current = true
        current.current = { x, y }
        writeVars(x, y)
      }
      setMode((m) => (m === "idle" ? "following" : m))
    },
    [isTouch, writeVars],
  )

  /* Native listener rather than React's onPointerLeave: pointerleave does not
     bubble, and binding it directly is the reliable way to catch the cursor
     actually exiting the hero. An expanded reveal stays put on leave. */
  useEffect(() => {
    if (isTouch) return
    const host = hostRef.current
    if (!host) return
    const onLeave = () => {
      setMode((m) => (m === "following" ? "idle" : m))
      hasPositioned.current = false
    }
    host.addEventListener("pointerleave", onLeave)
    return () => host.removeEventListener("pointerleave", onLeave)
  }, [isTouch])

  const handleClick = useCallback(() => {
    if (isTouch) return
    setMode((m) => (m === "expanded" ? "following" : "expanded"))
  }, [isTouch])

  /* ----------------------------------------------------------------- mobile */

  /* The first gesture in view is swallowed and reveals the text; every later
     gesture scrolls normally. Only a non-passive listener can preventDefault on
     touchmove, so this is attached manually rather than via a JSX prop. */
  useEffect(() => {
    if (!isTouch) return
    const host = hostRef.current
    if (!host) return

    let consumed = false
    let inView = true
    let startY = 0

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
      },
      { threshold: 0.35 },
    )
    observer.observe(host)

    const reveal = () => {
      consumed = true
      setMode("expanded")
    }

    const onTouchStart = (event: TouchEvent) => {
      startY = event.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (event: TouchEvent) => {
      if (consumed || !inView) return
      const y = event.touches[0]?.clientY ?? 0
      // Downward swipe only — upward should not trap the visitor at the top.
      if (startY - y > 6 && event.cancelable) {
        event.preventDefault()
        reveal()
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (consumed || !inView) return
      if (event.deltaY > 0 && event.cancelable) {
        event.preventDefault()
        reveal()
      }
    }

    // Scrolling back up to an untouched hero fades the text out again.
    const onScroll = () => {
      if (window.scrollY <= 4 && consumed) {
        consumed = false
        setMode("idle")
      }
    }

    host.addEventListener("touchstart", onTouchStart, { passive: true })
    host.addEventListener("touchmove", onTouchMove, { passive: false })
    host.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      observer.disconnect()
      host.removeEventListener("touchstart", onTouchStart)
      host.removeEventListener("touchmove", onTouchMove)
      host.removeEventListener("wheel", onWheel)
      window.removeEventListener("scroll", onScroll)
    }
  }, [isTouch])

  /* Safeguard: never leave a visitor on a silent image if gesture capture fails.
     Touch only — on desktop the cursor-follow window IS the introduction, so
     auto-expanding there would pre-empt the interaction instead of rescuing it. */
  useEffect(() => {
    if (!isTouch || mode !== "idle") return
    const timer = window.setTimeout(() => setMode("expanded"), IDLE_REVEAL_MS)
    return () => window.clearTimeout(timer)
  }, [isTouch, mode])

  const expanded = mode === "expanded"
  const following = mode === "following"

  return (
    <div
      ref={hostRef}
      onPointerMove={handlePointerMove}
      onClick={isTouch ? undefined : handleClick}
      className="absolute inset-0 z-20"
      style={{
        // Touch needs to receive gestures; desktop only needs hover/click, and
        // staying transparent to pointers would break the follow effect, so the
        // buttons below are lifted above this layer instead (z-30 in page.tsx).
        touchAction: expanded || !isTouch ? undefined : "none",
        ["--reveal-size" as string]: `${WINDOW_SIZE}px`,
      }}
      aria-hidden="true"
    >
      {/* Square outline marking the window. Sharp corners, thin border, no fill. */}
      <div
        className="pointer-events-none absolute border border-cream/45 transition-opacity duration-700 ease-out"
        style={{
          width: "var(--reveal-size)",
          height: "var(--reveal-size)",
          left: 0,
          top: 0,
          transform:
            "translate(calc(var(--reveal-x, -9999px) - var(--reveal-size) / 2), calc(var(--reveal-y, -9999px) - var(--reveal-size) / 2))",
          opacity: following ? 1 : 0,
        }}
      />

      {/* Fragment: revealed only through the moving square via clip-path. The
          text block is centred on the cursor (not the hero) so the words inside
          the window are always whole lines — centring it on the hero meant the
          square usually caught a sliver of a line cut through the glyphs. */}
      <div
        className="pointer-events-none absolute flex items-center justify-center transition-opacity duration-700 ease-out"
        style={{
          left: 0,
          top: 0,
          width: "calc(var(--reveal-size) * 3)",
          height: "calc(var(--reveal-size) * 3)",
          transform:
            "translate(calc(var(--reveal-x, -9999px) - var(--reveal-size) * 1.5), calc(var(--reveal-y, -9999px) - var(--reveal-size) * 1.5))",
          opacity: following ? 1 : 0,
          // Window is the centre square of this 3x block, so inset = 1 unit.
          clipPath: "inset(var(--reveal-size) var(--reveal-size) var(--reveal-size) var(--reveal-size))",
        }}
      >
        <p className="w-[168px] text-balance text-center text-base font-semibold leading-snug text-cream">
          {FRAGMENT}
        </p>
      </div>

      {/* Full text: expands from the square's last position outward to the whole
          hero. Scale is driven from the cursor point via transform-origin so the
          growth reads as the window opening rather than an unrelated fade. */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 md:px-16"
        style={{
          opacity: expanded ? 1 : 0,
          transformOrigin: "var(--reveal-x, 50%) var(--reveal-y, 50%)",
          transform: expanded ? "scale(1)" : "scale(0.35)",
          transition:
            "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out",
        }}
      >
        <p className="max-w-3xl text-balance text-center text-xl font-medium leading-relaxed text-cream md:text-3xl md:leading-relaxed">
          {FULL_TEXT}
        </p>
      </div>
    </div>
  )
}
