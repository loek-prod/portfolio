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
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const displayPhotos = photos.slice(0, 7)

  useEffect(() => {
    const imagePromises = displayPhotos.map((photo) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.src = photo.src
        img.onload = resolve
        img.onerror = reject
      })
    })

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true)
      })
      .catch(() => {
        // Even if some images fail, proceed after a timeout
        setTimeout(() => setImagesLoaded(true), 1000)
      })
  }, [])

  useEffect(() => {
    if (!imagesLoaded) return

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
  }, [onComplete, imagesLoaded])

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
        padding: "1rem",
      }}
    >
      <div className="loading-content">
        <h1 className="loading-title text-4xl md:text-6xl lg:text-7xl">Loek Lutgens</h1>

        {imagesLoaded && (
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
                  className="stacked-image w-[280px] md:w-[400px] lg:w-[600px]"
                  priority
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
