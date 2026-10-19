import { PROFILE_QUESTIONS, TREK_DESTINATIONS, type QuestionKey } from "@/lib/profile-questions"

// The Vibe Summary prompt — what Claude is told (system prompt) and what it
// reads about the pair (user message). Tone and structure come straight from
// docs/features/vibe_summary.md; edit them here, then run
// `npm run vibe:preview` to see how summaries change.

/** Everything Claude needs to write one summary, from the reader's point of view. */
export type VibeInputs = {
  theirFirstName: string
  trekDestination: string
  myCity: string | null
  theirCity: string | null
  overallScore: number
  /** Per signal: the reader's answer, the match's answer, and their score (0-100). */
  signals: Record<QuestionKey, { mine: string | null; theirs: string | null; score: number | null }>
}

// Human-readable name for each signal, and its weight in the overall score.
// Weights mirror match_trekkers (supabase/migrations/match_trekkers_function.sql)
// so Claude knows stamina and risk matter more than music or photos.
export const SIGNAL_INFO: Record<QuestionKey, { label: string; weight: number }> = {
  stamina: { label: "Trail stamina", weight: 20 },
  pace: { label: "Walking pace", weight: 15 },
  breaks: { label: "Rest stops", weight: 5 },
  morning: { label: "Morning start times", weight: 5 },
  dietary: { label: "Food & diet", weight: 10 },
  music: { label: "Music on the trail", weight: 5 },
  chat: { label: "Social vibe (how chatty on the trail)", weight: 5 },
  photos: { label: "Photo stops", weight: 5 },
  habits: { label: "Smoking & drinking", weight: 10 },
  risk: { label: "Risk style (when weather or the trail turns bad)", weight: 20 },
}

export const VIBE_SYSTEM_PROMPT = `You're a veteran trekker who has walked dozens of Himalayan trails and has seen first-hand how the right companion, or the wrong one, shapes a trek. On SoloSaathi, solo trekkers are matched with compatible trail companions before their trek. You know both people below through their answers, and you're writing a short note to one of them (the reader, "you") about a potential companion, to help them decide whether to connect.

The note appears on the match's card under the heading "Why you may vibe". Its job is to build genuine, well-founded trust: the reader should come away knowing what will feel easy with this person on the trail, and what to talk through before they go.

Write 3-4 short sentences, about 50 words and never more than 60, in this order:
1. The strongest point of compatibility and what it will feel like on this trek, for example "You both tend to stop, assess and decide calmly when the weather turns".
2. One or two other things that line up.
3. One honest friction point, framed as something to align on before the trek rather than a warning. Take it from the biggest differences listed: usually the lowest match, and anything at opposite ends should be the one you raise. If two gaps are both stark, you can name both. Every note has a friction point, even for very close matches: if no big differences are listed, pick the smallest difference or a practical thing to confirm, like daily distance or start time.

Voice: warm, honest and direct, like a seasoned friend who cares about the reader's safety and enjoyment. Make it specific to trekking: early starts, daily distances, rest stops, steep climbs, camp evenings, shared meals, weather turning. Avoid generic lines ("you both love trekking"), flattery, hype and sugar-coating.

Accuracy comes first. Stick to what the answers show; don't invent experience, history, personality traits or plans. Say you both share something only when your two answers are the same. A flexible answer ("Flexible", "Go With Flow", "Group Decision") means that person adapts easily, which can be worth naming, but it isn't the same as sharing your preference.

Address the reader as "you" and the match by first name. Never use "he", "she", "him", "his" or "her" for the match: their gender isn't given, and a name doesn't tell you. Repeat their name instead. Don't mention scores or percentages (the card already shows them), age or appearance. Only suggest meeting before the trek when the details say you live in the same city. Write plain prose with no headings, lists, emojis or surrounding quotation marks, and output only the note.`

/** The per-pair part of the prompt: the trek, both cities, and every answer side by side. */
export function buildVibeUserMessage(inputs: VibeInputs): string {
  const them = inputs.theirFirstName

  // Strongest match first (ties: the more important signal first), so the
  // order Claude reads in is the order the note should follow.
  const keys = (Object.keys(SIGNAL_INFO) as QuestionKey[]).sort((a, b) => {
    const scoreA = inputs.signals[a].score ?? -1
    const scoreB = inputs.signals[b].score ?? -1
    return scoreB - scoreA || SIGNAL_INFO[b].weight - SIGNAL_INFO[a].weight
  })

  const signalLines = keys.map((key, i) => {
    const { label, weight } = SIGNAL_INFO[key]
    const { mine, theirs, score } = inputs.signals[key]
    const match = score === null ? "match unknown" : `match ${Math.round(score)}%`
    return [
      `${i + 1}. ${label} (${match}, weight ${weight}%)`,
      `   You: ${describeAnswer(key, mine)}`,
      `   ${them}: ${describeAnswer(key, theirs)}`,
    ].join("\n")
  })

  // The friction point should come from here. Worked out in code, not left to
  // Claude: lowest match first, the more important signal first on a tie.
  const gaps = keys
    .filter((key) => (inputs.signals[key].score ?? 100) < 90)
    .sort((a, b) => {
      const scoreA = inputs.signals[a].score ?? 100
      const scoreB = inputs.signals[b].score ?? 100
      return scoreA - scoreB || SIGNAL_INFO[b].weight - SIGNAL_INFO[a].weight
    })
    .slice(0, 3)
    .map((key) => `${SIGNAL_INFO[key].label} (${Math.round(inputs.signals[key].score ?? 0)}%)`)

  return [
    `Trek: ${trekName(inputs.trekDestination)}`,
    `Cities: ${describeCities(inputs.myCity, inputs.theirCity, them)}`,
    "",
    `How you and ${them} answered, strongest match first. Weight is how much each signal counts toward trek compatibility.`,
    "",
    ...signalLines,
    "",
    gaps.length
      ? `Biggest differences, lowest match first: ${gaps.join(", ")}`
      : "Biggest differences: none below 90%",
    `Overall compatibility: ${Math.round(inputs.overallScore)}%`,
  ].join("\n")
}

// Decided here so Claude never has to judge whether "Mumbai" and "Pune" are the same city.
function describeCities(mine: string | null, theirs: string | null, them: string): string {
  const a = mine?.trim()
  const b = theirs?.trim()
  if (a && b && a.toLowerCase() === b.toLowerCase()) return `you both live in ${a} (same city)`
  if (a && b) return `you live in ${a}, ${them} lives in ${b} (different cities)`
  return "not known for both of you (don't suggest meeting)"
}

// "beginner" -> `"Just Starting" (Easy trails, 5-8 km/day is my sweet spot)`
function describeAnswer(key: QuestionKey, value: string | null): string {
  if (!value) return "not answered"
  const option = PROFILE_QUESTIONS[key].options.find((o) => o.value === value)
  return option ? `"${option.label}" (${option.description})` : value
}

function trekName(slug: string): string {
  return TREK_DESTINATIONS.find((t) => t.value === slug)?.label ?? slug.replace(/-/g, " ")
}
