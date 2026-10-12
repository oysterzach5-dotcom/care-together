import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg.asset.json";

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="Care Together logo" className="h-10 w-10 rounded-full object-cover object-top" />
          <span className="font-display text-xl font-bold text-primary">
            Care <span className="text-accent">Together</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          <Link to="/caregivers" className="px-2 py-1 font-medium hover:text-accent" activeProps={{ className: "text-accent" }}>
            Find caregivers
          </Link>
          <Link to="/how-it-works" className="hidden px-2 py-1 font-medium hover:text-accent sm:block" activeProps={{ className: "text-accent" }}>
            How it works
          </Link>
          {user ? (
            <>
              <Link to="/bookings" className="px-2 py-1 font-medium hover:text-accent" activeProps={{ className: "text-accent" }}>
                My bookings
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
        <p className="font-display text-lg font-semibold">Care Together</p>
        <p className="opacity-80">Care driven by heart · Support · Dignity · Better Lives</p>
        <p className="mt-4 opacity-60">University project demo — not a real service.</p>
      </div>
    </footer>
  );
}
