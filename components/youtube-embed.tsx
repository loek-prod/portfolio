"use client"

import { useState } from "react"
import { Play } from "lucide-react"

export type VideoOrientation = "landscape" | "vertical"

export interface VideoItem {
  id: string
  title: string
  orientation: VideoOrientation
}

export function YouTubeEmbed({ id, title, orientation }: VideoItem) {
  const [playing, setPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)

  const ratioClass = orientation === "vertical" ? "aspect-[9/16]" : "aspect-video"
  const thumbnail = thumbFailed
    ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-xl border border-clay/30 bg-earth ${ratioClass}`}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            onError={() => setThumbFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/10" />
          <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 backdrop-blur-sm">
            <Play className="h-4 w-4 fill-cream text-cream" />
            <span className="text-sm font-medium text-cream">Play</span>
          </span>
        </button>
      )}
    </div>
  )
}
