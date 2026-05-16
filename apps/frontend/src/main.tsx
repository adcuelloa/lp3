import "./styles.css";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

import CatCard from "@/components/CatCard";
import CatModal from "@/components/CatModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/lib/http";

interface Cat {
  id: number;
  name: string;
}

const fetchCats = async (): Promise<Cat[]> => {
  const { data } = await http.get<Cat[]>("/cat");
  return Array.isArray(data) ? data : [];
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function App() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCat, setEditCat] = useState<Cat | null>(null);
  const qc = useQueryClient();

  const { data: cats = [], isLoading, isError } = useQuery({
    queryKey: ["cats"],
    queryFn: fetchCats,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => http.post<Cat>("/cat", { name }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cats"] });
      setIsAddOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      http.patch<Cat>(`/cat/${id}`, { name }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cats"] });
      setEditCat(null);
    },
  });

  return (
    <div className="min-h-full">
      {/* ── Hero ── */}
      <header className="relative bg-espresso">
        {/* Top terracotta accent bar */}
        <div className="h-[3px] w-full bg-primary" />

        {/* Dot-grid background texture */}
        <div
          className="pointer-events-none absolute inset-0 select-none opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Giant decorative letterform */}
        <div
          className="pointer-events-none absolute -right-12 bottom-8 select-none text-[28rem] font-bold italic leading-none text-white/[0.025]"
          aria-hidden="true"
          style={{ fontFamily: "var(--font-display)" }}
        >
          G
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-32 pt-10">
          {/* Top navigation row */}
          <div
            className="animate-fade-up mb-16 flex items-center justify-between"
            style={{ animationDelay: "0ms" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-[1.5px] w-7 bg-primary" />
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-light"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Centro de Adopción Felina · Est. 2025
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:bg-white/8 hover:text-white"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus data-icon="inline-start" />
              Registrar
            </Button>
          </div>

          {/* Two-column layout: title + stat panel */}
          <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_260px]">
            {/* Left: title + tagline + main CTA */}
            <div>
              <h1
                className="animate-fade-up mb-7 text-[5.5rem] font-bold italic leading-[0.85] text-white md:text-[7.5rem]"
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
                className="animate-fade-up mb-9 max-w-sm text-lg font-light leading-relaxed"
                style={{ animationDelay: "160ms", color: "#b89a88" }}
              >
                Cada felino que llega aquí merece un hogar lleno de amor, mimos y compañía.
              </p>

              <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
                <Button
                  size="lg"
                  className="rounded-full px-8 shadow-[0_8px_32px_rgba(212,120,62,0.4)] transition-transform hover:scale-105 active:scale-95"
                  onClick={() => setIsAddOpen(true)}
                >
                  <Plus data-icon="inline-start" />
                  Registrar un Gato
                </Button>
              </div>
            </div>

            {/* Right: frosted stat card */}
            <div
              className="animate-fade-up hidden rounded-2xl border border-white/10 p-6 md:block"
              style={{
                animationDelay: "200ms",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="py-4 text-center">
                <div className="mb-3 text-5xl">🐾</div>
                <div
                  className="mb-1 text-5xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {isLoading ? "·" : isError ? "—" : cats.length}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  {!isLoading && !isError && cats.length === 1
                    ? "Gatito disponible"
                    : "Gatitos disponibles"}
                </div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  Listos para un nuevo hogar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Asymmetric wave transition */}
        <svg
          className="absolute bottom-0 left-0 block w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ fill: "var(--color-background)" }}
          aria-hidden="true"
        >
          <path d="M0,80 C200,20 400,72 700,38 C950,8 1200,64 1440,28 L1440,80 L0,80 Z" />
        </svg>
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Section header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-[1.5px] w-5 bg-primary" />
          <h2
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Disponibles para adoptar
          </h2>
          {!isLoading && !isError && (
            <>
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-light text-muted-foreground">
                {cats.length} {cats.length === 1 ? "gatito" : "gatitos"}
              </span>
            </>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-20">
            <AlertCircle size={28} className="text-muted-foreground" />
            <p
              className="text-base font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No se pudo conectar con la API
            </p>
            <p className="text-sm text-muted-foreground">
              Asegúrate de que el servidor esté corriendo en el puerto 3000.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && cats.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card py-24">
            <span className="animate-float text-5xl">🏠</span>
            <p
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ¡El refugio está vacío!
            </p>
            <p className="mb-1 text-sm text-muted-foreground">
              Registra el primer gato disponible para adopción.
            </p>
            <Button size="sm" className="rounded-full" onClick={() => setIsAddOpen(true)}>
              <Plus data-icon="inline-start" />
              Registrar Gato
            </Button>
          </div>
        )}

        {/* Cat grid */}
        {!isLoading && !isError && cats.length > 0 && (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
          >
            {cats.map((cat, index) => (
              <CatCard key={cat.id} cat={cat} index={index} onEdit={() => setEditCat(cat)} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ── */}
      <CatModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Registrar nuevo gato"
        description="Ingresa el nombre del gato que deseas registrar en el refugio."
        onSubmit={(name) => createMutation.mutate(name)}
        isPending={createMutation.isPending}
      />

      <CatModal
        open={editCat !== null}
        onOpenChange={(open) => {
          if (!open) setEditCat(null);
        }}
        title="Editar nombre"
        description="Actualiza el nombre de este compañero felino."
        initialValue={editCat?.name ?? ""}
        onSubmit={(name) => editCat && updateMutation.mutate({ id: editCat.id, name })}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
