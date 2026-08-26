"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Lightbox } from "@/components/lightbox"
import { LoadingScreen } from "@/components/loading-screen"
import { SiteHeader } from "@/components/site-header"
import { PhotoGallery3D } from "@/components/photo-gallery-3d"
import { useLanguage } from "@/components/language-context"
import { galleryPhotos } from "@/lib/gallery-photos"
import { featuredPieces } from "@/lib/featured"

/** Home only teases the photography — the full set lives on /gallery. */
const teaserPhotos = galleryPhotos.slice(0, 6)

const entryPoints = [
  { href: "/work", label: "Work", description: "Films made with clients" },
  { href: "/passion-projects", label: "Passion Projects", description: "Made because I wanted to" },
  { href: "/gallery", label: "Gallery", description: "Photographs taken for myself" },
]

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    if (!sessionStorage.getItem("hasSeenLoading")) setIsLoading(true)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    sessionStorage.setItem("hasSeenLoading", "true")
  }

  if (!mounted) return null
  if (isLoading) return <LoadingScreen photos={teaserPhotos} onComplete={handleLoadingComplete} />

  return (
    <main className="min-h-screen bg-background">
      {/* Cinematic hero — the one big statement on the page */}
      <section className="relative flex h-[92svh] min-h-[540px] flex-col justify-end overflow-hidden">
        <div className="hero-zoom-fade absolute inset-0">
          <Image
            src="/images/photo3.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/60"
          aria-hidden="true"
        />

        <SiteHeader currentPath="/" overlay />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
          <p className="font-display text-2xl text-link md:text-3xl">film &amp; photography</p>
          <h1 className="mt-2 max-w-4xl text-balance text-5xl font-bold leading-[0.92] text-cream sm:text-6xl md:text-7xl lg:text-8xl">
            Stories worth sitting still for
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/85 md:text-xl">
            Loek Lutgens — filmmaker and photographer based in Switzerland, working on client films and personal work
            across Europe.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/work" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="btn-bubble btn-bubble--solid w-full px-8 py-6 text-lg text-primary-foreground sm:w-auto"
              >
                View work
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="btn-bubble btn-bubble--on-image w-full px-8 py-6 text-lg sm:w-auto"
              >
                {t.visual.contactMe}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Curated teaser — three pieces that route onward, not the whole library */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24" aria-labelledby="featured-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-link">Selected</p>
            <h2 id="featured-heading" className="mt-3 text-balance text-4xl font-bold text-foreground md:text-5xl">
              A few pieces
            </h2>
          </div>
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-lg text-foreground transition-colors hover:text-link"
          >
            All client work
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPieces.map((piece) => (
            <li key={piece.videoId}>
              <Link href={piece.href} className="group block">
                {/* No frame: square corners, no border, no card background. */}
                <div className="relative aspect-video overflow-hidden">
                  {/* Still frame only — no embeds on the home page. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${piece.videoId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/5" />
                </div>
                {/* Single line under the media — title only. */}
                <h3 className="mt-4 text-2xl font-semibold text-foreground transition-colors group-hover:text-link md:text-3xl">
                  {piece.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Photography teaser */}
      {/* Dark treatment — the photographs light up out of the page. No rule above. */}
      <section className="section-dark w-full py-16 md:py-24" aria-labelledby="photos-heading">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 md:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-link">Personal work</p>
            <h2 id="photos-heading" className="mt-3 text-balance text-4xl font-bold text-foreground md:text-5xl">
              Photographs
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 text-lg text-foreground transition-colors hover:text-link"
          >
            Full gallery
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
        <PhotoGallery3D compact photos={teaserPhotos} onOpenLightbox={(index) => setLightboxIndex(index)} />
      </section>

      {/* Clear entry points to every section.
          Full bleed image treatment: photograph edge to edge, dark scrim over it,
          cream text on top. This photograph is deliberately one of the darkest in
          the set so the specified 42% scrim still clears AA — see .section-scrim. */}
      <nav className="section-on-image relative w-full overflow-hidden" aria-label="Browse sections">
        <Image
          src="/images/photo-bridge.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="section-scrim absolute inset-0" aria-hidden="true" />
        <ul className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          {entryPoints.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className="group flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-8 md:py-10"
              >
                <span className="text-4xl font-bold text-foreground transition-colors group-hover:text-link md:text-6xl">
                  {entry.label}
                </span>
                <span className="flex items-center gap-4 text-base text-muted-foreground md:text-lg">
                  {entry.description}
                  <ArrowRight
                    className="h-6 w-6 shrink-0 text-link transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Light treatment — differs from the full bleed section above it. */}
      <footer className="bg-background px-4 py-16 text-foreground md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl">
            {t.visual.letsWorkTogether}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl px-4 text-lg leading-relaxed text-muted-foreground md:mb-12 md:text-xl">
            {t.visual.workTogetherDescription}
          </p>
          <div className="mb-8 flex flex-col justify-center gap-4 px-4 sm:flex-row md:mb-12">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="btn-bubble btn-bubble--solid w-full px-8 py-6 text-lg text-primary-foreground sm:w-auto"
              >
                {t.visual.contactMe}
              </Button>
            </Link>
            <a
              href="https://www.instagram.com/ll_exist/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="btn-bubble btn-bubble--outline w-full px-8 py-6 text-lg text-foreground sm:w-auto"
              >
                {t.visual.instagram}
              </Button>
            </a>
          </div>
          <div className="pt-8">
            <p className="text-sm text-muted-foreground md:text-base">
              © {new Date().getFullYear()} {t.visual.copyright}
            </p>
          </div>
        </div>
      </footer>

      {lightboxIndex !== null && (
        <Lightbox images={teaserPhotos} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </main>
  )
}
