import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { photoUrl, formatLKR, estimateTotal, MEDBOX_DELIVERY } from "@/lib/care";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings — Care Together" },
      { name: "description", content: "View and manage your caregiver bookings." },
      { property: "og:title", content: "My bookings — Care Together" },
      { property: "og:description", content: "View and manage your caregiver bookings." },
    ],
  }),
  component: Bookings,
});

function Bookings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*, caregivers(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["product_orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("product_orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function cancelOrder(id: string): Promise<void> {
    const { error } = await supabase.from("product_orders").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Order cancelled");
    qc.invalidateQueries({ queryKey: ["product_orders"] });
  }

  async function cancel(id: string): Promise<void> {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Booking cancelled");
    qc.invalidateQueries({ queryKey: ["bookings"] });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">My bookings & orders</h1>
      {isLoading && <p className="mt-6 text-muted-foreground">Loading…</p>}
      {data?.length === 0 && (
        <div className="mt-6 rounded-xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">You have no bookings yet.</p>
          <Button asChild className="mt-4"><Link to="/caregivers">Find a caregiver</Link></Button>
        </div>
      )}
      <div className="mt-6 space-y-4">
        {data?.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5">
            {b.caregivers && <img src={photoUrl(b.caregivers.photo_seed)} alt="" className="h-14 w-14 rounded-full object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{b.caregivers?.name} <span className="font-normal text-muted-foreground">for {b.patient_name}</span></p>
              <p className="text-sm text-muted-foreground">From {b.start_date} · {b.days} days × {b.hours_per_day} hrs · {b.patient_type}</p>
              <p className="text-sm text-muted-foreground">{b.tasks.join(", ")}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold">{b.caregivers ? formatLKR(estimateTotal(Number(b.caregivers.hourly_rate), b.hours_per_day, b.days)) : ""}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${b.status === "cancelled" ? "bg-muted text-muted-foreground" : "bg-secondary text-secondary-foreground"}`}>{b.status}</span>
            </div>
            {b.status !== "cancelled" && <Button variant="outline" size="sm" onClick={() => cancel(b.id)}>Cancel</Button>}
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">My product orders</h2>
      {orders?.length === 0 && (
        <div className="mt-4 rounded-xl border bg-card p-6 text-center">
          <p className="text-muted-foreground">No product orders yet.</p>
          <Button asChild className="mt-3"><Link to="/medicine-box">See the Smart Medicine Box</Link></Button>
        </div>
      )}
      <div className="mt-4 space-y-4">
        {orders?.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{o.product} × {o.quantity}</p>
              <p className="text-sm text-muted-foreground">{o.full_name} · {o.phone} · {o.address}, {o.city}</p>
              <p className="text-sm text-muted-foreground">{o.payment_method} · ordered {new Date(o.created_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold">{formatLKR(Number(o.unit_price) * o.quantity + MEDBOX_DELIVERY)}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${o.status === "cancelled" ? "bg-muted text-muted-foreground" : "bg-secondary text-secondary-foreground"}`}>{o.status}</span>
            </div>
            {o.status !== "cancelled" && <Button variant="outline" size="sm" onClick={() => cancelOrder(o.id)}>Cancel</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
