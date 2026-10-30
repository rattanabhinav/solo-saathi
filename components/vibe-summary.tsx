"use client"

import { Sparkles } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"

// "Why you may vibe" panel on a match card (docs/features/vibe_summary.md).
// Open by default. `summary` is null while the AI note is still loading.
export function VibeSummary({ summary }: { summary: string | null }) {
  const loading = summary === null

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="vibe"
      className="rounded-xl border border-primary/20 bg-primary/5"
    >
      <AccordionItem value="vibe" className="border-b-0">
        <AccordionTrigger className="items-center px-4 py-3 hover:no-underline">
          <span className="flex items-center gap-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-sm font-semibold text-foreground">Why you may vibe</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4" aria-busy={loading}>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full bg-primary/10" />
              <Skeleton className="h-3.5 w-11/12 bg-primary/10" />
              <Skeleton className="h-3.5 w-3/4 bg-primary/10" />
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground/80">{summary}</p>
          )}
          <p className="mt-2.5 text-xs text-muted-foreground">
            {loading ? "Reading both your trek answers…" : "Written by AI from both your trek answers"}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
