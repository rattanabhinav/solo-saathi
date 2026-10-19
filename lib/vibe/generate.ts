import { createHash } from "node:crypto"
import Anthropic from "@anthropic-ai/sdk"
import { VIBE_SUMMARY_EFFORT, VIBE_SUMMARY_MODEL } from "@/lib/vibe/config"
import { VIBE_SYSTEM_PROMPT, buildVibeUserMessage, type VibeInputs } from "@/lib/vibe/prompt"

// Calls Claude to write one Vibe Summary. Server-side only: it needs
// ANTHROPIC_API_KEY, which (having no NEXT_PUBLIC_ prefix) never exists in
// the browser — so an accidental browser import fails instead of leaking it.

// The spec asks for 3-4 sentences and 50-80 words. The prompt deliberately
// aims lower (~50, "never more than 60") because Claude's drafts overshoot;
// accepting up to 80 means almost every summary passes first time, saving a
// second call's time and cost. Outside this range, Claude gets one rewrite.
const MIN_WORDS = 45
const MAX_WORDS = 80
const MIN_SENTENCES = 3
const MAX_SENTENCES = 4
const MAX_ATTEMPTS = 2

export type TokenUsage = { inputTokens: number; outputTokens: number }

export type VibeResult =
  /** firstDraftProblem: why the first draft was rejected, if it was (useful for prompt tuning). */
  | { ok: true; summary: string; attempts: number; firstDraftProblem: string | null; usage: TokenUsage }
  | { ok: false; reason: string; usage: TokenUsage }

let client: Anthropic | null = null

function getClient(): Anthropic {
  // Created on first use rather than at import, so scripts can load
  // .env.local first. 30s timeout + 1 retry: a background summary should
  // give up quickly rather than hang (the card just hides the panel).
  client ??= new Anthropic({ timeout: 30_000, maxRetries: 1 })
  return client
}

/**
 * Fingerprint of everything a summary is written from: model, effort, the
 * instructions, and both people's answers. Stored next to each saved summary
 * (vibe_summaries.inputs_hash) — if anything changes, including a prompt
 * edit, the fingerprint changes and the summary gets rewritten.
 */
export function vibeInputsHash(inputs: VibeInputs): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        model: VIBE_SUMMARY_MODEL,
        effort: VIBE_SUMMARY_EFFORT,
        system: VIBE_SYSTEM_PROMPT,
        user: buildVibeUserMessage(inputs),
      })
    )
    .digest("hex")
}

export async function generateVibeSummary(inputs: VibeInputs): Promise<VibeResult> {
  const userMessage = buildVibeUserMessage(inputs)
  const usage: TokenUsage = { inputTokens: 0, outputTokens: 0 }
  let problem = ""
  let firstDraftProblem: string | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // On a retry, tell Claude what was off with the last draft.
    const content = problem
      ? `${userMessage}\n\nNote: a previous draft didn't fit because ${problem}. Write 3-4 sentences, 50-60 words.`
      : userMessage

    let response: Anthropic.Beta.BetaMessage
    try {
      response = await getClient().beta.messages.create({
        model: VIBE_SUMMARY_MODEL,
        max_tokens: 4000, // room for Claude's thinking plus a ~60-word note
        output_config: { effort: VIBE_SUMMARY_EFFORT },
        // If a safety check ever declines the request, retry it server-side
        // on Anthropic's recommended fallback model instead of failing.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: VIBE_SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      })
    } catch (error) {
      return { ok: false, reason: describeApiError(error), usage }
    }

    usage.inputTokens += response.usage.input_tokens
    usage.outputTokens += response.usage.output_tokens

    if (response.stop_reason === "refusal") {
      return { ok: false, reason: "Claude declined to write this summary", usage }
    }
    const summary = cleanSummary(
      response.content
        .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
        .map((block) => block.text)
        .join("")
    )
    problem =
      response.stop_reason === "max_tokens" ? "it was cut off before finishing" : (checkSummary(summary) ?? "")
    if (!problem) return { ok: true, summary, attempts: attempt, firstDraftProblem, usage }
    firstDraftProblem ??= problem
  }

  return { ok: false, reason: `still off after a retry: ${problem}`, usage }
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export function countSentences(text: string): number {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim()).length
}

/** Returns what's wrong with a draft, or null if it fits the spec. */
function checkSummary(text: string): string | null {
  if (!text) return "it was empty"
  if (/%|\n|^\s*[-*•]/.test(text)) return "it included percentages, line breaks or list formatting"
  // Profiles don't record gender, so a gendered pronoun is always a guess.
  if (/\b(he|she|him|his|her|hers)\b/i.test(text)) return "it used he/she pronouns for the match"
  const words = countWords(text)
  if (words < MIN_WORDS || words > MAX_WORDS) return `it was ${words} words`
  const sentences = countSentences(text)
  if (sentences < MIN_SENTENCES || sentences > MAX_SENTENCES) return `it was ${sentences} sentences`
  return null
}

// Trim, collapse stray whitespace, and drop quotation marks wrapped around the whole note.
function cleanSummary(text: string): string {
  return text
    .trim()
    .replace(/^["“'‘]+|["”'’]+$/g, "")
    .replace(/[ \t]+/g, " ")
    .trim()
}

function describeApiError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) return "invalid or missing ANTHROPIC_API_KEY"
  if (error instanceof Anthropic.RateLimitError) return "rate limited by the Claude API, try again shortly"
  if (error instanceof Anthropic.BadRequestError) return `Claude API rejected the request: ${error.message}`
  if (error instanceof Anthropic.APIConnectionError) return "couldn't reach the Claude API (network or timeout)"
  if (error instanceof Anthropic.APIError) return `Claude API error ${error.status}: ${error.message}`
  return error instanceof Error ? error.message : "unknown error"
}
