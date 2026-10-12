import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Star, BadgeCheck, Languages, Home } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { photoUrl, formatLKR, estimateTotal } from "@/lib/care";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/caregivers/$id")({
  head: () => ({
    meta: [
      { title: "Caregiver profile — Care Together" },
      { name: "description", content: "View caregiver experience, skills and rates, and book care." },
      { property: "og:title", content: "Caregiver profile — Care Together" },
      { property: "og:description", content: "View caregiver experience, skills and rates, and book care." },
    ],
  }),
  component: CaregiverPage,
});

const bookingSchema = z.object({
  patient_name: z.string().trim().min(1, "Patient name is required").max(100),
  patient_type: z.string().min(1, "Choose a patient type"),
  tasks: z.array(z.string()).min(1, "Choose at least one task"),
  start_date: z.string().min(1, "Choose a start date"),
  hours_per_day: z.number().int().min(1).max(24),
  days: z.number().int().min(1).max(365),
  address: z.string().trim().min(1, "Address is required").max(300),
  notes: z.string().max(1000).optional(),
});

function CaregiverPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const { data: c, isLoading } = useQuery({
    queryKey: ["caregiver", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("caregivers").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ patient_name: "", patient_type: "", tasks: [] as string[], start_date: "", hours_per_day: 4, days: 5, address: "", notes: "" });
  const [saving, setSaving] = useState(false);

  if (isLoading) return <p className="p-10 text-center text-muted-foreground">Loading…</p>;
  if (!c) return <p className="p-10 text-center">Caregiver not found. <Link to="/caregivers" className="text-accent underline">Back to search</Link></p>;

  const total = estimateTotal(Number(c.hourly_rate), form.hours_per_day, form.days);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !c) return;
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({ ...parsed.data, caregiver_id: c.id, user_id: user.id });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Booking request sent to ${c.name}!`);
    navigate({ to: "/bookings" });
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_400px]">
      <div>
        <Link to="/caregivers" className="text-sm text-muted-foreground hover:text-accent">← Back to caregivers</Link>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <img src={photoUrl(c.photo_seed)} alt={c.name} className="h-32 w-32 rounded-full object-cover ring-4 ring-secondary" />
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">{c.name}{c.verified && <BadgeCheck className="h-6 w-6 text-accent" />}</h1>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{c.area} · {c.years_experience} years experience</p>
            <p className="mt-1 flex items-center gap-1"><Star className="h-4 w-4 fill-warm text-warm" />{Number(c.rating).toFixed(1)} rating</p>
            <p className="mt-2 font-display text-2xl font-bold text-primary">{formatLKR(Number(c.hourly_rate))}<span className="text-sm font-normal text-muted-foreground"> / hour</span></p>
          </div>
        </div>
        <p className="mt-6 text-lg">{c.bio}</p>
        <h2 className="mt-8 text-xl font-semibold">Tasks offered</h2>
        <div className="mt-2 flex flex-wrap gap-2">{c.tasks.map((t) => <span key={t} className="rounded-full border px-3 py-1 text-sm">{t}</span>)}</div>
        <h2 className="mt-6 text-xl font-semibold">Experienced with</h2>
        <div className="mt-2 flex flex-wrap gap-2">{c.patient_types.map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{t}</span>)}</div>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <span className="flex items-center gap-2"><Languages className="h-4 w-4" />{c.languages.join(", ")}</span>
          <span className="flex items-center gap-2"><Home className="h-4 w-4" />{c.available_live_in ? "Available for live-in care" : "Visiting care only"}</span>
        </div>
      </div>

      <aside className="rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-20 lg:self-start">
        <h2 className="text-xl font-bold">Book {c.name.split(" ")[0]}</h2>
        {!user ? (
          <div className="mt-4 space-y-3">
            <p className="text-muted-foreground">Sign in to send a booking request.</p>
            <Button asChild className="w-full"><Link to="/auth">Sign in to book</Link></Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div><Label>Patient name</Label><Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} /></div>
            <div>
              <Label>Patient type</Label>
              <select className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={form.patient_type} onChange={(e) => setForm({ ...form, patient_type: e.target.value })}>
                <option value="">Select…</option>
                {c.patient_types.map((p) => <option key={p}>{p}</option>)}
                <option>Other</option>
              </select>
            </div>
            <div>
              <Label>Tasks needed</Label>
              <div className="mt-1 grid grid-cols-1 gap-1.5">
                {c.tasks.map((t) => (
                  <label key={t} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={form.tasks.includes(t)} onCheckedChange={(v) => setForm({ ...form, tasks: v ? [...form.tasks, t] : form.tasks.filter((x) => x !== t) })} />{t}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3"><Label>Start date</Label><Input type="date" value={form.start_date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
              <div className="col-span-1"><Label>Hrs/day</Label><Input type="number" min={1} max={24} value={form.hours_per_day} onChange={(e) => setForm({ ...form, hours_per_day: Number(e.target.value) })} /></div>
              <div className="col-span-2"><Label>Number of days</Label><Input type="number" min={1} value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Care address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div><Label>Notes (optional)</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <div className="flex items-center justify-between rounded-lg bg-muted p-3">
              <span className="text-sm">Estimated total</span>
              <span className="font-display text-lg font-bold">{formatLKR(total)}</span>
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{saving ? "Sending…" : "Send booking request"}</Button>
          </form>
        )}
      </aside>
    </div>
  );
}
