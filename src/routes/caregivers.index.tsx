import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { MapPin, Star, BadgeCheck, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AREAS, TASKS, PATIENT_TYPES, photoUrl, formatLKR } from "@/lib/care";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  area: z.string().optional(),
  task: z.string().optional(),
  patient: z.string().optional(),
  q: z.string().optional(),
  maxRate: z.number().optional(),
  liveIn: z.boolean().optional(),
});

export const Route = createFileRoute("/caregivers/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Find caregivers — Care Together" },
      { name: "description", content: "Browse elderly caregivers by area, task and patient type." },
      { property: "og:title", content: "Find caregivers — Care Together" },
      { property: "og:description", content: "Browse elderly caregivers by area, task and patient type." },
    ],
  }),
  component: Browse,
});

function Select({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (v?: string) => void }) {
  return (
    <div>
      <Label className="mb-1 block">{label}</Label>
      <select
        className="h-10 w-full rounded-md border bg-card px-3 text-sm"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
      >
        <option value="">Any</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Browse() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/caregivers/" });
  const set = (patch: Partial<typeof s>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const { data, isLoading } = useQuery({
    queryKey: ["caregivers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("caregivers").select("*").order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const list = (data ?? []).filter((c) =>
    (!s.area || c.area === s.area) &&
    (!s.task || c.tasks.includes(s.task)) &&
    (!s.patient || c.patient_types.includes(s.patient)) &&
    (!s.maxRate || Number(c.hourly_rate) <= s.maxRate) &&
    (!s.liveIn || c.available_live_in) &&
    (!s.q || `${c.name} ${c.bio} ${c.languages.join(" ")}`.toLowerCase().includes(s.q.toLowerCase())),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Find a caregiver</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4 rounded-xl border bg-card p-5 lg:sticky lg:top-20 lg:self-start">
          <div>
            <Label className="mb-1 block">Search</Label>
            <Input placeholder="Name, language…" value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} />
          </div>
          <Select label="Area" value={s.area} options={AREAS} onChange={(v) => set({ area: v })} />
          <Select label="Task needed" value={s.task} options={TASKS} onChange={(v) => set({ task: v })} />
          <Select label="Patient type" value={s.patient} options={PATIENT_TYPES} onChange={(v) => set({ patient: v })} />
          <div>
            <Label className="mb-1 block">Max hourly rate (Rs.)</Label>
            <Input type="number" placeholder="e.g. 2000" value={s.maxRate ?? ""} onChange={(e) => set({ maxRate: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="livein" checked={!!s.liveIn} onCheckedChange={(v) => set({ liveIn: v ? true : undefined })} />
            <Label htmlFor="livein">Live-in available</Label>
          </div>
          <Button variant="outline" className="w-full" onClick={() => navigate({ search: {} })}>Clear filters</Button>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">{isLoading ? "Loading…" : `${list.length} caregiver${list.length === 1 ? "" : "s"} found`}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {list.map((c) => (
              <Link key={c.id} to="/caregivers/$id" params={{ id: c.id }} className="group rounded-xl border bg-card p-5 transition hover:border-accent hover:shadow-md">
                <div className="flex gap-4">
                  <img src={photoUrl(c.photo_seed)} alt={c.name} className="h-20 w-20 rounded-full object-cover" />
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-1 text-lg font-semibold group-hover:text-accent">
                      {c.name} {c.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
                    </h3>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{c.area} · {c.years_experience} yrs</p>
                    <p className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-warm text-warm" />{Number(c.rating).toFixed(1)}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-display text-lg font-bold">{formatLKR(Number(c.hourly_rate))}</p>
                    <p className="text-xs text-muted-foreground">per hour</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{c.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.patient_types.map((p) => <span key={p} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{p}</span>)}
                  {c.available_live_in && <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"><Home className="h-3 w-3" />Live-in</span>}
                </div>
              </Link>
            ))}
          </div>
          {!isLoading && list.length === 0 && <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">No caregivers match these filters. Try removing one.</p>}
        </div>
      </div>
    </div>
  );
}
