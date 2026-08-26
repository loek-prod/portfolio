import { SiteHeader } from "@/components/site-header"

interface PlaceholderPageProps {
  title: string
  path: string
}

export function PlaceholderPage({ title, path }: PlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader currentPath={path} />
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <h1 className="text-balance text-center text-5xl font-semibold text-foreground md:text-7xl">{title}</h1>
      </section>
    </main>
  )
}
