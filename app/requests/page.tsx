"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mountain, Check, X, Clock, Copy } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { CompatibilityCard, buildSignals, type MatchSignal } from "@/components/compatibility-card"

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/matches" className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="font-bold text-foreground">Connection Requests</h1>
              <p className="text-sm text-muted-foreground">
                {receivedPendingCount > 0 ? `${receivedPendingCount} waiting on you` : "You're all caught up"}
              </p>
            </div>
          </div>
          <Mountain className="w-6 h-6 text-primary" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        {loading && (
          <div className="text-center py-16 text-muted-foreground">Loading requests…</div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && (
          <Tabs defaultValue="received">
            <TabsList className="mb-4">
              <TabsTrigger value="received">Received ({received.length})</TabsTrigger>
              <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="received" className="space-y-4">
              {received.length === 0 && (
                <EmptyState text="No one's sent you a connection request yet." />
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => respond(r.id, "accepted")}
                          disabled={respondingTo === r.id}
                          className="gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respond(r.id, "declined")}
                          disabled={respondingTo === r.id}
                          className="gap-1"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </Button>
                      </div>
                    )
                  }
                />
              ))}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {sent.length === 0 && (
                <EmptyState text="You haven't sent any connection requests yet." />
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

            <TabsContent value="accepted" className="space-y-4">
              {accepted.length === 0 && (
                <EmptyState text="No connections yet — accepted requests (either direction) will show up here with a way to reach them." />
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
      <Badge className="gap-1 bg-red-100 text-red-700 border-red-200" variant="outline">
        <X className="w-3 h-3" />
        Declined
      </Badge>
    )
  }
  return (
    <Badge className="gap-1 bg-yellow-100 text-yellow-700 border-yellow-200" variant="outline">
      <Clock className="w-3 h-3" />
      Pending
    </Badge>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Mountain className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground max-w-sm mx-auto">{text}</p>
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
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-xs font-medium text-foreground transition-colors max-w-[170px]"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 shrink-0" />
      )}
      <span className="truncate">{copied ? "Copied!" : email}</span>
    </button>
  )
}
