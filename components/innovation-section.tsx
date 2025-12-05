"use client"

import { ExternalLink, Lightbulb, Rocket, Code, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Project {
  title: string
  description: string
  role: string
  tags: string[]
  link?: string
  icon: "lightbulb" | "rocket" | "code" | "trending"
}

const projects: Project[] = [
  {
    title: "Project Name 1",
    description: "A brief description of this innovation project. Explain what problem it solves and its impact.",
    role: "Founder & Developer",
    tags: ["Technology", "Startup", "AI"],
    link: "#",
    icon: "rocket",
  },
  {
    title: "Project Name 2",
    description: "Another innovative project description. Highlight the key features and achievements.",
    role: "Creative Director",
    tags: ["Design", "Branding", "Strategy"],
    link: "#",
    icon: "lightbulb",
  },
  {
    title: "Project Name 3",
    description: "Description of a technical or business project. What makes it unique?",
    role: "Lead Developer",
    tags: ["Web3", "Blockchain", "Innovation"],
    link: "#",
    icon: "code",
  },
  {
    title: "Project Name 4",
    description: "A growth-focused project or business venture. Share the results and learnings.",
    role: "Co-Founder",
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
  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Innovation & Projects</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Beyond visual storytelling, I'm passionate about building innovative solutions and exploring new technologies.
          Here are some of my ventures.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          const IconComponent = iconMap[project.icon]
          return (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

              {/* Role */}
              <p className="text-sm font-medium text-primary mb-4">{project.role}</p>

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
                    Learn More
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
          <h3 className="text-3xl font-bold mb-4">Have an idea?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            I'm always looking for exciting new projects and collaborations. Let's build something innovative together.
          </p>
          <Button size="lg" className="rounded-full px-8" asChild>
            <a href="/contact">Get in Touch</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
