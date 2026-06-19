import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, BadgeCheck, Phone, Star, Clock } from "lucide-react"

const safetyFeatures = [
  {
    icon: BadgeCheck,
    title: "ID Verification",
    description: "Every member verified via government ID. Real people, real identities."
  },
  {
    icon: Star,
    title: "Trail Ratings",
    description: "Post-trek reviews from past companions. See how they actually performed."
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    description: "Verified emergency contacts shared with your match. Peace of mind for everyone."
  },
  {
    icon: Shield,
    title: "Trust Infrastructure",
    description: "Community density in specific trek corridors. Data on what makes matches succeed."
  }
]

export function SafetySection() {
  return (
    <section id="safety" className="py-24 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Safety First</span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                <Clock className="w-3 h-3 mr-1" />
                Launching Soon
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6 text-balance">
              Trust infrastructure built for the trail
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Our moat is trust. ID verification, trail ratings, emergency contacts, and community density 
              in specific trek corridors. Plus data on what makes matches succeed.
            </p>
            <p className="text-base text-primary font-medium mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Free to use during our launch phase
            </p>

            <div className="space-y-6">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 opacity-80">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <Card className="bg-card border-border overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-primary/10 via-white to-accent/20 flex items-center justify-center relative">
                  {/* Coming soon overlay */}
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-primary/30">
                        <Shield className="w-12 h-12 text-primary/60" />
                      </div>
                      <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        Coming Soon
                      </Badge>
                      <p className="text-xl font-bold text-foreground mb-2">Verified Safety Layer</p>
                      <p className="text-muted-foreground text-sm">Free during launch</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-amber-200">
              Coming Soon
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card border border-border px-4 py-2 rounded-full text-sm text-foreground shadow-lg">
              Free at launch
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
