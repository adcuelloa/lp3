import "./styles.css";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ClipboardList, Grid2x2 } from "lucide-react";
import { useReducer } from "react";
import { createRoot } from "react-dom/client";

import ApplicationModal from "@/components/ApplicationModal";
import type { ApplicationFormData } from "@/components/ApplicationModal";
import ApplicationsView from "@/components/ApplicationsView";
import CatModal from "@/components/CatModal";
import type { CatFormData } from "@/components/CatModal";
import CatsView from "@/components/CatsView";
import Footer from "@/components/Footer";
import HeroHeader from "@/components/HeroHeader";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import { fetchApplications, fetchCats, fetchMe } from "@/lib/api";
import { appReducer, initialState } from "@/lib/app-reducer";
import http from "@/lib/http";
import type { Application, Cat } from "@/types";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { view, isAddOpen, isLoginOpen, isRegisterOpen, editCat, adoptingCat, appliedCatIds } =
    state;
  const qc = useQueryClient();

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

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      http.post("/auth/register", { name, email, password }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      dispatch({ type: "SET_REGISTER_OPEN", open: false });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => http.post("/auth/logout").then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["auth", "me"] });
      if (view === "applications") dispatch({ type: "SET_VIEW", view: "cats" });
    },
  });

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

  const createMutation = useMutation({
    mutationFn: (data: CatFormData) => http.post<Cat>("/cat", data).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["cats"] });
      dispatch({ type: "SET_ADD_OPEN", open: false });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CatFormData }) =>
      http.patch<Cat>(`/cat/${id}`, data).then((r) => r.data),
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

  function handleAdoptClick(cat: Cat) {
    dispatch({ type: "SET_ADOPTING_CAT", cat });
    if (!isAuthenticated) {
      dispatch({ type: "SET_REGISTER_OPEN", open: true });
    }
  }

  const catMap = new Map(cats.map((c) => [c.id, c]));
  const availableCatsCount = cats.filter((c) => c.isAvailable).length;

  return (
    <div className="min-h-full">
      <HeroHeader
        auth={{ user: authUser, isAdmin, logoutPending: logoutMutation.isPending }}
        cats={{ count: availableCatsCount, isLoading: catsLoading, isError: catsError }}
        onLogout={() => logoutMutation.mutate()}
        onLoginOpen={() => dispatch({ type: "SET_LOGIN_OPEN", open: true })}
        onAddOpen={() => dispatch({ type: "SET_ADD_OPEN", open: true })}
        onMeetCats={() => {
          dispatch({ type: "SET_VIEW", view: "cats" });
          document.getElementById("shelter-section")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main id="shelter-section" className="mx-auto max-w-5xl px-6 py-12">
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
            onAdoptCat={handleAdoptClick}
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

      <Footer />

      <CatModal
        open={isAddOpen}
        onOpenChange={(open) => dispatch({ type: "SET_ADD_OPEN", open })}
        title="Register new cat"
        description="Fill in the cat's details to add it to the shelter."
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
      />

      <CatModal
        open={editCat !== null}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: "SET_EDIT_CAT", cat: null });
        }}
        title="Edit cat"
        description="Update this cat's information."
        initialValues={
          editCat
            ? {
                name: editCat.name,
                breedId: editCat.breedId ?? undefined,
                color: editCat.color ?? undefined,
                gender: editCat.gender,
                ageMonths: editCat.ageMonths ?? undefined,
                weightKg: editCat.weightKg ?? undefined,
                description: editCat.description ?? undefined,
                isAvailable: editCat.isAvailable,
              }
            : undefined
        }
        onSubmit={(data) => editCat && updateMutation.mutate({ id: editCat.id, data })}
        isPending={updateMutation.isPending}
      />

      <RegisterModal
        open={isRegisterOpen}
        onOpenChange={(open) => {
          dispatch({ type: "SET_REGISTER_OPEN", open });
          if (!open) dispatch({ type: "SET_ADOPTING_CAT", cat: null });
        }}
        catName={adoptingCat?.name}
        onSubmit={(name, email, password) => registerMutation.mutate({ name, email, password })}
        isPending={registerMutation.isPending}
        error={
          registerMutation.isError
            ? "Could not create account. Email may already be registered."
            : null
        }
        onSwitchToLogin={() => dispatch({ type: "SET_LOGIN_OPEN", open: true })}
      />

      <ApplicationModal
        key={`${adoptingCat?.id ?? 0}-${authUser?.sub ?? 0}`}
        open={adoptingCat !== null && isAuthenticated}
        onOpenChange={(open) => {
          if (!open) dispatch({ type: "SET_ADOPTING_CAT", cat: null });
        }}
        catName={adoptingCat?.name ?? ""}
        catId={adoptingCat?.id ?? 0}
        onSubmit={(data) => applicationMutation.mutate(data)}
        isPending={applicationMutation.isPending}
        prefillName={authUser?.name ?? ""}
        prefillEmail={authUser?.email ?? ""}
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
