// Browser side of Vibe Summary: asks /api/vibe-summary for each eligible
// match card in the background, a few at a time, in the order given.

export type VibeState =
  | { status: "loading" }
  | { status: "ready"; summary: string }
  | { status: "unavailable" } // not eligible, or the AI couldn't write one: the card hides the panel

// How many summaries to request at once. Saved ones come back instantly; new
// ones take a few seconds each, so a small batch fills the top cards quickly
// without flooding the Claude API.
const PARALLEL_REQUESTS = 3

export async function loadVibeSummaries(
  matchIds: string[],
  accessToken: string,
  onResult: (matchId: string, state: VibeState) => void,
  isCancelled: () => boolean
): Promise<void> {
  let next = 0
  async function worker() {
    while (next < matchIds.length && !isCancelled()) {
      const matchId = matchIds[next++]
      const state = await fetchVibeSummary(matchId, accessToken)
      if (!isCancelled()) onResult(matchId, state)
    }
  }
  await Promise.all(Array.from({ length: Math.min(PARALLEL_REQUESTS, matchIds.length) }, worker))
}

async function fetchVibeSummary(matchId: string, accessToken: string): Promise<VibeState> {
  try {
    const response = await fetch("/api/vibe-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ matchId }),
    })
    const data: { summary?: string | null } = await response.json()
    return response.ok && data.summary ? { status: "ready", summary: data.summary } : { status: "unavailable" }
  } catch {
    return { status: "unavailable" }
  }
}
