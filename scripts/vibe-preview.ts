// Prompt playground for Vibe Summary. Prints summaries for sample trekker
// pairs so you can tune the tone in lib/vibe/prompt.ts without opening the app.
//
//   npm run vibe:preview                 all sample pairs
//   npm run vibe:preview -- 3            just pair #3
//   npm run vibe:preview -- --prompt     also print exactly what Claude reads
//
// Makes real Claude API calls (a few cents per full run) with
// ANTHROPIC_API_KEY from .env.local. Doesn't touch the database.

import { PROFILE_QUESTIONS, type QuestionKey } from "@/lib/profile-questions"
import { VIBE_SUMMARY_EFFORT, VIBE_SUMMARY_MIN_SCORE, VIBE_SUMMARY_MODEL } from "@/lib/vibe/config"
import { SIGNAL_INFO, buildVibeUserMessage, type VibeInputs } from "@/lib/vibe/prompt"
import { countSentences, countWords, generateVibeSummary } from "@/lib/vibe/generate"

type Answers = Record<QuestionKey, string>
type Trekker = { name: string; city: string; answers: Answers }
type SamplePair = { title: string; trek: string; you: Trekker; them: Trekker }

// ---------------------------------------------------------------------------
// Sample pairs. "you" is who the note is written to. Add or edit pairs freely:
// answer values are the `value`s in lib/profile-questions.ts.
// ---------------------------------------------------------------------------
const ASHA: Answers = {
  stamina: "moderate",
  pace: "moderate",
  breaks: "normal",
  morning: "early",
  dietary: "vegetarian",
  music: "earphones",
  chat: "occasional",
  photos: "occasional",
  habits: "neither",
  risk: "cautious",
}
const you: Trekker = { name: "Asha", city: "Mumbai", answers: ASHA }

const SAMPLE_PAIRS: SamplePair[] = [
  {
    title: "Near twins, same city",
    trek: "kareri-lake",
    you,
    them: { name: "Kabir", city: "Mumbai", answers: { ...ASHA, photos: "frequent" } },
  },
  {
    title: "Mockup: Pranav (stamina + music match; diet + social vibe differ)",
    trek: "kareri-lake",
    you,
    them: {
      name: "Pranav",
      city: "Mumbai",
      answers: { ...ASHA, pace: "brisk", dietary: "non-veg", chat: "very-chatty", risk: "moderate" },
    },
  },
  {
    title: "Mockup: Vikram (diet + habits match; stamina differs)",
    trek: "kareri-lake",
    you,
    them: {
      name: "Vikram",
      city: "Bengaluru",
      answers: { ...ASHA, stamina: "advanced", pace: "brisk", morning: "late", photos: "frequent" },
    },
  },
  {
    title: "Mockup: Swati (pace + rest stops match; habits at opposite ends)",
    trek: "kareri-lake",
    you,
    them: {
      name: "Swati",
      city: "Mumbai",
      answers: { ...ASHA, stamina: "experienced", dietary: "non-veg", chat: "very-chatty", habits: "both" },
    },
  },
  {
    title: "Flexible on almost everything",
    trek: "hampta-pass",
    you,
    them: {
      name: "Meera",
      city: "Pune",
      answers: { ...ASHA, stamina: "experienced", breaks: "flexible", morning: "flexible", dietary: "flexible", risk: "flexible" },
    },
  },
  {
    title: "Strong match, but risk style apart (safety friction)",
    trek: "triund",
    you,
    them: { name: "Arjun", city: "Delhi", answers: { ...ASHA, risk: "adventurous", music: "shared-soft" } },
  },
]

// ---------------------------------------------------------------------------
// Scores for the sample pairs. PREVIEW ONLY — this mirrors the SQL scoring
// rules (supabase/migrations/match_trekkers_function.sql) so samples get
// realistic numbers. The real app always uses the database's scores.
// ---------------------------------------------------------------------------
const round1 = (n: number) => Math.round(n * 10) / 10

function scoreSignal(key: QuestionKey, a: string, b: string): number {
  if (a === b) return 100
  // Option order in lib/profile-questions.ts is the scale order the SQL uses.
  const scale = PROFILE_QUESTIONS[key].options.map((o) => o.value)
  const ordinal = () => round1(100 * (1 - Math.abs(scale.indexOf(a) - scale.indexOf(b)) / (scale.length - 1)))

  switch (key) {
    case "breaks":
    case "morning":
    case "risk":
      return a === "flexible" || b === "flexible" ? 90 : ordinal()
    case "dietary": {
      if (a === "flexible" || b === "flexible") return 90
      const veg = ["vegetarian", "vegan"]
      return veg.includes(a) && veg.includes(b) ? 67 : 33
    }
    case "habits":
      if ([a, b].includes("neither") && [a, b].includes("both")) return 0
      if (a === "neither" || b === "neither") return 33
      if (a === "both" || b === "both") return 67
      return 55 // drink-only vs smoke-only
    default:
      return ordinal()
  }
}

function toInputs(pair: SamplePair): VibeInputs {
  const keys = Object.keys(PROFILE_QUESTIONS) as QuestionKey[]
  const signals = {} as VibeInputs["signals"]
  let overall = 0
  for (const key of keys) {
    const score = scoreSignal(key, pair.you.answers[key], pair.them.answers[key])
    signals[key] = { mine: pair.you.answers[key], theirs: pair.them.answers[key], score }
    overall += score * (SIGNAL_INFO[key].weight / 100)
  }
  return {
    theirFirstName: pair.them.name,
    trekDestination: pair.trek,
    myCity: pair.you.city,
    theirCity: pair.them.city,
    overallScore: round1(overall),
    signals,
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
async function main() {
  try {
    process.loadEnvFile(".env.local")
  } catch {
    console.error("Couldn't read .env.local. Run this from the project folder.")
    process.exit(1)
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY isn't set in .env.local.")
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const showPrompt = args.includes("--prompt")
  const only = args.map(Number).find((n) => Number.isInteger(n) && n > 0)
  const pairs = SAMPLE_PAIRS.map((pair, i) => ({ ...pair, n: i + 1 })).filter((p) => !only || p.n === only)

  console.log(`Vibe Summary preview · ${VIBE_SUMMARY_MODEL} · effort ${VIBE_SUMMARY_EFFORT} · ${pairs.length} pair(s)\n`)

  // Generate all pairs at once, then print them in order.
  const results = await Promise.all(
    pairs.map(async (pair) => {
      const inputs = toInputs(pair)
      return { pair, inputs, result: await generateVibeSummary(inputs) }
    })
  )

  let inputTokens = 0
  let outputTokens = 0
  for (const { pair, inputs, result } of results) {
    console.log(`━━ ${pair.n}. ${pair.title}`)
    console.log(`   To ${pair.you.name} (${pair.you.city}) about ${pair.them.name} (${pair.them.city}) · ${inputs.overallScore}%`)
    if (inputs.overallScore < VIBE_SUMMARY_MIN_SCORE) {
      console.log(`   ⚠ Below ${VIBE_SUMMARY_MIN_SCORE}%: the app wouldn't show a summary for this pair`)
    }
    if (showPrompt) console.log(`\n${indent(buildVibeUserMessage(inputs))}`)

    if (result.ok) {
      console.log(`\n${indent(wrap(result.summary))}\n`)
      console.log(
        `   ✓ ${countWords(result.summary)} words · ${countSentences(result.summary)} sentences · ${result.attempts} attempt(s)` +
          (result.firstDraftProblem ? ` (first draft rejected: ${result.firstDraftProblem})` : "") +
          "\n"
      )
    } else {
      console.log(`\n   ✗ No summary: ${result.reason}\n`)
    }
    inputTokens += result.usage.inputTokens
    outputTokens += result.usage.outputTokens
  }

  // Claude Sonnet 5.5 list price: $2 per 1M input tokens, $10 per 1M output tokens.
  const cost = (inputTokens * 2 + outputTokens * 10) / 1_000_000
  console.log(`Tokens: ${inputTokens} in / ${outputTokens} out · about $${cost.toFixed(3)} for this run`)
}

function indent(text: string): string {
  return text
    .split("\n")
    .map((line) => `   ${line}`)
    .join("\n")
}

function wrap(text: string, width = 76): string {
  const lines: string[] = []
  let line = ""
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > width) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)
  return lines.join("\n")
}

main()
