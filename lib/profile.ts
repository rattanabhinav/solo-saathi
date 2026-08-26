import { supabase } from "@/lib/supabase/client"

export type ProfileData = {
  name: string
  trekDestination: string
  phone: string
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

const PENDING_PROFILE_KEY = "solosaathi_pending_profile"

export function savePendingProfile(profile: ProfileData): void {
  sessionStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(profile))
}

export function getPendingProfile(): ProfileData | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(PENDING_PROFILE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ProfileData
  } catch {
    return null
  }
}

export function clearPendingProfile(): void {
  sessionStorage.removeItem(PENDING_PROFILE_KEY)
}

export async function saveProfileToSupabase(
  userId: string,
  profile: ProfileData
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    name: profile.name,
    age: parseInt(profile.age, 10),
    city: profile.city,
    phone: profile.phone,
    trek_destination: profile.trekDestination,
    trail_stamina: profile.trailStamina,
    walking_pace: profile.walkingPace,
    morning_person: profile.morningPerson,
    talkative_level: profile.talkativeLevel,
    music_preference: profile.musicPreference,
    photography_style: profile.photographyStyle,
    rest_frequency: profile.restFrequency,
    dietary_preference: profile.dietaryPreference,
    smoking_drinking: profile.smokingDrinking,
    risk_tolerance: profile.riskTolerance,
  })

  return { error: error?.message ?? null }
}

export async function userHasProfile(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle()

  return !!data
}

/** After auth succeeds: save any pending answers, then return the next route. */
export async function completeAuthFlow(userId: string): Promise<string> {
  const pending = getPendingProfile()

  if (pending) {
    const { error } = await saveProfileToSupabase(userId, pending)
    if (error) throw new Error(error)
    clearPendingProfile()
    return "/matches"
  }

  const hasProfile = await userHasProfile(userId)
  return hasProfile ? "/matches" : "/create-profile"
}
