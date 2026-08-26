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
        <p className="text-sm uppercase tracking-[0.35em] text-accent">Personal work</p>
        <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.95] text-foreground md:text-7xl lg:text-8xl">
          Gallery
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Photographs taken for myself — travelling, walking, waiting for the light. No brief, no client, just what
          caught my eye.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="gap-3 space-y-3 sm:columns-2 md:gap-4 md:space-y-4 lg:columns-3">
          {galleryPhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Enlarge photograph: ${photo.alt}`}
              className="group block w-full break-inside-avoid overflow-hidden rounded-lg border border-clay/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

      {lightboxIndex !== null && (
        <Lightbox images={galleryPhotos} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </main>
  )
}
