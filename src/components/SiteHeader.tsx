import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Menu, LogOut, CalendarDays, Stethoscope, Package, Info, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import logo from "@/assets/logo-icon.png.asset.json";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/caregivers", label: "Find caregivers", icon: Stethoscope },
  { to: "/medicine-box", label: "Medicine box", icon: Package },
  { to: "/how-it-works", label: "How it works", icon: Info },
] as const;

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
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
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 sm:flex sm:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src={logo.url} alt="Care Together logo" className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11" />
          <span className="truncate font-display text-lg font-bold text-primary sm:text-xl">
            Care <span className="text-accent">Together</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 text-sm sm:flex">
          {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-2 py-1 font-medium hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/bookings"
                className="px-2 py-1 font-medium hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                My bookings
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>
          )}
        </nav>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 sm:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-display text-primary">
                Care <span className="text-accent">Together</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col gap-1 px-2 text-sm">
              {NAV_LINKS.map((l) => (
                <SheetClose asChild key={l.to}>
                  <Link
                    to={l.to}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                    activeProps={{ className: "bg-accent text-accent-foreground" }}
                  >
                    <l.icon className="h-5 w-5 shrink-0" />
                    {l.label}
                  </Link>
                </SheetClose>
              ))}
              {user && (
                <SheetClose asChild>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                    activeProps={{ className: "bg-accent text-accent-foreground" }}
                  >
                    <CalendarDays className="h-5 w-5 shrink-0" />
                    My bookings
                  </Link>
                </SheetClose>
              )}
            </nav>
            <div className="mt-auto p-4">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              ) : (
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link to="/auth">Sign in</Link>
                  </Button>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
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
