import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"
import Image from "next/image"

const stories = [
  {
    quote: "Met Priya through SoloSaathi for Kedarkantha. We had the exact same pace and both loved early morning starts. By day 2, it felt like we'd known each other for years.",
    name: "Arjun M.",
    trek: "Kedarkantha, December 2025",
    initials: "AM",
    matchScore: "94%"
  },
  {
    quote: "I was nervous about doing Hampta Pass solo. My match Rohan had done it twice before. His experience plus our matching vibe made it the best trek of my life.",
    name: "Sneha K.",
    trek: "Hampta Pass, May 2025",
    initials: "SK",
    matchScore: "91%"
  },
  {
    quote: "The compatibility matching is real. Same budget, same food preferences, same love for sunset photography. We're planning our third trek together now.",
    name: "Vikram S.",
    trek: "Valley of Flowers, August 2025",
    initials: "VS",
    matchScore: "97%"
  }
]

export function StoriesSection() {
  return (
    <section id="stories" className="py-24 px-6 bg-muted/30 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/trekkers-trail.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Trail Stories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
            Strangers to summit buddies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Real matches, real treks, real friendships. One viral story at a time.
          </p>
        </div>

        {/* Stories grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">{story.quote}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">{story.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{story.name}</p>
                      <p className="text-sm text-muted-foreground">{story.trek}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{story.matchScore}</p>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Join the tight-knit Himalayan trekking community
          </p>
          <div className="flex items-center justify-center gap-8 text-2xl font-bold text-foreground">
            <div>
              <span className="text-primary">8-10M</span>
              <p className="text-sm font-normal text-muted-foreground">Solo travelers in India</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <span className="text-primary">20%</span>
              <p className="text-sm font-normal text-muted-foreground">YoY Growth</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
