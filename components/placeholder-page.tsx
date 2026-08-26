import Image from "next/image"
import Link from "next/link"
import { MorphicNavbar } from "@/components/morphic-navbar"

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-clay/60 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 p-4 md:p-6 lg:p-8">
          <Link href="/" aria-label="L'exist home">
            <Image src="/images/lexist-logo.png" alt="L'exist" width={150} height={45} className="h-auto w-[100px] md:w-[120px] lg:w-[150px]" priority />
          </Link>
          <div className="hidden md:block">
            <MorphicNavbar />
          </div>
          <Link href="/" className="text-sm font-semibold text-accent hover:text-foreground md:hidden">Home</Link>
        </div>
      </header>
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
        <h1 className="font-display text-balance text-center text-5xl font-semibold text-foreground md:text-7xl">{title}</h1>
      </section>
    </main>
  )
}
