import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { YouTubeEmbed, type VideoItem } from "@/components/youtube-embed"

interface Client {
  name: string
  website?: string
  description: string
  videos: VideoItem[]
}

const clients: Client[] = [
  {
    name: "WTP Buynamics",
    website: "https://www.buynamics.com/",
    description:
      "B2B procurement SaaS platform. Ongoing video partner covering explainer, event, and interview formats.",
    videos: [
      { id: "yT6WY2cFT8c", title: "WTP Buynamics — film one", orientation: "landscape" },
      { id: "2X-7H1_Nz94", title: "WTP Buynamics — film two", orientation: "landscape" },
      { id: "VGCzEnAJiQ0", title: "WTP Buynamics — film three", orientation: "landscape" },
      { id: "G_N6h50NA_k", title: "WTP Buynamics — film four", orientation: "landscape" },
    ],
  },
  {
    name: "Leielodge",
    website: "https://www.leielodge.be/",
    description: "Airbnb property in Belgium. Property showcase film presenting the house.",
    videos: [{ id: "dOMox7DaGz4", title: "Leielodge — property showcase", orientation: "landscape" }],
  },
  {
    name: "Modernday",
    website: "https://modern-day.nl/",
    description: "Company providing AI training courses. Branding motion work.",
    videos: [{ id: "L8oyrBfeTM4", title: "Modernday — branding motion", orientation: "landscape" }],
  },
  {
    name: "beFesti",
    website: "https://befesti.com/",
    description: "Electronic music and events. Documentary style artist content.",
    videos: [{ id: "ZQJp0i4v4rg", title: "beFesti — artist documentary", orientation: "landscape" }],
  },
  {
    name: "Fuze Global",
    description: "Dutch party brand. Interview and atmosphere impression piece capturing the event.",
    videos: [{ id: "u-5Frj2SZ-0", title: "Fuze Global — event impression", orientation: "vertical" }],
  },
]

export const metadata = {
  title: "Work | L'exist",
  description: "Client case studies and commissioned video work by L'exist.",
}

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPath="/work" />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <p className="text-sm uppercase tracking-[0.35em] text-link">Client work</p>
        <h1 className="mt-4 text-balance text-5xl font-bold leading-[0.95] text-foreground md:text-7xl lg:text-8xl">
          Films made with clients
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Explainers, event coverage, interviews, and brand motion — produced end to end, from concept to final
          delivery.
        </p>
      </section>

      {/* No rules between clients — each client is its own edge-to-edge space,
          alternating light and dark so neighbours never share a treatment. */}
      <div>
        {clients.map((client, index) => (
          <section
            key={client.name}
            className={`w-full py-16 md:py-24 ${index % 2 === 0 ? "section-dark" : ""}`}
            aria-labelledby={`client-${index}`}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-8 lg:flex-row lg:gap-12">
              <div className="lg:w-1/3 lg:shrink-0">
                <h2 id={`client-${index}`} className="text-3xl font-semibold text-foreground md:text-4xl">
                  {client.website ? (
                    <Link
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-1.5 transition-colors hover:text-link"
                    >
                      {client.name}
                      <ArrowUpRight className="h-5 w-5 shrink-0 self-center" aria-hidden="true" />
                    </Link>
                  ) : (
                    client.name
                  )}
                </h2>
                <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  {client.description}
                </p>
              </div>

              <div className="flex flex-wrap items-start gap-6 lg:w-2/3">
                {client.videos.map((video) => (
                  <div
                    key={video.id}
                    className={
                      video.orientation === "vertical"
                        ? "w-full max-w-[17rem] basis-[17rem]"
                        : "w-full basis-full xl:basis-[calc(50%-0.75rem)]"
                    }
                  >
                    <YouTubeEmbed {...video} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
