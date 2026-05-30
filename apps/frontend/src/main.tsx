import "./styles.css";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AlertCircle, ClipboardList, Grid2x2, LogIn, LogOut, Plus } from "lucide-react";
import { useReducer } from "react";
import { createRoot } from "react-dom/client";

import ApplicationModal from "@/components/ApplicationModal";
import type { ApplicationFormData } from "@/components/ApplicationModal";
import CatCard from "@/components/CatCard";
import CatModal from "@/components/CatModal";
import LoginModal from "@/components/LoginModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import http from "@/lib/http";

// ── Types ──────────────────────────────────────────────────────────────────

interface Cat {
  id: number;
  name: string;
  breedId?: number | null;
  color?: string | null;
  gender: string;
  ageMonths?: number | null;
  weightKg?: number | null;
  description?: string | null;
  isAvailable: boolean;
  createdAt: string;
}

interface Application {
  id: number;
  catId: number;
  applicantName: string;
  applicantEmail: string;
  phone?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
}

interface AuthUser {
  sub: number;
  name: string;
  email: string;
  role: string;
}

type View = "cats" | "applications";

// ── Queries ────────────────────────────────────────────────────────────────

const fetchCats = async (): Promise<Cat[]> => {
  const { data } = await http.get<Cat[]>("/cat");
  return Array.isArray(data) ? data : [];
};

const fetchApplications = async (): Promise<Application[]> => {
  const { data } = await http.get<Application[]>("/application");
  return Array.isArray(data) ? data : [];
};

const fetchMe = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await http.get<AuthUser>("/auth/me");
    return data;
  } catch {
    return null;
  }
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// ── App state ──────────────────────────────────────────────────────────────

type AppState = {
  view: View;
  isAddOpen: boolean;
  isLoginOpen: boolean;
  editCat: Cat | null;
  adoptingCat: Cat | null;
  appliedCatIds: Set<number>;
};

type AppAction =
  | { type: "SET_VIEW"; view: View }
  | { type: "SET_ADD_OPEN"; open: boolean }
  | { type: "SET_LOGIN_OPEN"; open: boolean }
  | { type: "SET_EDIT_CAT"; cat: Cat | null }
  | { type: "SET_ADOPTING_CAT"; cat: Cat | null }
  | { type: "MARK_APPLIED"; catId: number };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "SET_ADD_OPEN":
      return { ...state, isAddOpen: action.open };
    case "SET_LOGIN_OPEN":
      return { ...state, isLoginOpen: action.open };
    case "SET_EDIT_CAT":
      return { ...state, editCat: action.cat };
    case "SET_ADOPTING_CAT":
      return { ...state, adoptingCat: action.cat };
    case "MARK_APPLIED":
      return { ...state, appliedCatIds: new Set(state.appliedCatIds).add(action.catId) };
    default:
      return state;
  }
}

const initialState: AppState = {
  view: "cats",
  isAddOpen: false,
  isLoginOpen: false,
  editCat: null,
  adoptingCat: null,
  appliedCatIds: new Set(),
};

// ── Shared lookup ──────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

// ── View components ────────────────────────────────────────────────────────

interface CatsViewProps {
  cats: Cat[];
  isLoading: boolean;
  isError: boolean;
  appliedCatIds: Set<number>;
  isAdmin: boolean;
  onAddOpen: () => void;
  onEditCat: (cat: Cat) => void;
  onAdoptCat: (cat: Cat) => void;
}

function CatsView({
  cats,
  isLoading,
  isError,
  appliedCatIds,
  isAdmin,
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
            Could not connect to the API
          </p>
          <p className="text-muted-foreground text-sm">
            Make sure the server is running on port 3000.
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
            The shelter is empty!
          </p>
          <p className="text-muted-foreground mb-1 text-sm">
            Register the first cat available for adoption.
          </p>
          {isAdmin && (
            <Button size="sm" className="rounded-full" onClick={onAddOpen}>
              <Plus data-icon="inline-start" />
              Register Cat
            </Button>
          )}
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
              hasRequest={appliedCatIds.has(cat.id)}
              showEdit={isAdmin}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface ApplicationsViewProps {
  applications: Application[];
  isLoading: boolean;
  isError: boolean;
  catMap: Map<number, Cat>;
  onViewCats: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  isUpdating: boolean;
}

function ApplicationsView({
  applications,
  isLoading,
  isError,
  catMap,
  onViewCats,
  onUpdateStatus,
  isUpdating,
}: ApplicationsViewProps) {
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
            Could not load applications
          </p>
        </div>
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <div className="border-border bg-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-24">
          <span className="text-5xl">📋</span>
          <p
            className="text-foreground text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No applications yet
          </p>
          <p className="text-muted-foreground text-sm">
            When someone wants to adopt a cat, it will appear here.
          </p>
          <Button size="sm" variant="outline" className="rounded-full" onClick={onViewCats}>
            View available cats
          </Button>
        </div>
      )}

      {!isLoading && !isError && applications.length > 0 && (
        <div className="flex flex-col gap-3">
          {applications.map((app) => {
            const cat = catMap.get(app.catId);
            const colorClass = statusColor[app.status] ?? "bg-gray-100 text-gray-600";
            const fecha = new Date(app.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={app.id}
                className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-start sm:gap-5"
              >
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-3xl leading-none">🐱</span>
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wider uppercase">Cat</p>
                    <p
                      className="text-foreground font-bold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {cat?.name ?? `#${app.catId}`}
                    </p>
                  </div>
                </div>

                <div className="bg-border hidden w-px self-stretch sm:block" />

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-foreground font-semibold">{app.applicantName}</p>
                    <Badge
                      className={`border-0 text-[10px] tracking-wider uppercase ${colorClass}`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{app.applicantEmail}</p>
                  {app.phone && <p className="text-muted-foreground text-sm">{app.phone}</p>}
                  {app.message && (
                    <p className="text-foreground/70 mt-1 text-sm italic">
                      &ldquo;{app.message}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p className="text-muted-foreground text-xs">{fecha}</p>
                  {app.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full border-green-300 text-green-700 hover:bg-green-50 text-xs px-3"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(app.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full border-red-300 text-red-700 hover:bg-red-50 text-xs px-3"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(app.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
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
  const { view, isAddOpen, isLoginOpen, editCat, adoptingCat, appliedCatIds } = state;
  const qc = useQueryClient();

  // ── Auth ──
  const { data: authUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = authUser?.role === "admin";
  const isAuthenticated = authUser != null;

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      http.post("/auth/login", { email, password }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      dispatch({ type: "SET_LOGIN_OPEN", open: false });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => http.post("/auth/logout").then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      if (view === "applications") dispatch({ type: "SET_VIEW", view: "cats" });
    },
  });

  // ── Data ──
  const {
    data: cats = [],
    isLoading: catsLoading,
    isError: catsError,
  } = useQuery({ queryKey: ["cats"], queryFn: fetchCats });

  const {
    data: applications = [],
    isLoading: appLoading,
    isError: appError,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
    enabled: isAdmin,
  });

  // ── Cat mutations ──
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

  const applicationMutation = useMutation({
    mutationFn: (data: ApplicationFormData) =>
      http.post<Application>("/application", data).then((r) => r.data),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({ queryKey: ["applications"] });
      dispatch({ type: "MARK_APPLIED", catId: variables.catId });
      dispatch({ type: "SET_ADOPTING_CAT", cat: null });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      http.patch<Application>(`/application/${id}/status`, { status }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["applications"] });
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
                Feline Adoption Center · Est. 2025
              </span>
            </div>

            {/* Auth controls */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="text-white/50 text-xs hidden sm:block">
                    {authUser.name}
                    {isAdmin && (
                      <span className="ml-1.5 rounded-full bg-primary/30 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-primary">
                        admin
                      </span>
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:bg-white/8 hover:text-white"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
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
                  onClick={() => dispatch({ type: "SET_LOGIN_OPEN", open: true })}
                >
                  <LogIn data-icon="inline-start" size={14} />
                  Staff
                </Button>
              )}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:bg-white/8 hover:text-white"
                  onClick={() => dispatch({ type: "SET_ADD_OPEN", open: true })}
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
                  onClick={() =>
                    cats.length > 0
                      ? dispatch({ type: "SET_VIEW", view: "cats" })
                      : isAdmin && dispatch({ type: "SET_ADD_OPEN", open: true })
                  }
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
                  {catsLoading ? "·" : catsError ? "—" : cats.length}
                </div>
                <div className="text-[10px] tracking-widest text-white/40 uppercase">
                  {!catsLoading && !catsError && cats.length === 1
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
            Available cats
            {!catsLoading && !catsError && (
              <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold">
                {cats.length}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => dispatch({ type: "SET_VIEW", view: "applications" })}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                view === "applications"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ClipboardList size={15} />
              Applications
              {!appLoading && !appError && applications.length > 0 && (
                <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold">
                  {applications.length}
                </span>
              )}
            </button>
          )}
        </div>

        {view === "cats" && (
          <CatsView
            cats={cats}
            isLoading={catsLoading}
            isError={catsError}
            appliedCatIds={appliedCatIds}
            isAdmin={isAdmin}
            onAddOpen={() => dispatch({ type: "SET_ADD_OPEN", open: true })}
            onEditCat={(cat) => dispatch({ type: "SET_EDIT_CAT", cat })}
            onAdoptCat={(cat) => dispatch({ type: "SET_ADOPTING_CAT", cat })}
          />
        )}

        {view === "applications" && isAdmin && (
          <ApplicationsView
            applications={applications}
            isLoading={appLoading}
            isError={appError}
            catMap={catMap}
            onViewCats={() => dispatch({ type: "SET_VIEW", view: "cats" })}
            onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
            isUpdating={updateStatusMutation.isPending}
          />
        )}
      </main>

      {/* ── Modals ── */}
      <CatModal
        open={isAddOpen}
        onOpenChange={(open) => dispatch({ type: "SET_ADD_OPEN", open })}
        title="Register new cat"
        description="Enter the name of the cat you want to register in the shelter."
        onSubmit={(name) => createMutation.mutate(name)}
        isPending={createMutation.isPending}
      />

      <CatModal
        open={editCat !== null}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: "SET_EDIT_CAT", cat: null });
        }}
        title="Edit cat"
        description="Update this cat's name."
        initialValue={editCat?.name ?? ""}
        onSubmit={(name) => editCat && updateMutation.mutate({ id: editCat.id, name })}
        isPending={updateMutation.isPending}
      />

      <ApplicationModal
        open={adoptingCat !== null}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: "SET_ADOPTING_CAT", cat: null });
        }}
        catName={adoptingCat?.name ?? ""}
        catId={adoptingCat?.id ?? 0}
        onSubmit={(data) => applicationMutation.mutate(data)}
        isPending={applicationMutation.isPending}
      />

      <LoginModal
        open={isLoginOpen}
        onOpenChange={(open) => dispatch({ type: "SET_LOGIN_OPEN", open })}
        onSubmit={(email, password) => loginMutation.mutate({ email, password })}
        isPending={loginMutation.isPending}
        error={loginMutation.isError ? "Incorrect email or password" : null}
      />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
