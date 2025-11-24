"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  photos: { src: string; alt: string }[]
  onComplete: () => void
}

export function LoadingScreen({ photos, onComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Wait for 3 seconds, then start exit animation
    const timer = setTimeout(() => {
      setIsExiting(true)
      // After exit animation completes, call onComplete
      setTimeout(onComplete, 800)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`loading-overlay ${isExiting ? "loading-overlay-exit" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="loading-content">
        {/* Large Title */}
        <h1 className="loading-title">Loek Lutgens</h1>

        {/* Photo Strip */}
        <div className="loading-photo-strip">
          <div className="photo-strip-inner">
            {photos.slice(0, 10).map((photo, index) => (
              <div key={index} className="strip-image-wrapper">
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  width={400}
                  height={300}
                  className="strip-image"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
