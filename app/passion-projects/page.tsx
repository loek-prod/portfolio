import { SiteHeader } from "@/components/site-header"
import { YouTubeEmbed, type VideoItem } from "@/components/youtube-embed"

interface PassionProject {
  title: string
  tag: string
  description: string
  note?: string
  video: VideoItem
}

const projects: PassionProject[] = [
  {
    title: "Stillen Wonden",
    tag: "short film",
    description: "A film where I served as assistant DOP and handled audio and editing, working as part of a collaborative team.",
    note: "Spoken in Dutch",
    video: { id: "MIV0ZJXb2j0", title: "Stillen Wonden — short film", orientation: "landscape" },
  },
  {
    title: "Brisenhaus",
    tag: "on location",
    description: "A cabin in Switzerland, filmed between the fog and the treeline.",
    video: { id: "R87DgrzpIrE", title: "Brisenhaus — a cabin in Switzerland", orientation: "landscape" },
  },
  {
    title: "Atomic",
    tag: "self initiated",
    description: "An AI generated spec piece for the ski brand Atomic.",
    video: { id: "-V9JmMuPD8M", title: "Atomic — AI generated ski spot", orientation: "vertical" },
  },
  {
    title: "Reunion teaser",
    tag: "just for fun",
    description: "AI generated teaser for a Maastricht University reunion on the beach at Zandvoort.",
    video: { id: "Y6I4mEgfGM0", title: "Reunion teaser — Zandvoort", orientation: "vertical" },
  },
]

export const metadata = {
  title: "Passion Projects | L'exist",
  description: "Personal and self initiated film work by L'exist.",
}

export default function PassionProjectsPage() {
  const landscapeProjects = projects.filter((project) => project.video.orientation === "landscape")
  const verticalProjects = projects.filter((project) => project.video.orientation === "vertical")

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPath="/passion-projects" />

      <section className="mx-auto max-w-5xl px-4 pb-10 pt-14 md:px-8 md:pb-16 md:pt-24">
        <p className="font-display text-2xl text-link md:text-3xl">no brief, no client</p>
        <h1 className="mt-3 text-balance text-5xl font-bold leading-[0.95] text-foreground md:text-7xl">
          Passion projects
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          These things have been made because I want them to exist.
        </p>
      </section>

      {/* Each project is its own edge-to-edge space, alternating light and dark.
          The stagger offsets are preserved inside the max-width container. */}
      <div>
        {landscapeProjects.map((project, index) => (
          <section
            key={project.title}
            className={`w-full py-16 md:py-24 ${index % 2 === 0 ? "section-dark" : ""}`}
          >
            <div className="mx-auto max-w-5xl px-4 md:px-8">
              {/* Don't offset — all projects center-aligned. Previous code had
                  even projects offset right, odd projects offset left. */}
              <article>
                <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="text-3xl font-semibold text-foreground md:text-4xl">{project.title}</h2>
                  <span className="font-display text-xl text-link md:text-2xl">{project.tag}</span>
                </div>
                <p className="mb-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  {project.description}
                </p>
                <YouTubeEmbed {...project.video} />
                {/* Semantic muted token so it inverts with the section treatment. */}
                {project.note && (
                  <p className="mt-3 font-display text-lg text-muted-foreground">{project.note}</p>
                )}
              </article>
            </div>
          </section>
        ))}
      </div>

      {/* Vertical set — dark treatment so it differs from the light section above. */}
      <section className="section-dark w-full py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <p className="font-display mb-8 text-2xl text-link md:text-3xl">shot vertical</p>
          <div className="flex flex-wrap items-start gap-8 md:gap-12">
            {verticalProjects.map((project) => (
              <article key={project.title} className="w-full max-w-[17rem] basis-[17rem]">
                <YouTubeEmbed {...project.video} />
                {/* Single line under the media — title only. */}
                <h2 className="mt-4 text-2xl font-semibold text-foreground">{project.title}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
