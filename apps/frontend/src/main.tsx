import "./styles.css";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AlertCircle, ClipboardList, Grid2x2, Plus } from "lucide-react";
import { useReducer } from "react";
import { createRoot } from "react-dom/client";

import CatCard from "@/components/CatCard";
import CatModal from "@/components/CatModal";
import SolicitudModal from "@/components/SolicitudModal";
import type { SolicitudFormData } from "@/components/SolicitudModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/lib/http";

interface Cat {
  id: number;
  name: string;
}

interface Solicitud {
  id: number;
  catId: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje?: string | null;
  estado: string;
  creadoEn: string;
}

type View = "cats" | "solicitudes";

const fetchCats = async (): Promise<Cat[]> => {
  const { data } = await http.get<Cat[]>("/cat");
  return Array.isArray(data) ? data : [];
};

const fetchSolicitudes = async (): Promise<Solicitud[]> => {
  const { data } = await http.get<Solicitud[]>("/solicitud");
  return Array.isArray(data) ? data : [];
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// ── App state ──────────────────────────────────────────────────────────────

type AppState = {
  view: View;
  isAddOpen: boolean;
  editCat: Cat | null;
  adoptingCat: Cat | null;
  adoptedCatIds: Set<number>;
};

type AppAction =
  | { type: "SET_VIEW"; view: View }
  | { type: "SET_ADD_OPEN"; open: boolean }
  | { type: "SET_EDIT_CAT"; cat: Cat | null }
  | { type: "SET_ADOPTING_CAT"; cat: Cat | null }
  | { type: "MARK_ADOPTED"; catId: number };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "SET_ADD_OPEN":
      return { ...state, isAddOpen: action.open };
    case "SET_EDIT_CAT":
      return { ...state, editCat: action.cat };
    case "SET_ADOPTING_CAT":
      return { ...state, adoptingCat: action.cat };
    case "MARK_ADOPTED":
      return { ...state, adoptedCatIds: new Set(state.adoptedCatIds).add(action.catId) };
    default:
      return state;
  }
}

const initialState: AppState = {
  view: "cats",
  isAddOpen: false,
  editCat: null,
  adoptingCat: null,
  adoptedCatIds: new Set(),
};

// ── Shared lookup ──────────────────────────────────────────────────────────

const estadoColor: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobada: "bg-green-100 text-green-700",
  rechazada: "bg-red-100 text-red-700",
};

// ── View components ────────────────────────────────────────────────────────

interface CatsViewProps {
  cats: Cat[];
  isLoading: boolean;
  isError: boolean;
  adoptedCatIds: Set<number>;
  onAddOpen: () => void;
  onEditCat: (cat: Cat) => void;
  onAdoptCat: (cat: Cat) => void;
}

function CatsView({
  cats,
  isLoading,
  isError,
  adoptedCatIds,
  onAddOpen,
  onEditCat,
  onAdoptCat,
}: CatsViewProps) {
  return (
    <>
      {isLoading && (
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
        >
          {["a", "b", "c", "d", "e", "f"].map((id) => (
            <Skeleton key={id} className="h-56 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-3 rounded-2xl border py-20">
          <AlertCircle size={28} className="text-muted-foreground" />
          <p
            className="text-foreground text-base font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No se pudo conectar con la API
          </p>
          <p className="text-muted-foreground text-sm">
            Asegúrate de que el servidor esté corriendo en el puerto 3000.
          </p>
        </div>
      )}

      {!isLoading && !isError && cats.length === 0 && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-24">
          <span className="animate-float text-5xl">🏠</span>
          <p
            className="text-foreground text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ¡El refugio está vacío!
          </p>
          <p className="text-muted-foreground mb-1 text-sm">
            Registra el primer gato disponible para adopción.
          </p>
          <Button size="sm" className="rounded-full" onClick={onAddOpen}>
            <Plus data-icon="inline-start" />
            Registrar Gato
          </Button>
        </div>
      )}

      {!isLoading && !isError && cats.length > 0 && (
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
        >
          {cats.map((cat, index) => (
            <CatCard
              key={cat.id}
              cat={cat}
              index={index}
              onEdit={() => onEditCat(cat)}
              onAdopt={() => onAdoptCat(cat)}
              hasRequest={adoptedCatIds.has(cat.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface SolicitudesViewProps {
  solicitudes: Solicitud[];
  isLoading: boolean;
  isError: boolean;
  catMap: Map<number, Cat>;
  onViewCats: () => void;
}

function SolicitudesView({
  solicitudes,
  isLoading,
  isError,
  catMap,
  onViewCats,
}: SolicitudesViewProps) {
  return (
    <>
      {isLoading && (
        <div className="flex flex-col gap-3">
          {["a", "b", "c", "d"].map((id) => (
            <Skeleton key={id} className="h-24 rounded-2xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-3 rounded-2xl border py-20">
          <AlertCircle size={28} className="text-muted-foreground" />
          <p
            className="text-foreground text-base font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No se pudieron cargar las solicitudes
          </p>
        </div>
      )}

      {!isLoading && !isError && solicitudes.length === 0 && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-24">
          <span className="text-5xl">📋</span>
          <p
            className="text-foreground text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sin solicitudes aún
          </p>
          <p className="text-muted-foreground text-sm">
            Cuando alguien quiera adoptar un gatito, aparecerá aquí.
          </p>
          <Button size="sm" variant="outline" className="rounded-full" onClick={onViewCats}>
            Ver gatitos disponibles
          </Button>
        </div>
      )}

      {!isLoading && !isError && solicitudes.length > 0 && (
        <div className="flex flex-col gap-3">
          {solicitudes.map((sol) => {
            const cat = catMap.get(sol.catId);
            const colorClass = estadoColor[sol.estado] ?? "bg-gray-100 text-gray-600";
            const fecha = new Date(sol.creadoEn).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={sol.id}
                className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-start sm:gap-5"
              >
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-3xl leading-none">🐱</span>
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wider uppercase">Gato</p>
                    <p
                      className="text-foreground font-bold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {cat?.name ?? `#${sol.catId}`}
                    </p>
                  </div>
                </div>

                <div className="bg-border hidden w-px self-stretch sm:block" />

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-foreground font-semibold">{sol.nombre}</p>
                    <Badge
                      className={`border-0 text-[10px] tracking-wider uppercase ${colorClass}`}
                    >
                      {sol.estado}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{sol.email}</p>
                  {sol.telefono && <p className="text-muted-foreground text-sm">{sol.telefono}</p>}
                  {sol.mensaje && (
                    <p className="text-foreground/70 mt-1 text-sm italic">
                      &ldquo;{sol.mensaje}&rdquo;
                    </p>
                  )}
                </div>

                <p className="text-muted-foreground shrink-0 text-xs">{fecha}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { view, isAddOpen, editCat, adoptingCat, adoptedCatIds } = state;
  const qc = useQueryClient();

  const {
    data: cats = [],
    isLoading: catsLoading,
    isError: catsError,
  } = useQuery({
    queryKey: ["cats"],
    queryFn: fetchCats,
  });

  const {
    data: solicitudes = [],
    isLoading: solLoading,
    isError: solError,
  } = useQuery({
    queryKey: ["solicitudes"],
    queryFn: fetchSolicitudes,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => http.post<Cat>("/cat", { name }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cats"] });
      dispatch({ type: "SET_ADD_OPEN", open: false });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      http.patch<Cat>(`/cat/${id}`, { name }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cats"] });
      dispatch({ type: "SET_EDIT_CAT", cat: null });
    },
  });

  const solicitudMutation = useMutation({
    mutationFn: (data: SolicitudFormData) =>
      http.post<Solicitud>("/solicitud", data).then((r) => r.data),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: ["solicitudes"] });
      dispatch({ type: "MARK_ADOPTED", catId: variables.catId });
      dispatch({ type: "SET_ADOPTING_CAT", cat: null });
    },
  });

  const catMap = new Map(cats.map((c) => [c.id, c]));

  return (
    <div className="min-h-full">
      {/* ── Hero ── */}
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

        <div
          className="pointer-events-none absolute -right-12 bottom-8 text-[28rem] leading-none font-bold text-white/2.5 italic select-none"
          aria-hidden="true"
          style={{ fontFamily: "var(--font-display)" }}
        >
          G
        </div>

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
                Centro de Adopción Felina · Est. 2025
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:bg-white/8 hover:text-white"
              onClick={() => dispatch({ type: "SET_ADD_OPEN", open: true })}
            >
              <Plus data-icon="inline-start" />
              Registrar
            </Button>
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
                Cada felino que llega aquí merece un hogar lleno de amor, mimos y compañía.
              </p>

              <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
                <Button
                  size="lg"
                  className="rounded-full px-8 shadow-[0_8px_32px_rgba(212,120,62,0.4)] transition-transform hover:scale-105 active:scale-95"
                  onClick={() => dispatch({ type: "SET_ADD_OPEN", open: true })}
                >
                  <Plus data-icon="inline-start" />
                  Registrar un Gato
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
                  {catsLoading ? "·" : catsError ? "—" : cats.length}
                </div>
                <div className="text-[10px] tracking-widest text-white/40 uppercase">
                  {!catsLoading && !catsError && cats.length === 1
                    ? "Gatito disponible"
                    : "Gatitos disponibles"}
                </div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4 text-center">
                <p className="text-[10px] tracking-wider text-white/25 uppercase">
                  Listos para un nuevo hogar
                </p>
              </div>
            </div>
          </div>
        </div>

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
        <div className="border-border bg-muted/40 mb-8 flex w-fit items-center gap-1 rounded-xl border p-1">
          <button
            onClick={() => dispatch({ type: "SET_VIEW", view: "cats" })}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              view === "cats"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid2x2 size={15} />
            Gatitos disponibles
            {!catsLoading && !catsError && (
              <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold">
                {cats.length}
              </span>
            )}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_VIEW", view: "solicitudes" })}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              view === "solicitudes"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList size={15} />
            Solicitudes
            {!solLoading && !solError && solicitudes.length > 0 && (
              <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold">
                {solicitudes.length}
              </span>
            )}
          </button>
        </div>

        {view === "cats" && (
          <CatsView
            cats={cats}
            isLoading={catsLoading}
            isError={catsError}
            adoptedCatIds={adoptedCatIds}
            onAddOpen={() => dispatch({ type: "SET_ADD_OPEN", open: true })}
            onEditCat={(cat) => dispatch({ type: "SET_EDIT_CAT", cat })}
            onAdoptCat={(cat) => dispatch({ type: "SET_ADOPTING_CAT", cat })}
          />
        )}

        {view === "solicitudes" && (
          <SolicitudesView
            solicitudes={solicitudes}
            isLoading={solLoading}
            isError={solError}
            catMap={catMap}
            onViewCats={() => dispatch({ type: "SET_VIEW", view: "cats" })}
          />
        )}
      </main>

      {/* ── Modals ── */}
      <CatModal
        open={isAddOpen}
        onOpenChange={(open) => dispatch({ type: "SET_ADD_OPEN", open })}
        title="Registrar nuevo gato"
        description="Ingresa el nombre del gato que deseas registrar en el refugio."
        onSubmit={(name) => createMutation.mutate(name)}
        isPending={createMutation.isPending}
      />

      <CatModal
        open={editCat !== null}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: "SET_EDIT_CAT", cat: null });
        }}
        title="Editar nombre"
        description="Actualiza el nombre de este compañero felino."
        initialValue={editCat?.name ?? ""}
        onSubmit={(name) => editCat && updateMutation.mutate({ id: editCat.id, name })}
        isPending={updateMutation.isPending}
      />

      <SolicitudModal
        open={adoptingCat !== null}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: "SET_ADOPTING_CAT", cat: null });
        }}
        catName={adoptingCat?.name ?? ""}
        catId={adoptingCat?.id ?? 0}
        onSubmit={(data) => solicitudMutation.mutate(data)}
        isPending={solicitudMutation.isPending}
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
