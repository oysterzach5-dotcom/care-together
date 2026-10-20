import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Users, Leaf, MapPin, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import banner from "@/assets/banner.jpg.asset.json";
import { AREAS, PATIENT_TYPES } from "@/lib/care";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Care Together — Trusted elderly caregivers near you" },
      { name: "description", content: "Browse verified caregivers by area, task and patient type, and book care for your loved ones." },
      { property: "og:title", content: "Care Together — Trusted elderly caregivers" },
      { property: "og:description", content: "Find and book compassionate caregivers for elderly loved ones." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={banner.url} alt="Care Together banner" width={1920} height={960} className="h-[260px] w-full object-cover object-[70%_30%] sm:h-[420px]" />
      </section>

      <section className="mx-auto -mt-12 max-w-5xl px-4">
        <div className="relative rounded-2xl border bg-card p-6 shadow-lg sm:p-10">
          <h1 className="text-3xl font-bold sm:text-5xl">
            Compassionate care for the people <span className="text-accent">you love</span>
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Find verified caregivers by area, the tasks you need help with, and your loved one's condition. Book in minutes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/caregivers">Find a caregiver</Link>
            </Button>
            <Button asChild size="lg" variant="outline"><Link to="/how-it-works">How it works</Link></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:grid-cols-3">
        {[
          { icon: Heart, title: "Support", text: "Personal care, meals, medication reminders and companionship." },
          { icon: Users, title: "Dignity", text: "Caregivers trained to respect independence and routines." },
          { icon: Leaf, title: "Better Lives", text: "Specialists for dementia, stroke recovery, palliative care and more." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border bg-card p-6">
            <div className="mb-3 inline-flex rounded-full bg-secondary p-3 text-secondary-foreground"><Icon className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <h2 className="text-2xl font-bold">Browse by area</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {AREAS.map((a) => (
            <Link key={a} to="/caregivers" search={{ area: a }} className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 font-medium hover:border-accent hover:text-accent">
              <MapPin className="h-4 w-4" /> {a}
            </Link>
          ))}
        </div>
        <h2 className="mt-10 text-2xl font-bold">Browse by patient need</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {PATIENT_TYPES.map((p) => (
            <Link key={p} to="/caregivers" search={{ patient: p }} className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground">
              {p}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:grid-cols-2">
        <div className="flex gap-4 rounded-xl bg-primary p-6 text-primary-foreground">
          <ShieldCheck className="h-8 w-8 shrink-0" />
          <div><h3 className="text-lg font-semibold">Verified & background-checked</h3><p className="opacity-80">Every caregiver's identity and references are checked.</p></div>
        </div>
        <div className="flex gap-4 rounded-xl bg-accent p-6 text-accent-foreground">
          <Clock className="h-8 w-8 shrink-0" />
          <div><h3 className="text-lg font-semibold">Hourly, daily or live-in</h3><p className="opacity-90">Flexible care that fits your family's schedule.</p></div>
        </div>
      </section>
    </div>
  );
}
