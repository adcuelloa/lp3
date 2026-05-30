import { LogIn, LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GitHub } from "@/components/ui/github-icon";
import type { AuthUser } from "@/types";

interface HeroAuth {
  user: AuthUser | null | undefined;
  isAdmin: boolean;
  logoutPending: boolean;
}

interface HeroCats {
  count: number;
  isLoading: boolean;
  isError: boolean;
}

interface HeroHeaderProps {
  auth: HeroAuth;
  cats: HeroCats;
  onLogout: () => void;
  onLoginOpen: () => void;
  onAddOpen: () => void;
  onMeetCats: () => void;
}

export default function HeroHeader({
  auth,
  cats,
  onLogout,
  onLoginOpen,
  onAddOpen,
  onMeetCats,
}: HeroHeaderProps) {
  const isAuthenticated = auth.user != null;

  return (
    <header className="bg-espresso relative">
      <div className="bg-primary h-0.75 w-full" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] select-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-10 pb-32">
        <div
          className="animate-fade-up mb-16 flex items-center justify-between"
          style={{ animationDelay: "0ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary h-[1.5px] w-7" />
            <span
              className="text-brand-light text-[10px] font-semibold tracking-[0.4em] uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Feline Adoption Center · Est. 2025
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/adcuelloa/lp3"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 p-1.5 text-white/50 transition-colors hover:border-white/40 hover:bg-white/8 hover:text-white"
              aria-label="GitHub repository"
            >
              <GitHub width={16} height={16} />
            </a>
            {isAuthenticated ? (
              <>
                <span className="hidden text-xs text-white/50 sm:block">
                  {auth.user?.name}
                  {auth.isAdmin && (
                    <span className="bg-primary/30 text-primary ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                      admin
                    </span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:bg-white/8 hover:text-white"
                  onClick={onLogout}
                  disabled={auth.logoutPending}
                >
                  <LogOut data-icon="inline-start" size={14} />
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:bg-white/8 hover:text-white"
                onClick={onLoginOpen}
              >
                <LogIn data-icon="inline-start" size={14} />
                Staff
              </Button>
            )}
            {auth.isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:bg-white/8 hover:text-white"
                onClick={onAddOpen}
              >
                <Plus data-icon="inline-start" />
                Register
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_260px]">
          <div>
            <h1
              className="animate-fade-up mb-7 text-[5.5rem] leading-[0.85] font-semibold text-white italic md:text-[7.5rem]"
              style={{
                animationDelay: "80ms",
                fontFamily: "var(--font-display)",
                textShadow: "0 4px 48px rgba(212,120,62,0.15)",
              }}
            >
              La
              <br />
              <span className="text-primary">Gatería</span>
            </h1>

            <p
              className="animate-fade-up mb-9 max-w-sm text-lg leading-relaxed font-light"
              style={{ animationDelay: "160ms", color: "#b89a88" }}
            >
              Every cat that arrives here deserves a home full of love, cuddles, and company.
            </p>

            <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
              <Button
                size="lg"
                className="rounded-full px-8 shadow-[0_8px_32px_rgba(212,120,62,0.4)] transition-transform hover:scale-105 active:scale-95"
                onClick={onMeetCats}
              >
                Meet the cats
              </Button>
            </div>
          </div>

          <div
            className="animate-fade-up hidden rounded-2xl border border-white/10 p-6 md:block"
            style={{
              animationDelay: "200ms",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="py-4 text-center">
              <div className="mb-3 text-5xl">🐾</div>
              <div
                className="mb-1 text-5xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cats.isLoading ? "·" : cats.isError ? "—" : cats.count}
              </div>
              <div className="text-[10px] tracking-widest text-white/40 uppercase">
                {!cats.isLoading && !cats.isError && cats.count === 1
                  ? "Cat available"
                  : "Cats available"}
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-center">
              <p className="text-[10px] tracking-wider text-white/25 uppercase">
                Ready for a new home
              </p>
            </div>
          </div>
        </div>
      </div>

      <svg
        className="absolute right-0 left-0 block"
        width="100%"
        height="72"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fill: "var(--color-background)", bottom: "-1px" }}
        aria-hidden="true"
      >
        <path d="M0,72 L0,52 C480,8 960,68 1440,28 L1440,72 Z" />
      </svg>
    </header>
  );
}
