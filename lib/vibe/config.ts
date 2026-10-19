// Settings for the Vibe Summary AI feature (docs/features/vibe_summary.md).
// The model is chosen in the spec — if it changes there, change it here too.
export const VIBE_SUMMARY_MODEL = "claude-sonnet-5-5"

// How much Claude thinks before writing. "low" suits a short, well-specified
// note and keeps it fast and cheap; try "medium" if summaries feel shallow.
export const VIBE_SUMMARY_EFFORT: "low" | "medium" | "high" = "low"

// Only matches at or above this overall score get a Vibe Summary.
// Also enforced in SQL (is_vibe_eligible in supabase/migrations/vibe_summaries.sql) — keep in sync.
export const VIBE_SUMMARY_MIN_SCORE = 70
