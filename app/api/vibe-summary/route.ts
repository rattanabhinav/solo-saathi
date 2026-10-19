import { NextResponse } from "next/server"
import { supabaseAsUser } from "@/lib/supabase/server"
import { VIBE_SUMMARY_MODEL } from "@/lib/vibe/config"
import { generateVibeSummary, vibeInputsHash } from "@/lib/vibe/generate"
import { vibeInputsFromRow, type VibeRow } from "@/lib/vibe/inputs"

// POST /api/vibe-summary   body: { matchId }   →   { summary }
//
// Called by the matches page in the background, once per 70%+ match card.
//   1. Who's asking? The page sends the user's Supabase login token.
//   2. Read both profiles through get_vibe_inputs. The database itself checks
//      the token, and that this is a real same-trek, 70%+ match.
//   3. Saved summary still current (fingerprint matches)? Return it, no AI call.
//   4. Otherwise ask Claude, save the result, and return it.
//
// Any failure returns { summary: null } with an error status, and the card
// simply doesn't show the panel.

// Seconds Vercel lets this run. A fresh summary usually takes 3-8s; this
// leaves room for a slow Claude response plus one rewrite.
export const maxDuration = 60

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return fail(401, "not logged in")

  const body: unknown = await request.json().catch(() => null)
  const matchId = typeof body === "object" && body !== null && "matchId" in body ? body.matchId : null
  if (typeof matchId !== "string" || !UUID.test(matchId)) return fail(400, "matchId must be a profile id")

  const supabase = supabaseAsUser(token)

  // get_vibe_inputs returns one row for an eligible match, none otherwise.
  const { data: row, error, status } = await supabase
    .rpc("get_vibe_inputs", { p_match_id: matchId })
    .maybeSingle()
    .overrideTypes<VibeRow, { merge: false }>()
  if (error) {
    if (status === 401) return fail(401, "not logged in or login expired, please log in again")
    console.error(`[vibe-summary] get_vibe_inputs failed: ${error.message}`)
    return fail(500, "couldn't read profiles")
  }
  if (!row) return fail(404, "not an eligible match")

  const inputs = vibeInputsFromRow(row)
  const inputsHash = vibeInputsHash(inputs)
  if (row.cached_summary && row.cached_inputs_hash === inputsHash) {
    return NextResponse.json({ summary: row.cached_summary, source: "saved" })
  }

  const result = await generateVibeSummary(inputs)
  if (!result.ok) {
    console.error(`[vibe-summary] generation failed for ${matchId}: ${result.reason}`)
    return fail(502, "couldn't write a summary right now")
  }

  const { error: saveError } = await supabase.rpc("save_vibe_summary", {
    p_match_id: matchId,
    p_summary: result.summary,
    p_inputs_hash: inputsHash,
    p_model: VIBE_SUMMARY_MODEL,
  })
  // Still return the summary: the user sees it now, and it's just rewritten next visit.
  if (saveError) console.error(`[vibe-summary] save failed for ${matchId}: ${saveError.message}`)

  return NextResponse.json({ summary: result.summary, source: "new" })
}

function fail(status: number, reason: string) {
  return NextResponse.json({ summary: null, reason }, { status })
}
