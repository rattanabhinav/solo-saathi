"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mountain, Check, X, Clock, Copy } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { AppHeader } from "@/components/app-header"
import { CompatibilityCard, buildSignals, type MatchSignal } from "@/components/compatibility-card"

const actionButtonClass = "h-10 sm:h-11 px-3 sm:px-5 has-[>svg]:px-3 sm:has-[>svg]:px-5 rounded-xl gap-1.5 sm:gap-2 text-sm sm:text-[15px] font-bold"
const tabClass =
  "flex-none h-auto px-3 sm:px-[18px] py-2.5 rounded-[10px] border-0 text-sm sm:text-[15px] font-medium text-white/80 data-[state=active]:bg-lime data-[state=active]:text-forest data-[state=active]:font-bold data-[state=active]:shadow-none"

type ConnectionRequest = {
  id: string
  direction: "sent" | "received"
  status: "pending" | "accepted" | "declined"
  otherId: string
  otherName: string
  otherAge: number
  otherCity: string
  otherTrekDestination: string
  overallScore: number
  otherEmail: string | null
  signals: MatchSignal[]
}

export default function RequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<ConnectionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [respondingTo, setRespondingTo] = useState<string | null>(null)

  const loadRequests = async () => {
    const { data, error: rpcError } = await supabase.rpc("get_my_connection_requests")

    if (rpcError) {
      setError(rpcError.message)
      setLoading(false)
      return
    }

    setRequests(
      (data ?? []).map((row: Record<string, string | number | null>) => ({
        id: row.request_id as string,
        direction: row.direction as "sent" | "received",
        status: row.status as "pending" | "accepted" | "declined",
        otherId: row.other_id as string,
        otherName: row.other_name as string,
        otherAge: row.other_age as number,
        otherCity: row.other_city as string,
        otherTrekDestination: row.other_trek_destination as string,
        overallScore: row.overall_score as number,
        otherEmail: row.other_email as string | null,
        signals: buildSignals(row),
      }))
    )
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/auth")
        return
      }

      await loadRequests()
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const respond = async (requestId: string, response: "accepted" | "declined") => {
    setRespondingTo(requestId)

    const { error: rpcError } = await supabase.rpc("respond_to_connection_request", {
      p_request_id: requestId,
      p_response: response,
    })

    if (rpcError) {
      setRespondingTo(null)
      setError(rpcError.message)
      return
    }

    // Re-fetch rather than patch state locally — accepting flips whether
    // other_email is included, and a local patch would keep the stale
    // null from when this row was still pending.
    await loadRequests()
    setRespondingTo(null)
  }

  // Accepted requests (either direction) live only in the Accepted tab;
  // Sent/Received keep both pending and declined so a decline is visible
  // as history, not erased.
  const sent = requests.filter(r => r.direction === "sent" && r.status !== "accepted")
  const received = requests.filter(r => r.direction === "received" && r.status !== "accepted")
  const accepted = requests.filter(r => r.status === "accepted")
  const receivedPendingCount = received.filter(r => r.status === "pending").length

  return (
    <div className="bg-app-daylight min-h-screen text-forest">
      <AppHeader
        backHref="/matches"
        title="Connection Requests"
        subtitle={receivedPendingCount > 0 ? `${receivedPendingCount} waiting on you` : "You're all caught up"}
        className="sticky top-0 z-50"
      >
        <Link href="/" aria-label="SoloSaathi home" className="shrink-0 flex items-center">
          <Mountain className="size-6 sm:size-7 text-lime" />
        </Link>
      </AppHeader>

      <main className="max-w-[1008px] mx-auto px-6 py-6">
        {loading && (
          <div className="text-center py-16 text-[#4A5F5B]">Loading requests…</div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-[#F6C6C6] bg-[#FDEAEA] px-4 py-2.5 text-sm text-[#B42318]">
            {error}
          </div>
        )}

        {!loading && (
          <Tabs defaultValue="received" className="gap-6">
            <TabsList className="h-auto gap-1 p-[5px] rounded-[14px] bg-forest shadow-[0_10px_24px_rgba(6,38,29,0.2)] max-w-full overflow-x-auto justify-start">
              <TabsTrigger value="received" className={tabClass}>Received ({received.length})</TabsTrigger>
              <TabsTrigger value="sent" className={tabClass}>Sent ({sent.length})</TabsTrigger>
              <TabsTrigger value="accepted" className={tabClass}>Accepted ({accepted.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-5">
              {received.length === 0 && (
                <EmptyState text="No one has sent you any connection request yet" />
              )}
              {received.map((r) => (
                <CompatibilityCard
                  key={r.id}
                  name={r.otherName}
                  age={r.otherAge}
                  city={r.otherCity}
                  trekDestination={r.otherTrekDestination}
                  overallScore={r.overallScore}
                  signals={r.signals}
                  actions={
                    r.status === "declined" ? (
                      <StatusBadge status="declined" />
                    ) : (
                      <div className="flex gap-2 sm:gap-2.5">
                        <Button
                          size="sm"
                          onClick={() => respond(r.id, "accepted")}
                          disabled={respondingTo === r.id}
                          className={`${actionButtonClass} bg-meadow hover:bg-meadow/90`}
                        >
                          <Check className="size-4 sm:size-5" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respond(r.id, "declined")}
                          disabled={respondingTo === r.id}
                          className={`${actionButtonClass} border-[#D5E0DC] bg-white text-forest hover:bg-[#F3F7F5] hover:text-forest`}
                        >
                          <X className="size-4 sm:size-5" />
                          Decline
                        </Button>
                      </div>
                    )
                  }
                />
              ))}
            </TabsContent>

            <TabsContent value="sent" className="space-y-5">
              {sent.length === 0 && (
                <EmptyState text="You haven't sent any connection request yet" />
              )}
              {sent.map((r) => (
                <CompatibilityCard
                  key={r.id}
                  name={r.otherName}
                  age={r.otherAge}
                  city={r.otherCity}
                  trekDestination={r.otherTrekDestination}
                  overallScore={r.overallScore}
                  signals={r.signals}
                  actions={<StatusBadge status={r.status as "pending" | "declined"} />}
                />
              ))}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-5">
              {accepted.length === 0 && (
                <EmptyState text="You haven't accepted any connection request yet" />
              )}
              {accepted.map((r) => (
                <CompatibilityCard
                  key={r.id}
                  name={r.otherName}
                  age={r.otherAge}
                  city={r.otherCity}
                  trekDestination={r.otherTrekDestination}
                  overallScore={r.overallScore}
                  signals={r.signals}
                  actions={r.otherEmail ? <EmailCopyAction email={r.otherEmail} /> : null}
                />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: "pending" | "declined" }) {
  if (status === "declined") {
    return (
      <Badge className={`${statusBadgeClass} bg-[#FDEAEA] text-[#B42318] border-[#F6C6C6]`} variant="outline">
        <X />
        Declined
      </Badge>
    )
  }
  return (
    <Badge className={`${statusBadgeClass} bg-[#FFF1D6] text-[#8A5208] border-marigold`} variant="outline">
      <Clock />
      Pending
    </Badge>
  )
}

const statusBadgeClass = "gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold [&>svg]:size-4"

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-white shadow-[0_10px_24px_rgba(11,26,60,0.1)] flex items-center justify-center mx-auto mb-4">
        <Mountain className="w-8 h-8 text-meadow" />
      </div>
      <p className="text-[#4A5F5B] max-w-sm mx-auto">{text}</p>
    </div>
  )
}

// Only ever rendered on the Accepted tab — email is withheld by the backend
// for pending requests, so this component never sees one otherwise.
function EmailCopyAction({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      title={email}
      className="flex items-center gap-1.5 h-11 px-3.5 rounded-xl border border-[#D5E0DC] bg-[#F3F7F5] hover:bg-[#E7EFEB] text-[13px] font-semibold text-forest transition-colors max-w-[200px]"
    >
      {copied ? (
        <Check className="size-4 text-meadow shrink-0" />
      ) : (
        <Copy className="size-4 shrink-0" />
      )}
      <span className="truncate">{copied ? "Copied!" : email}</span>
    </button>
  )
}
