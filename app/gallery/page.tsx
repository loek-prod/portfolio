"use client"

import { useState } from "react"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { Lightbox } from "@/components/lightbox"
import { galleryPhotos } from "@/lib/gallery-photos"

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPath="/gallery" />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-14 md:px-8 md:pb-16 md:pt-20">
        <p className="text-sm uppercase tracking-[0.35em] text-link">Personal work</p>
        <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.95] text-foreground md:text-7xl lg:text-8xl">
          Gallery
        </h1>
      </section>

      {/* Dark treatment — the photographs light up out of the page. Edge to
          edge, no rule above it; the change of background does the separating. */}
      <section className="section-dark w-full py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="gap-3 space-y-3 sm:columns-2 md:gap-4 md:space-y-4 lg:columns-3">
          {galleryPhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Enlarge photograph: ${photo.alt}`}
              /* Square corners, no border — the photograph sits directly on
                 the section background. */
              className="group block w-full break-inside-avoid overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-0"
            >
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </button>
          ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox images={galleryPhotos} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </main>
  )
}
