export interface FeaturedPiece {
  /** YouTube id — used only for the still thumbnail on the home page. */
  videoId: string
  title: string
  /** Decorative tag, rendered in the display font. */
  tag: string
  /** Where the card routes to. The home page never plays video itself. */
  href: string
  destination: string
}

/**
 * The home page teaser. Keep this short — three or four pieces at most.
 * The full libraries live on /work and /passion-projects.
 */
export const featuredPieces: FeaturedPiece[] = [
  {
    videoId: "yT6WY2cFT8c",
    title: "WTP Buynamics",
    tag: "client film",
    href: "/work",
    destination: "See all client work",
  },
  {
    videoId: "MIV0ZJXb2j0",
    title: "Stillen Wonden",
    tag: "short film",
    href: "/passion-projects",
    destination: "See all passion projects",
  },
  {
    videoId: "R87DgrzpIrE",
    title: "Brisenhaus",
    tag: "on location",
    href: "/passion-projects",
    destination: "See all passion projects",
  },
]
