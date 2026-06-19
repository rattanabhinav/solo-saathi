import { UserPlus, Compass, MessageCircle, MapPin } from "lucide-react"
import Image from "next/image"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Tell us about your trek stamina, pace preference, accommodation style, budget range, and vibe. The more honest, the better your match."
  },
  {
    number: "02",
    icon: Compass,
    title: "Choose Your Trek",
    description: "Select the Himalayan corridor you're planning — Kedarkantha, Hampta Pass, Valley of Flowers. We match within specific routes."
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Meet Your Match",
    description: "Get matched with 1-3 compatible trekkers. Chat, video call, and build trust before committing. No pressure, no obligation."
  },
  {
    number: "04",
    icon: MapPin,
    title: "Hit the Trail",
    description: "Arrive at the trailhead already feeling like friends. Share costs, share laughs, share the summit selfie."
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6 text-balance">
            From stranger to summit buddy in 4 steps
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center ${index !== 0 ? 'lg:mt-24' : ''}`}
              >
                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} relative`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="text-6xl font-bold text-secondary">{step.number}</span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>

                {/* Icon card */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} mt-6 lg:mt-0`}>
                  <div className={`flex ${index % 2 === 1 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                    <div className="relative w-full max-w-sm">
                      {/* Dot on timeline */}
                      <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10"
                        style={{ [index % 2 === 1 ? 'right' : 'left']: '-2rem' }}
                      />
                      <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg border border-primary/10">
                        {/* Background image */}
                        <Image
                          src={index === 0 ? "/images/hero-bg.png" : index === 3 ? "/images/trekkers-summit.png" : "/images/trekkers-trail.png"}
                          alt={step.title}
                          fill
                          className="object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
                        
                        {/* Icon and text overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center mb-4 shadow-lg">
                            <step.icon className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-white font-semibold text-center text-sm px-4">{step.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
