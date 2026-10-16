import type { ProfileData } from "@/lib/profile"

// Single source of truth for the profile questionnaire. The create-profile
// form renders these, and the Vibe Summary AI prompt reads the same labels
// and descriptions — so renaming an option here keeps both in sync.
//
// The `value`s are what's saved in the profiles table and scored by
// match_trekkers (supabase/migrations/match_trekkers_function.sql), so
// changing a value (not a label) also needs a SQL change.

export type QuestionOption = {
  value: string
  label: string
  description: string
}

export type ProfileQuestion = {
  /** The ProfileData field this answer is stored in. */
  field: keyof ProfileData
  emoji: string
  title: string
  subtitle: string
  options: QuestionOption[]
}

// Keys match SIGNAL_DEFS in components/compatibility-card.tsx, so each
// question can be paired with its match score.
export type QuestionKey =
  | "stamina"
  | "pace"
  | "breaks"
  | "morning"
  | "dietary"
  | "music"
  | "chat"
  | "photos"
  | "habits"
  | "risk"

export const PROFILE_QUESTIONS: Record<QuestionKey, ProfileQuestion> = {
  stamina: {
    field: "trailStamina",
    emoji: "🏔️",
    title: "How would you describe your trail stamina?",
    subtitle: "Be honest — matching with someone at a different level can make or break a trek",
    options: [
      { value: "beginner", label: "Just Starting", description: "Easy trails, 5-8 km/day is my sweet spot" },
      { value: "moderate", label: "Building Up", description: "Moderate trails, 10-15 km/day works for me" },
      { value: "experienced", label: "Pretty Fit", description: "Challenging trails, 15-20 km/day, no problem" },
      { value: "advanced", label: "Beast Mode", description: "Tough trails, 20+ km/day, bring it on" },
    ],
  },
  pace: {
    field: "walkingPace",
    emoji: "🚶",
    title: "What's your natural walking pace?",
    subtitle: "Some like to cruise, others like to race — neither is wrong",
    options: [
      { value: "slow", label: "Slow & Steady", description: "I like to soak it all in, no rush" },
      { value: "moderate", label: "Moderate", description: "Comfortable pace with time to enjoy" },
      { value: "brisk", label: "Brisk Walker", description: "I like to cover ground efficiently" },
      { value: "fast", label: "Speed Demon", description: "Let's push it, time is precious" },
    ],
  },
  morning: {
    field: "morningPerson",
    emoji: "🌅",
    title: "Early bird or night owl?",
    subtitle: "Trek start times can be a dealbreaker",
    options: [
      { value: "early", label: "Early Bird", description: "4-5 AM starts? I'm already stretching" },
      { value: "moderate", label: "Normal Human", description: "6-7 AM is reasonable, thanks" },
      { value: "late", label: "Night Owl", description: "Can we start after breakfast?" },
      { value: "flexible", label: "Flexible", description: "I can adapt to whatever works" },
    ],
  },
  chat: {
    field: "talkativeLevel",
    emoji: "💬",
    title: "How chatty are you on the trail?",
    subtitle: "Some love deep conversations, others prefer peaceful silence",
    options: [
      { value: "quiet", label: "Quiet Companion", description: "I enjoy peaceful silence and my thoughts" },
      { value: "occasional", label: "Occasional Chat", description: "A few words here and there is nice" },
      { value: "chatty", label: "Love to Talk", description: "Let's share stories and get to know each other" },
      { value: "very-chatty", label: "Non-Stop Chat", description: "I can talk about everything under the sun" },
    ],
  },
  music: {
    field: "musicPreference",
    emoji: "🎵",
    title: "Music on the trail?",
    subtitle: "This is surprisingly divisive",
    options: [
      { value: "no-music", label: "Nature Only", description: "I prefer natural sounds, no music please" },
      { value: "earphones", label: "Earphones Only", description: "I'll listen to mine, you listen to yours" },
      { value: "shared-soft", label: "Soft Background", description: "Some gentle tunes for the group" },
      { value: "shared-loud", label: "Speaker Party", description: "Let's make some noise!" },
    ],
  },
  photos: {
    field: "photographyStyle",
    emoji: "📸",
    title: "How often do you stop for photos?",
    subtitle: "Instagram vs Insta-gone",
    options: [
      { value: "minimal", label: "Rarely", description: "Maybe at the summit, that's it" },
      { value: "occasional", label: "Occasionally", description: "At scenic spots, but let's keep moving" },
      { value: "frequent", label: "Frequently", description: "I need those shots for the gram" },
      { value: "constant", label: "Photo First", description: "Every angle, every moment, documented" },
    ],
  },
  breaks: {
    field: "restFrequency",
    emoji: "☕",
    title: "How often do you like to take breaks?",
    subtitle: "Everyone needs rest, but frequency varies",
    options: [
      { value: "minimal", label: "Power Through", description: "One or two stops max, keep pushing" },
      { value: "normal", label: "Regular Breaks", description: "Every hour or so works for me" },
      { value: "frequent", label: "Frequent Stops", description: "I like to rest often and enjoy the views" },
      { value: "flexible", label: "Go With Flow", description: "Whatever the group needs" },
    ],
  },
  dietary: {
    field: "dietaryPreference",
    emoji: "🍽️",
    title: "Any dietary preferences?",
    subtitle: "Good to know for shared meals and planning",
    options: [
      { value: "vegetarian", label: "Vegetarian", description: "No meat or fish for me" },
      { value: "vegan", label: "Vegan", description: "Plant-based all the way" },
      { value: "non-veg", label: "Non-Vegetarian", description: "I eat everything" },
      { value: "flexible", label: "Flexible", description: "I can adapt to what's available" },
    ],
  },
  habits: {
    field: "smokingDrinking",
    emoji: "🍺",
    title: "Smoking or drinking on treks?",
    subtitle: "No judgment, just preferences",
    options: [
      { value: "neither", label: "Neither", description: "I prefer to keep it clean on trails" },
      { value: "drink-only", label: "Social Drinker", description: "A drink at camp is nice" },
      { value: "smoke-only", label: "Occasional Smoker", description: "I might light up occasionally" },
      { value: "both", label: "Both Okay", description: "I'm open to either" },
    ],
  },
  risk: {
    field: "riskTolerance",
    emoji: "⚡",
    title: "How do you handle risk on the trail?",
    subtitle: "Weather turns bad, path looks sketchy — what do you do?",
    options: [
      { value: "cautious", label: "Play It Safe", description: "Better to turn back than risk it" },
      { value: "moderate", label: "Balanced", description: "Assess the situation, decide together" },
      { value: "adventurous", label: "Push Boundaries", description: "A little risk makes it exciting" },
      { value: "flexible", label: "Group Decision", description: "I'll go with what the group decides" },
    ],
  },
}

export const TREK_DESTINATIONS: { value: string; label: string }[] = [
  { value: "kheerganga", label: "Kheerganga Trek" },
  { value: "triund", label: "Triund Trek" },
  { value: "kareri-lake", label: "Kareri Lake Trek" },
  { value: "sar-pass", label: "Sar Pass Trek" },
  { value: "hampta-pass", label: "Hampta Pass Trek" },
]
