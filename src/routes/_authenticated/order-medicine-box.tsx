import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AREAS, MEDBOX_PRICE, MEDBOX_DELIVERY, medboxTotal, formatLKR } from "@/lib/care";
import img from "@/assets/medbox-1.jpeg.asset.json";

export const Route = createFileRoute("/_authenticated/order-medicine-box")({
  head: () => ({
    meta: [
      { title: "Order the Smart Medicine Box — Care Together" },
      { name: "description", content: "Delivery details, payment and ordering info for the Smart Medicine Box." },
      { property: "og:title", content: "Order the Smart Medicine Box" },
      { property: "og:description", content: "Place your Smart Medicine Box order with Care Together." },
    ],
  }),
  component: OrderPage,
});

const PAYMENTS = ["Cash on delivery", "Bank transfer", "Card on delivery"];

function OrderPage() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState<string>("Cash on delivery");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setBusy(false); return; }
    const { error } = await supabase.from("product_orders").insert({
      user_id: u.user.id,
      quantity: qty,
      unit_price: MEDBOX_PRICE,
      full_name: String(f.get("full_name")),
      phone: String(f.get("phone")),
      address: String(f.get("address")),
      city: String(f.get("city")),
      payment_method: payment,
      notes: String(f.get("notes") || "") || null,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Order placed! We'll call you to confirm delivery.");
    navigate({ to: "/bookings" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Order the Smart Medicine Box</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" required /></div>
            <div><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" type="tel" required /></div>
          </div>
          <div><Label htmlFor="address">Address</Label><Input id="address" name="address" required /></div>
          <div>
            <Label htmlFor="city">City</Label>
            <select id="city" name="city" className="mt-1 h-10 w-full rounded-md border bg-background px-3" defaultValue={AREAS[0]}>
              {AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <Label>Payment method</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <button type="button" key={p} onClick={() => setPayment(p)} className={`rounded-full border px-4 py-2 text-sm font-medium ${payment === p ? "border-accent bg-accent text-accent-foreground" : "bg-background"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div><Label htmlFor="notes">Notes (optional)</Label><Textarea id="notes" name="notes" placeholder="e.g. call before delivery" /></div>
          <Button type="submit" size="lg" disabled={busy} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {busy ? "Placing order…" : `Place order · ${formatLKR(medboxTotal(qty))}`}
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <img src={img.url} alt="Smart Medicine Box" className="aspect-video w-full rounded-lg object-cover" />
            <p className="mt-3 font-semibold">Smart Medicine Box</p>
            <p className="text-sm text-muted-foreground">{formatLKR(MEDBOX_PRICE)} each</p>
            <div className="mt-3 flex items-center gap-3">
              <Button type="button" variant="outline" size="icon" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less"><Minus className="h-4 w-4" /></Button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <Button type="button" variant="outline" size="icon" onClick={() => setQty(Math.min(10, qty + 1))} aria-label="More"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="mt-4 space-y-1 border-t pt-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatLKR(MEDBOX_PRICE * qty)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{formatLKR(MEDBOX_DELIVERY)}</span></div>
              <div className="flex justify-between font-display text-base font-bold"><span>Total</span><span>{formatLKR(medboxTotal(qty))}</span></div>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border bg-card p-5 text-sm">
            <h3 className="font-semibold">Ordering info</h3>
            <p className="flex gap-2"><Truck className="h-4 w-4 shrink-0 text-accent" /> Delivered in 3–5 working days within Sri Lanka.</p>
            <p className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-accent" /> 1-year warranty and free setup help on delivery.</p>
            <p className="flex gap-2"><RotateCcw className="h-4 w-4 shrink-0 text-accent" /> 7-day returns if the box is unused.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
