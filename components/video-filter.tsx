"use client"

interface VideoFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function VideoFilter({ categories, selectedCategory, onCategoryChange }: VideoFilterProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-between overflow-hidden rounded-xl bg-background/10 backdrop-blur-sm">
        {categories.map((category, index) => {
          const isActive = selectedCategory === category
          const isFirst = index === 0
          const isLast = index === categories.length - 1
          const prevActive = index > 0 && selectedCategory === categories[index - 1]
          const nextActive = index < categories.length - 1 && selectedCategory === categories[index + 1]

          return (
            <div
              key={category}
              className={`flex items-center justify-center px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base transition-all duration-300 cursor-pointer touch-manipulation ${
                isActive
                  ? "mx-2 rounded-xl bg-background font-semibold text-foreground"
                  : `text-primary-foreground/70 hover:text-primary-foreground ${
                      (prevActive || isFirst) && "rounded-l-xl"
                    } ${(nextActive || isLast) && "rounded-r-xl"}`
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </div>
          )
        })}
      </div>
    </div>
  )
}
