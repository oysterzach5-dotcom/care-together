import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Care Together" },
      { name: "description", content: "Search, compare and book an elderly caregiver in three simple steps." },
      { property: "og:title", content: "How Care Together works" },
      { property: "og:description", content: "Search, compare and book an elderly caregiver in three steps." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  { n: 1, t: "Search", d: "Filter caregivers by area, tasks needed, patient condition, language, budget and live-in availability." },
  { n: 2, t: "Compare", d: "Read profiles, experience, ratings and hourly rates to find the right match." },
  { n: 3, t: "Book", d: "Create a free account, choose dates and hours, and send your booking request." },
  { n: 4, t: "Track", d: "See all your bookings and their status in one place, and cancel if plans change." },
];

function HowItWorks() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-4xl font-bold">How it works</h1>
      <div className="mt-8 space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-5 rounded-xl border bg-card p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xl font-bold text-accent-foreground">{s.n}</div>
            <div><h2 className="text-xl font-semibold">{s.t}</h2><p className="text-muted-foreground">{s.d}</p></div>
          </div>
        ))}
      </div>
      <Button asChild size="lg" className="mt-8"><Link to="/caregivers">Start searching</Link></Button>
    </div>
  );
}
