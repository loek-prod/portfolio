"use client"

interface RollingTextProps {
  text: string
}

export function RollingText({ text }: RollingTextProps) {
  return (
    <span className="nav-label">
      {text.split("").map((char, index) => (
        <span key={index} className="nav-char" style={{ transitionDelay: `${index * 20}ms` }}>
          <span className="nav-text nav-text-top">{char}</span>
          <span className="nav-text nav-text-bottom">{char}</span>
        </span>
      ))}
    </span>
  )
}
