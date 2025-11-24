"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  photos: { src: string; alt: string }[]
  onComplete: () => void
}

export function LoadingScreen({ photos, onComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [photosFadeOut, setPhotosFadeOut] = useState(false)

  useEffect(() => {
    const photoFadeTimer = setTimeout(() => {
      setPhotosFadeOut(true)
    }, 3000)

    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      // After exit animation completes, call onComplete
      setTimeout(onComplete, 800)
    }, 3600) // 3s + 0.6s for photo fade

    return () => {
      clearTimeout(photoFadeTimer)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  const displayPhotos = photos.slice(0, 7)

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

        <div className={`loading-stacked-photos ${photosFadeOut ? "photos-fade-out" : ""}`}>
          {displayPhotos.map((photo, index) => (
            <div
              key={index}
              className="stacked-photo"
              style={{
                animationDelay: `${index * 0.4}s`,
              }}
            >
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                width={600}
                height={400}
                className="stacked-image"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
