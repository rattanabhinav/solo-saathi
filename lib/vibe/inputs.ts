import type { VibeInputs } from "@/lib/vibe/prompt"

/** One row from get_vibe_inputs (supabase/migrations/vibe_summaries.sql), column for column. */
export type VibeRow = {
  their_first_name: string
  trek_destination: string
  my_city: string | null
  their_city: string | null
  my_trail_stamina: string | null
  their_trail_stamina: string | null
  my_walking_pace: string | null
  their_walking_pace: string | null
  my_rest_frequency: string | null
  their_rest_frequency: string | null
  my_morning_person: string | null
  their_morning_person: string | null
  my_dietary_preference: string | null
  their_dietary_preference: string | null
  my_music_preference: string | null
  their_music_preference: string | null
  my_talkative_level: string | null
  their_talkative_level: string | null
  my_photography_style: string | null
  their_photography_style: string | null
  my_smoking_drinking: string | null
  their_smoking_drinking: string | null
  my_risk_tolerance: string | null
  their_risk_tolerance: string | null
  stamina_score: number | null
  pace_score: number | null
  breaks_score: number | null
  morning_score: number | null
  dietary_score: number | null
  music_score: number | null
  chat_score: number | null
  photos_score: number | null
  smoking_drinking_score: number | null
  risk_score: number | null
  overall_score: number
  cached_summary: string | null
  cached_inputs_hash: string | null
}

/** Reshape the flat database row into what the prompt reads, one signal at a time. */
export function vibeInputsFromRow(row: VibeRow): VibeInputs {
  return {
    theirFirstName: row.their_first_name,
    trekDestination: row.trek_destination,
    myCity: row.my_city,
    theirCity: row.their_city,
    overallScore: Number(row.overall_score),
    signals: {
      stamina: { mine: row.my_trail_stamina, theirs: row.their_trail_stamina, score: toScore(row.stamina_score) },
      pace: { mine: row.my_walking_pace, theirs: row.their_walking_pace, score: toScore(row.pace_score) },
      breaks: { mine: row.my_rest_frequency, theirs: row.their_rest_frequency, score: toScore(row.breaks_score) },
      morning: { mine: row.my_morning_person, theirs: row.their_morning_person, score: toScore(row.morning_score) },
      dietary: { mine: row.my_dietary_preference, theirs: row.their_dietary_preference, score: toScore(row.dietary_score) },
      music: { mine: row.my_music_preference, theirs: row.their_music_preference, score: toScore(row.music_score) },
      chat: { mine: row.my_talkative_level, theirs: row.their_talkative_level, score: toScore(row.chat_score) },
      photos: { mine: row.my_photography_style, theirs: row.their_photography_style, score: toScore(row.photos_score) },
      habits: { mine: row.my_smoking_drinking, theirs: row.their_smoking_drinking, score: toScore(row.smoking_drinking_score) },
      risk: { mine: row.my_risk_tolerance, theirs: row.their_risk_tolerance, score: toScore(row.risk_score) },
    },
  }
}

// Postgres "numeric" can arrive as a number or a numeric string; normalise it.
function toScore(value: number | null): number | null {
  return value === null ? null : Number(value)
}
