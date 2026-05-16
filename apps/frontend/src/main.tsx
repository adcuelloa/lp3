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

  const {
    data: cats = [],
    isLoading,
    isError,
  } = useQuery({
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
      <header
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-espresso)" }}
      >
        {/* Decorative background pattern */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden select-none"
          aria-hidden="true"
        >
          <div
            className="absolute -top-8 -right-8 text-[18rem] leading-none opacity-[0.04]"
            style={{ fontFamily: "var(--font-display)", color: "white", fontStyle: "italic" }}
          >
            🐾
          </div>
          <div
            className="absolute bottom-0 left-0 h-px w-full opacity-10"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-accent), transparent)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
          <p
            className="animate-fade-up mb-5 text-xs font-semibold tracking-[0.35em] uppercase"
            style={{
              animationDelay: "0ms",
              color: "var(--color-accent-light)",
              fontFamily: "var(--font-body)",
            }}
          >
            Centro de Adopción Felina
          </p>

          <h1
            className="animate-fade-up mb-5 text-7xl leading-none font-bold text-white md:text-8xl"
            style={{
              animationDelay: "90ms",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              textShadow: "0 4px 32px rgba(212, 120, 62, 0.2)",
            }}
          >
            La Gatería
          </h1>

          <p
            className="animate-fade-up mx-auto mb-10 max-w-md text-lg leading-relaxed md:text-xl"
            style={{
              animationDelay: "180ms",
              color: "#C4A99A",
              fontFamily: "var(--font-body)",
              fontWeight: 300,
            }}
          >
            Cada uno de nuestros felinos espera un hogar lleno de amor y mimos infinitos.
          </p>

          <button
            className="animate-fade-up inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-all hover:scale-105 hover:opacity-90 active:scale-95"
            style={{
              animationDelay: "270ms",
              backgroundColor: "var(--color-accent)",
              color: "white",
              fontFamily: "var(--font-body)",
              boxShadow: "0 8px 24px rgba(212, 120, 62, 0.35)",
            }}
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={18} />
            Registrar un Gato
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Section header */}
        <div className="mb-10 flex items-baseline justify-between">
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-espresso)" }}
          >
            Disponibles para adoptar
          </h2>
          {!isLoading && !isError && (
            <span
              className="text-sm"
              style={{
                color: "var(--color-muted)",
                fontFamily: "var(--font-body)",
                fontWeight: 300,
              }}
            >
              {cats.length} {cats.length === 1 ? "gatito" : "gatitos"}
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <span className="animate-float text-5xl">🐱</span>
            <p
              className="text-sm"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
            >
              Cargando gatitos…
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-2xl py-20"
            style={{
              backgroundColor: "var(--color-cream)",
              border: "1px solid var(--color-border)",
            }}
          >
            <AlertCircle size={32} style={{ color: "var(--color-muted)" }} />
            <p
              className="text-base font-medium"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-espresso)" }}
            >
              No se pudo conectar con la API
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
            >
              Asegúrate de que el servidor esté corriendo en el puerto 3000.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && cats.length === 0 && (
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-2xl py-24"
            style={{
              backgroundColor: "var(--color-cream)",
              border: "1px dashed var(--color-border)",
            }}
          >
            <span className="animate-float text-5xl">🏠</span>
            <p
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-espresso)" }}
            >
              ¡El refugio está vacío!
            </p>
            <p
              className="mb-2 text-sm"
              style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
            >
              Registra el primer gato disponible para adopción.
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "white",
                fontFamily: "var(--font-body)",
              }}
            >
              <Plus size={15} />
              Registrar Gato
            </button>
          </div>
        )}

        {/* Cat Grid */}
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
  </QueryClientProvider>
);
