"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Mountain, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import {
  type ProfileData,
  savePendingProfile,
  saveProfileToSupabase,
} from "@/lib/profile"
import {
  type ProfileQuestion,
  type QuestionOption,
  PROFILE_QUESTIONS,
  TREK_DESTINATIONS,
} from "@/lib/profile-questions"

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
  return (
    <Suspense fallback={null}>
      <CreateProfileForm />
    </Suspense>
  )
}

function CreateProfileForm() {
  const searchParams = useSearchParams()
  const authMode = searchParams.get("mode") === "login" ? "login" : "signup"
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    trekDestination: "",
    phone: "",
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

  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

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

  const handleFinish = async () => {
    setSaving(true)
    setSaveError(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      savePendingProfile(profile)
      router.push(authMode === "login" ? "/auth?mode=login" : "/auth")
      return
    }

    const { error } = await saveProfileToSupabase(user.id, profile)

    if (error) {
      setSaveError(error)
      setSaving(false)
    } else {
      router.push("/matches")
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
                    className="py-6"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Trek destination</label>
                    <Select
                      value={profile.trekDestination}
                      onValueChange={(value) => updateProfile("trekDestination", value)}
                    >
                      <SelectTrigger className="text-sm h-auto py-4">
                        <SelectValue placeholder="Select trek" />
                      </SelectTrigger>
                      <SelectContent>
                        {TREK_DESTINATIONS.map((trek) => (
                          <SelectItem key={trek.value} value={trek.value}>{trek.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={profile.phone}
                      onChange={(e) => updateProfile("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="py-5"
                    />
                  </div>
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

          {/* Question steps — content lives in lib/profile-questions.ts */}
          {currentStep === 2 && (
            <QuestionStep question={PROFILE_QUESTIONS.stamina} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 3 && (
            <QuestionStep question={PROFILE_QUESTIONS.pace} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 4 && (
            <QuestionStep question={PROFILE_QUESTIONS.morning} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 5 && (
            <QuestionStep question={PROFILE_QUESTIONS.chat} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 6 && (
            <QuestionStep question={PROFILE_QUESTIONS.music} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 7 && (
            <QuestionStep question={PROFILE_QUESTIONS.photos} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 8 && (
            <QuestionStep question={PROFILE_QUESTIONS.breaks} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 9 && (
            <QuestionStep question={PROFILE_QUESTIONS.dietary} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 10 && (
            <QuestionStep question={PROFILE_QUESTIONS.habits} profile={profile} onSelect={updateProfile} />
          )}
          {currentStep === 11 && (
            <QuestionStep question={PROFILE_QUESTIONS.risk} profile={profile} onSelect={updateProfile} />
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
                  {"Almost there! Create a free account to save your profile and find compatible companions."}
                </p>
                
                {/* Profile summary */}
                <div className="bg-muted/50 rounded-xl p-6 text-left mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Your Trek Style</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <ProfileTag label="Trek" value={profile.trekDestination} />
                    <ProfileTag label="Stamina" value={profile.trailStamina} />
                    <ProfileTag label="Pace" value={profile.walkingPace} />
                    <ProfileTag label="Morning" value={profile.morningPerson} />
                    <ProfileTag label="Social" value={profile.talkativeLevel} />
                    <ProfileTag label="Music" value={profile.musicPreference} />
                    <ProfileTag label="Photos" value={profile.photographyStyle} />
                  </div>
                </div>

                {saveError && (
                  <p className="text-sm text-destructive text-center mb-2">{saveError}</p>
                )}
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={handleFinish}
                  disabled={saving}
                >
                  {saving ? "Saving your profile…" : authMode === "login" ? "Continue to Log In" : "Continue to Sign Up"}
                  {!saving && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
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

function QuestionStep({
  question,
  profile,
  onSelect,
}: {
  question: ProfileQuestion
  profile: ProfileData
  onSelect: (key: keyof ProfileData, value: string) => void
}) {
  return (
    <StepContainer>
      <QuestionHeader emoji={question.emoji} title={question.title} subtitle={question.subtitle} />
      <OptionGrid
        options={question.options}
        selected={profile[question.field]}
        onSelect={(value) => onSelect(question.field, value)}
      />
    </StepContainer>
  )
}

function OptionGrid({
  options,
  selected,
  onSelect
}: {
  options: QuestionOption[]
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
      return profile.name.length > 0 && profile.trekDestination !== ""
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
