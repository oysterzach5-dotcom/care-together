import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlarmClock, CalendarClock, DoorOpen, Pill, ShieldCheck, Volume2 } from "lucide-react";
import { formatLKR, MEDBOX_PRICE } from "@/lib/care";
import { Button } from "@/components/ui/button";
import img1 from "@/assets/medbox-1.jpeg.asset.json";
import img2 from "@/assets/medbox-2.jpeg.asset.json";
import img3 from "@/assets/medbox-3.jpeg.asset.json";
import img4 from "@/assets/medbox-4.jpeg.asset.json";

export const Route = createFileRoute("/medicine-box")({
  head: () => ({
    meta: [
      { title: "Smart Medicine Box — Care Together" },
      { name: "description", content: "An automated medicine box with scheduled alarms and automatic pill dispensing for elderly people." },
      { property: "og:title", content: "Smart Medicine Box — Care Together" },
      { property: "og:description", content: "The right medication at the right time, with alarms and automatic dispensing." },
    ],
  }),
  component: MedicineBox,
});

const IMAGES = [img1.url, img2.url, img4.url, img3.url];

function MedicineBox() {
  const [active, setActive] = useState(IMAGES[0]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <img src={active} alt="Smart Medicine Box" className="aspect-[16/10] w-full rounded-2xl border object-cover" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {IMAGES.map((src) => (
              <button key={src} onClick={() => setActive(src)} className={`overflow-hidden rounded-lg border-2 ${active === src ? "border-accent" : "border-transparent"}`}>
                <img src={src} alt="Medicine box view" className="aspect-video w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">New product</span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Smart Medicine Box</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The Smart Medicine Box is an automated, user-friendly medication management device designed to help elderly individuals take the right medication at the right time. By combining smart scheduling, auditory alerts, and automated pill dispensing, it eliminates confusion and ensures medication safety at home.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: CalendarClock, t: "Smart scheduling" },
              { icon: Volume2, t: "Auditory alerts" },
              { icon: Pill, t: "Automatic pill dispensing" },
              { icon: ShieldCheck, t: "Medication safety at home" },
            ].map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-center gap-3 rounded-xl border bg-card p-3 font-medium">
                <Icon className="h-5 w-5 text-accent" /> {t}
              </div>
            ))}
          </div>
          <p className="mt-8 font-display text-3xl font-bold">{formatLKR(MEDBOX_PRICE)}</p>
          <Button asChild size="lg" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/order-medicine-box">Order now</Link>
          </Button>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">How to use</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-3 inline-flex rounded-full bg-secondary p-3 text-secondary-foreground"><DoorOpen className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold">1. Loading the medication</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Open the door of the medicine box.</li>
              <li>Place the prescribed pills into their designated compartments according to the schedule, and securely close the door.</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-3 inline-flex rounded-full bg-secondary p-3 text-secondary-foreground"><AlarmClock className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold">2. Alarm & automatic dispensing</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>When the scheduled medication time arrives, the device triggers an alarm to notify the user.</li>
              <li>The system then automatically dispenses the exact dose of pills needed for that time.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
