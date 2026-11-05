"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Check, Mountain, Sparkles } from "lucide-react"
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

// Text inputs and the trek dropdown, styled for the dark page
const darkFieldClass =
  "h-12 rounded-xl border-white/14 bg-white/5 px-3.5 text-[15px] text-white placeholder:text-white/45 focus-visible:border-lime focus-visible:ring-lime/25"
const labelClass = "block text-sm font-semibold mb-1.5"
const limeButtonClass = "h-12 px-6 rounded-xl text-base gap-2.5 has-[>svg]:px-6"

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
  const isQuestionStep = currentStep > 0 && currentStep < steps.length - 1

  return (
    <div className="relative min-h-screen bg-forest text-white">
      <OnboardingBackdrop withFooter={isQuestionStep} />

      {/* Header */}
      <header className="bg-onboarding fixed top-0 left-0 right-0 z-50">
        <div className="px-6">
          <div className="max-w-[820px] mx-auto h-16 flex items-center justify-between">
            <Link href="/" className="type-display normal-case text-2xl flex items-center gap-2">
              <Mountain className="size-6 text-lime" />
              SoloSaathi
            </Link>
            {isQuestionStep && (
              <span className="px-3 py-[5px] rounded-full bg-white/10 text-sm font-semibold text-white/85">
                {currentStep} of {steps.length - 2}
              </span>
            )}
          </div>
        </div>
        {/* Progress bar — the gradient spans the full track, so it warms from
            orange to lime as you get closer to the end */}
        <div className="h-1.5 bg-white/10">
          <div
            className="relative h-full rounded-r-[3px] bg-[linear-gradient(90deg,#FF8A3D,#FFC15E_50%,#B8F26B)] bg-[length:100vw_100%] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            {progress > 0 && (
              <span className="absolute -right-[7px] -top-1 size-3.5 rounded-full bg-lime shadow-[0_0_0_5px_rgba(184,242,107,0.25)]" />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      {/* Bottom padding = the 72px Back/Continue bar plus a small gap */}
      <main className="relative pt-[70px] pb-[84px] px-6">
        <div className="max-w-[780px] mx-auto">
          {/* Step: Intro */}
          {currentStep === 0 && (
            <StepContainer>
              <div className="text-center">
                <Sparkles className="size-10 text-lime mx-auto mb-4" />
                <h1 className="type-display text-[38px] sm:text-[46px] leading-[0.95] mb-4">
                  {"Let's find your perfect trail companion"}
                </h1>
                <p className="max-w-[620px] mx-auto text-[17px] text-white/75 mb-8 leading-relaxed">
                  {"We'll ask you a few questions about how you trek. Be honest — there are no wrong answers, just different styles."}
                </p>
                <div className="rounded-[14px] bg-white/5 border border-white/14 p-6 text-left mb-8">
                  <p className="text-sm text-white/70 mb-3">This takes about 3 minutes</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-lime" />
                      Your basic info
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-lime" />
                      Trail preferences & stamina
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-lime" />
                      Social vibe & habits
                    </li>
                  </ul>
                </div>
                <Button variant="lime" onClick={nextStep} className={`w-full sm:w-auto ${limeButtonClass}`}>
                  {"Let's Begin"}
                  <ArrowRight className="size-5" />
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
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Your name</label>
                  <Input
                    placeholder="What should we call you?"
                    value={profile.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                    className={darkFieldClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Trek destination</label>
                    <Select
                      value={profile.trekDestination}
                      onValueChange={(value) => updateProfile("trekDestination", value)}
                    >
                      <SelectTrigger
                        className={`w-full data-[size=default]:h-12 data-[placeholder]:text-white/45 [&_svg:not([class*='text-'])]:text-white ${darkFieldClass}`}
                      >
                        <SelectValue placeholder="Select trek" />
                      </SelectTrigger>
                      <SelectContent className="bg-forest text-white border-white/15">
                        {TREK_DESTINATIONS.map((trek) => (
                          <SelectItem
                            key={trek.value}
                            value={trek.value}
                            className="focus:bg-white/10 focus:text-white [&_svg:not([class*='text-'])]:text-lime"
                          >
                            {trek.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={profile.phone}
                      onChange={(e) => updateProfile("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className={darkFieldClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <Input
                      placeholder="Where are you based?"
                      value={profile.city}
                      onChange={(e) => updateProfile("city", e.target.value)}
                      className={darkFieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={profile.age}
                      onChange={(e) => updateProfile("age", e.target.value)}
                      className={darkFieldClass}
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
                <span className="block text-[40px] leading-none mb-4">🎉</span>
                <h1 className="type-display text-[38px] sm:text-[46px] leading-[0.95] mb-4">
                  {"You're all set, " + (profile.name || "trekker") + "!"}
                </h1>
                <p className="max-w-[620px] mx-auto text-[17px] text-white/75 mb-8 leading-relaxed">
                  {"Almost there! Create a free account to save your profile and find compatible companions."}
                </p>

                {/* Profile summary */}
                <div className="rounded-[14px] bg-white/5 border border-white/14 p-6 text-left mb-8">
                  <h3 className="type-display text-xl tracking-[0.02em] mb-4">Your Trek Style</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
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
                  <p className="text-sm text-coral text-center mb-2">{saveError}</p>
                )}
                <Button
                  variant="lime"
                  className={`w-full sm:w-auto ${limeButtonClass}`}
                  onClick={handleFinish}
                  disabled={saving}
                >
                  {saving ? "Saving your profile…" : authMode === "login" ? "Continue to Log In" : "Continue to Sign Up"}
                  {!saving && <ArrowRight className="size-5" />}
                </Button>
              </div>
            </StepContainer>
          )}
        </div>
      </main>

      {/* Navigation footer */}
      {isQuestionStep && (
        <footer className="fixed bottom-0 left-0 right-0 h-[72px] px-6 border-t border-white/10 bg-[rgba(3,20,15,0.6)] backdrop-blur-[8px]">
          <div className="max-w-[780px] h-full mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              className="h-12 px-2 has-[>svg]:px-2 gap-2.5 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-5" />
              Back
            </Button>
            <Button variant="lime" onClick={nextStep} disabled={!canProceed(currentStep, profile)} className={limeButtonClass}>
              Continue
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}

// Page backdrop from the mockup: faint topographic contour lines and a
// ridge that sits on top of the Back/Continue bar. Fixed, so it stays put
// if a step is long enough to scroll.
function OnboardingBackdrop({ withFooter }: { withFooter: boolean }) {
  return (
    <div aria-hidden="true" className="bg-onboarding pointer-events-none fixed inset-0 overflow-hidden">
      <svg
        viewBox="0 0 600 600"
        fill="none"
        stroke="#B8F26B"
        strokeWidth="1.5"
        className="absolute -right-[200px] top-20 size-[620px] opacity-10"
      >
        <ellipse cx="300" cy="300" rx="290" ry="230" />
        <ellipse cx="310" cy="290" rx="220" ry="170" />
        <ellipse cx="320" cy="285" rx="150" ry="112" />
        <ellipse cx="330" cy="280" rx="80" ry="58" />
      </svg>
      <svg
        viewBox="0 0 600 600"
        fill="none"
        stroke="#FFC15E"
        strokeWidth="1.5"
        className="absolute -left-[240px] -top-[60px] size-[560px] opacity-9"
      >
        <ellipse cx="300" cy="300" rx="290" ry="230" />
        <ellipse cx="300" cy="300" rx="210" ry="165" />
        <ellipse cx="300" cy="300" rx="130" ry="100" />
      </svg>
      <svg
        viewBox="0 0 1280 160"
        preserveAspectRatio="none"
        className={`absolute inset-x-0 w-full h-[110px] sm:h-[160px] opacity-75 ${withFooter ? "bottom-[72px]" : "bottom-0"}`}
      >
        <path d="M0 160V90l170-60 130 40 180-70 160 70 140-40 190 60 150-50 160 40V160z" fill="#0B4A3A" />
      </svg>
    </div>
  )
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-11 animate-in fade-in slide-in-from-right-4 duration-500">
      {children}
    </div>
  )
}

function QuestionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="mb-[26px]">
      <span aria-hidden="true" className="block text-[40px] leading-none mb-4">
        {emoji}
      </span>
      <h2 className="type-display text-[38px] sm:text-[46px] leading-[0.95]">{title}</h2>
      <p className="mt-3 text-[17px] text-white/75">{subtitle}</p>
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
    // Two answers per row on wider screens (as in the mockup), one per row on phones
    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3.5">
      {options.map((option) => {
        const isSelected = selected === option.value
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            aria-pressed={isSelected}
            // The selected border is 1px thicker, so its padding is 1px
            // smaller — keeps the card from jumping when you tap it
            className={`flex items-center gap-3.5 rounded-[14px] text-left transition-all ${
              isSelected
                ? "px-[17px] py-[13px] border-2 border-lime bg-lime/12 shadow-[0_10px_30px_rgba(184,242,107,0.15)]"
                : "px-[18px] py-[14px] border border-white/14 bg-white/5 hover:border-white/30 hover:bg-white/8"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold leading-tight mb-[3px]">{option.label}</div>
              <div className="text-sm leading-snug text-white/72">{option.description}</div>
            </div>
            {/* The tick's slot is always there (just empty until selected), so
                the text keeps the same width and the card never changes height */}
            <span
              aria-hidden="true"
              className={`size-[26px] shrink-0 rounded-full flex items-center justify-center ${
                isSelected ? "bg-lime text-forest" : ""
              }`}
            >
              {isSelected && <Check className="size-4" strokeWidth={3} />}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ProfileTag({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/60">{label}:</span>
      <span className="font-medium capitalize">{value.replace(/-/g, " ")}</span>
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
