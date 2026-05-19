"use client"

import { ExternalLink, Lightbulb, Rocket, Code, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-context"

interface Project {
  titleKey: string
  descriptionKey: string
  roleKey: string
  tags: string[]
  link?: string
  icon: "lightbulb" | "rocket" | "code" | "trending"
}

const projects: Project[] = [
  {
    titleKey: "project1",
    descriptionKey: "project1",
    roleKey: "project1",
    tags: ["Technology", "Startup", "AI"],
    link: "#",
    icon: "rocket",
  },
  {
    titleKey: "project2",
    descriptionKey: "project2",
    roleKey: "project2",
    tags: ["Design", "Branding", "Strategy"],
    link: "#",
    icon: "lightbulb",
  },
  {
    titleKey: "project3",
    descriptionKey: "project3",
    roleKey: "project3",
    tags: ["Web3", "Blockchain", "Innovation"],
    link: "#",
    icon: "code",
  },
  {
    titleKey: "project4",
    descriptionKey: "project4",
    roleKey: "project4",
    tags: ["Business", "Growth", "Marketing"],
    link: "#",
    icon: "trending",
  },
]

const iconMap = {
  lightbulb: Lightbulb,
  rocket: Rocket,
  code: Code,
  trending: TrendingUp,
}

export function InnovationSection() {
  const { t } = useLanguage()
  
  const getProjectTranslation = (key: string) => {
    const projectKey = key as keyof typeof t.innovation.projects
    return t.innovation.projects[projectKey]
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">{t.innovation.title}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.innovation.subtitle}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          const IconComponent = iconMap[project.icon]
          const projectData = getProjectTranslation(project.titleKey)
          return (
            <div
              key={index}
              className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 hover:bg-primary/20 transition-colors">
                <IconComponent className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3">{projectData.title}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{projectData.description}</p>

              {/* Role */}
              <p className="text-sm font-medium text-primary mb-4">{projectData.role}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link */}
              {project.link && (
                <Button variant="outline" className="group/btn rounded-full bg-transparent" asChild>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    {t.innovation.learnMore}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <div className="bg-card border border-border rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">{t.innovation.haveIdea}</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t.innovation.haveIdeaDescription}
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <a href="/contact">{t.innovation.getInTouch}</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
