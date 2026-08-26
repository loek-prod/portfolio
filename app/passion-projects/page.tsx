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
    description: "A short film written, shot, and cut on my own terms.",
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
          The things I make because I want to see them exist. Some are films, some are experiments, all of them are
          mine.
        </p>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 pb-16 md:gap-24 md:px-8">
        {landscapeProjects.map((project, index) => (
          <article key={project.title} className={index % 2 === 1 ? "md:ml-16" : "md:mr-16"}>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">{project.title}</h2>
              <span className="font-display text-xl text-link md:text-2xl">{project.tag}</span>
            </div>
            <p className="mb-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {project.description}
            </p>
            <YouTubeEmbed {...project.video} />
            {project.note && (
              <p className="mt-3 font-display text-lg text-sand">{project.note}</p>
            )}
          </article>
        ))}
      </div>

      <section className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
        <p className="font-display mb-8 text-2xl text-link md:text-3xl">shot vertical</p>
        <div className="flex flex-wrap items-start gap-8 md:gap-12">
          {verticalProjects.map((project) => (
            <article key={project.title} className="w-full max-w-[17rem] basis-[17rem]">
              <YouTubeEmbed {...project.video} />
              <div className="mt-4">
                <span className="font-display text-xl text-link">{project.tag}</span>
                <h2 className="mt-1 text-2xl font-semibold text-foreground">{project.title}</h2>
                <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
