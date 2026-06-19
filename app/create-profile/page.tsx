"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, ArrowLeft, Mountain, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type ProfileData = {
  name: string
  instagram: string
  city: string
  age: string
  trailStamina: string
  walkingPace: string
  morningPerson: string
  talkativeLevel: string
  musicPreference: string
  photographyStyle: string
  restFrequency: string
  dietaryPreference: string
  smokingDrinking: string
  riskTolerance: string
}

const steps = [
  { id: "intro", title: "Welcome" },
  { id: "basics", title: "About You" },
  { id: "stamina", title: "Trail Stamina" },
  { id: "pace", title: "Walking Pace" },
  { id: "morning", title: "Morning Person" },
  { id: "social", title: "Social Vibe" },
  { id: "music", title: "Music & Silence" },
  { id: "photography", title: "Photography" },
  { id: "rest", title: "Rest Stops" },
  { id: "food", title: "Food & Diet" },
  { id: "habits", title: "Habits" },
  { id: "risk", title: "Risk Style" },
  { id: "complete", title: "All Done" },
]

export default function CreateProfilePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    instagram: "",
    city: "",
    age: "",
    trailStamina: "",
    walkingPace: "",
    morningPerson: "",
    talkativeLevel: "",
    musicPreference: "",
    photographyStyle: "",
    restFrequency: "",
    dietaryPreference: "",
    smokingDrinking: "",
    riskTolerance: "",
  })

  const updateProfile = (key: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = ((currentStep) / (steps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mountain className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">SoloSaathi</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <span>{currentStep} of {steps.length - 2}</span>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 pb-32 px-6">
        <div className="max-w-xl mx-auto">
          {/* Step: Intro */}
          {currentStep === 0 && (
            <StepContainer>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {"Let's find your perfect trail companion"}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {"We'll ask you a few questions about how you trek. Be honest — there are no wrong answers, just different styles."}
                </p>
                <div className="bg-muted/50 rounded-xl p-6 text-left mb-8">
                  <p className="text-sm text-muted-foreground mb-3">This takes about 3 minutes</p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Your basic info
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Trail preferences & stamina
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Social vibe & habits
                    </li>
                  </ul>
                </div>
                <Button size="lg" onClick={nextStep} className="w-full sm:w-auto">
                  {"Let's Begin"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </StepContainer>
          )}

          {/* Step: Basic Info */}
          {currentStep === 1 && (
            <StepContainer>
              <QuestionHeader 
                emoji="👋"
                title="First, tell us about yourself"
                subtitle="This helps your potential companions know who they're matching with"
              />
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your name</label>
                  <Input 
                    placeholder="What should we call you?"
                    value={profile.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                    className="text-lg py-6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Instagram handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input 
                      placeholder="your_handle"
                      value={profile.instagram}
                      onChange={(e) => updateProfile("instagram", e.target.value)}
                      className="text-lg py-6 pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Helps matches check out your vibe beforehand</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">City</label>
                    <Input 
                      placeholder="Where are you based?"
                      value={profile.city}
                      onChange={(e) => updateProfile("city", e.target.value)}
                      className="py-6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                    <Input 
                      type="number"
                      placeholder="25"
                      value={profile.age}
                      onChange={(e) => updateProfile("age", e.target.value)}
                      className="py-6"
                    />
                  </div>
                </div>
              </div>
            </StepContainer>
          )}

          {/* Step: Trail Stamina */}
          {currentStep === 2 && (
            <StepContainer>
              <QuestionHeader 
                emoji="🏔️"
                title="How would you describe your trail stamina?"
                subtitle="Be honest — matching with someone at a different level can make or break a trek"
              />
              <OptionGrid
                options={[
                  { value: "beginner", label: "Just Starting", description: "Easy trails, 5-8 km/day is my sweet spot" },
                  { value: "moderate", label: "Building Up", description: "Moderate trails, 10-15 km/day works for me" },
                  { value: "experienced", label: "Pretty Fit", description: "Challenging trails, 15-20 km/day, no problem" },
                  { value: "advanced", label: "Beast Mode", description: "Tough trails, 20+ km/day, bring it on" },
                ]}
                selected={profile.trailStamina}
                onSelect={(value) => updateProfile("trailStamina", value)}
              />
            </StepContainer>
          )}

          {/* Step: Walking Pace */}
          {currentStep === 3 && (
            <StepContainer>
              <QuestionHeader 
                emoji="🚶"
                title="What's your natural walking pace?"
                subtitle="Some like to cruise, others like to race — neither is wrong"
              />
              <OptionGrid
                options={[
                  { value: "slow", label: "Slow & Steady", description: "I like to soak it all in, no rush" },
                  { value: "moderate", label: "Moderate", description: "Comfortable pace with time to enjoy" },
                  { value: "brisk", label: "Brisk Walker", description: "I like to cover ground efficiently" },
                  { value: "fast", label: "Speed Demon", description: "Let's push it, time is precious" },
                ]}
                selected={profile.walkingPace}
                onSelect={(value) => updateProfile("walkingPace", value)}
              />
            </StepContainer>
          )}

          {/* Step: Morning Person */}
          {currentStep === 4 && (
            <StepContainer>
              <QuestionHeader 
                emoji="🌅"
                title="Early bird or night owl?"
                subtitle="Trek start times can be a dealbreaker"
              />
              <OptionGrid
                options={[
                  { value: "early", label: "Early Bird", description: "4-5 AM starts? I'm already stretching" },
                  { value: "moderate", label: "Normal Human", description: "6-7 AM is reasonable, thanks" },
                  { value: "late", label: "Night Owl", description: "Can we start after breakfast?" },
                  { value: "flexible", label: "Flexible", description: "I can adapt to whatever works" },
                ]}
                selected={profile.morningPerson}
                onSelect={(value) => updateProfile("morningPerson", value)}
              />
            </StepContainer>
          )}

          {/* Step: Social Vibe */}
          {currentStep === 5 && (
            <StepContainer>
              <QuestionHeader 
                emoji="💬"
                title="How chatty are you on the trail?"
                subtitle="Some love deep conversations, others prefer peaceful silence"
              />
              <OptionGrid
                options={[
                  { value: "quiet", label: "Quiet Companion", description: "I enjoy peaceful silence and my thoughts" },
                  { value: "occasional", label: "Occasional Chat", description: "A few words here and there is nice" },
                  { value: "chatty", label: "Love to Talk", description: "Let's share stories and get to know each other" },
                  { value: "very-chatty", label: "Non-Stop Chat", description: "I can talk about everything under the sun" },
                ]}
                selected={profile.talkativeLevel}
                onSelect={(value) => updateProfile("talkativeLevel", value)}
              />
            </StepContainer>
          )}

          {/* Step: Music */}
          {currentStep === 6 && (
            <StepContainer>
              <QuestionHeader 
                emoji="🎵"
                title="Music on the trail?"
                subtitle="This is surprisingly divisive"
              />
              <OptionGrid
                options={[
                  { value: "no-music", label: "Nature Only", description: "I prefer natural sounds, no music please" },
                  { value: "earphones", label: "Earphones Only", description: "I'll listen to mine, you listen to yours" },
                  { value: "shared-soft", label: "Soft Background", description: "Some gentle tunes for the group" },
                  { value: "shared-loud", label: "Speaker Party", description: "Let's make some noise!" },
                ]}
                selected={profile.musicPreference}
                onSelect={(value) => updateProfile("musicPreference", value)}
              />
            </StepContainer>
          )}

          {/* Step: Photography */}
          {currentStep === 7 && (
            <StepContainer>
              <QuestionHeader 
                emoji="📸"
                title="How often do you stop for photos?"
                subtitle="Instagram vs Insta-gone"
              />
              <OptionGrid
                options={[
                  { value: "minimal", label: "Rarely", description: "Maybe at the summit, that's it" },
                  { value: "occasional", label: "Occasionally", description: "At scenic spots, but let's keep moving" },
                  { value: "frequent", label: "Frequently", description: "I need those shots for the gram" },
                  { value: "constant", label: "Photo First", description: "Every angle, every moment, documented" },
                ]}
                selected={profile.photographyStyle}
                onSelect={(value) => updateProfile("photographyStyle", value)}
              />
            </StepContainer>
          )}

          {/* Step: Rest Stops */}
          {currentStep === 8 && (
            <StepContainer>
              <QuestionHeader 
                emoji="☕"
                title="How often do you like to take breaks?"
                subtitle="Everyone needs rest, but frequency varies"
              />
              <OptionGrid
                options={[
                  { value: "minimal", label: "Power Through", description: "One or two stops max, keep pushing" },
                  { value: "normal", label: "Regular Breaks", description: "Every hour or so works for me" },
                  { value: "frequent", label: "Frequent Stops", description: "I like to rest often and enjoy the views" },
                  { value: "flexible", label: "Go With Flow", description: "Whatever the group needs" },
                ]}
                selected={profile.restFrequency}
                onSelect={(value) => updateProfile("restFrequency", value)}
              />
            </StepContainer>
          )}

          {/* Step: Food & Diet */}
          {currentStep === 9 && (
            <StepContainer>
              <QuestionHeader 
                emoji="🍽️"
                title="Any dietary preferences?"
                subtitle="Good to know for shared meals and planning"
              />
              <OptionGrid
                options={[
                  { value: "vegetarian", label: "Vegetarian", description: "No meat or fish for me" },
                  { value: "vegan", label: "Vegan", description: "Plant-based all the way" },
                  { value: "non-veg", label: "Non-Vegetarian", description: "I eat everything" },
                  { value: "flexible", label: "Flexible", description: "I can adapt to what's available" },
                ]}
                selected={profile.dietaryPreference}
                onSelect={(value) => updateProfile("dietaryPreference", value)}
              />
            </StepContainer>
          )}

          {/* Step: Smoking/Drinking */}
          {currentStep === 10 && (
            <StepContainer>
              <QuestionHeader 
                emoji="🍺"
                title="Smoking or drinking on treks?"
                subtitle="No judgment, just preferences"
              />
              <OptionGrid
                options={[
                  { value: "neither", label: "Neither", description: "I prefer to keep it clean on trails" },
                  { value: "drink-only", label: "Social Drinker", description: "A drink at camp is nice" },
                  { value: "smoke-only", label: "Occasional Smoker", description: "I might light up occasionally" },
                  { value: "both", label: "Both Okay", description: "I'm open to either" },
                ]}
                selected={profile.smokingDrinking}
                onSelect={(value) => updateProfile("smokingDrinking", value)}
              />
            </StepContainer>
          )}

          {/* Step: Risk Tolerance */}
          {currentStep === 11 && (
            <StepContainer>
              <QuestionHeader 
                emoji="⚡"
                title="How do you handle risk on the trail?"
                subtitle="Weather turns bad, path looks sketchy — what do you do?"
              />
              <OptionGrid
                options={[
                  { value: "cautious", label: "Play It Safe", description: "Better to turn back than risk it" },
                  { value: "moderate", label: "Balanced", description: "Assess the situation, decide together" },
                  { value: "adventurous", label: "Push Boundaries", description: "A little risk makes it exciting" },
                  { value: "flexible", label: "Group Decision", description: "I'll go with what the group decides" },
                ]}
                selected={profile.riskTolerance}
                onSelect={(value) => updateProfile("riskTolerance", value)}
              />
            </StepContainer>
          )}

          {/* Step: Complete */}
          {currentStep === 12 && (
            <StepContainer>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl">🎉</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {"You're all set, " + (profile.name || "trekker") + "!"}
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {"Your profile is ready. Now let's find some compatible companions for your next adventure."}
                </p>
                
                {/* Profile summary */}
                <div className="bg-muted/50 rounded-xl p-6 text-left mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Your Trek Style</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <ProfileTag label="Stamina" value={profile.trailStamina} />
                    <ProfileTag label="Pace" value={profile.walkingPace} />
                    <ProfileTag label="Morning" value={profile.morningPerson} />
                    <ProfileTag label="Social" value={profile.talkativeLevel} />
                    <ProfileTag label="Music" value={profile.musicPreference} />
                    <ProfileTag label="Photos" value={profile.photographyStyle} />
                  </div>
                </div>

                <Link href="/matches">
                  <Button size="lg" className="w-full sm:w-auto">
                    Find My Matches
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </StepContainer>
          )}
        </div>
      </main>

      {/* Navigation footer */}
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border">
          <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={nextStep} disabled={!canProceed(currentStep, profile)}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center py-12 animate-in fade-in slide-in-from-right-4 duration-500">
      {children}
    </div>
  )
}

function QuestionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <span className="text-4xl mb-4 block">{emoji}</span>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function OptionGrid({ 
  options, 
  selected, 
  onSelect 
}: { 
  options: { value: string; label: string; description: string }[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            selected === option.value
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <div className="font-medium text-foreground">{option.label}</div>
          <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
        </button>
      ))}
    </div>
  )
}

function ProfileTag({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground capitalize">{value.replace(/-/g, " ")}</span>
    </div>
  )
}

function canProceed(step: number, profile: ProfileData): boolean {
  switch (step) {
    case 1:
      return profile.name.length > 0
    case 2:
      return profile.trailStamina !== ""
    case 3:
      return profile.walkingPace !== ""
    case 4:
      return profile.morningPerson !== ""
    case 5:
      return profile.talkativeLevel !== ""
    case 6:
      return profile.musicPreference !== ""
    case 7:
      return profile.photographyStyle !== ""
    case 8:
      return profile.restFrequency !== ""
    case 9:
      return profile.dietaryPreference !== ""
    case 10:
      return profile.smokingDrinking !== ""
    case 11:
      return profile.riskTolerance !== ""
    default:
      return true
  }
}
