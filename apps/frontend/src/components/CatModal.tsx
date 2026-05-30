import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useReducer } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import http from "@/lib/http";

export interface CatFormData {
  name: string;
  breedId?: number | undefined;
  color?: string | undefined;
  gender?: string | undefined;
  ageMonths?: number | undefined;
  weightKg?: number | undefined;
  description?: string | undefined;
  isAvailable?: boolean | undefined;
}

interface Breed {
  id: number;
  name: string;
}

const selectClass =
  "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

interface CatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | undefined;
  initialValues?: Partial<CatFormData> | undefined;
  onSubmit: (data: CatFormData) => void;
  isPending: boolean;
}

type CatFormState = {
  name: string;
  breedId: string;
  color: string;
  gender: string;
  ageMonths: string;
  weightKg: string;
  description: string;
  isAvailable: boolean;
};

function catFormReducer(state: CatFormState, patch: Partial<CatFormState>): CatFormState {
  return {
    name: patch.name !== undefined ? patch.name : state.name,
    breedId: patch.breedId !== undefined ? patch.breedId : state.breedId,
    color: patch.color !== undefined ? patch.color : state.color,
    gender: patch.gender !== undefined ? patch.gender : state.gender,
    ageMonths: patch.ageMonths !== undefined ? patch.ageMonths : state.ageMonths,
    weightKg: patch.weightKg !== undefined ? patch.weightKg : state.weightKg,
    description: patch.description !== undefined ? patch.description : state.description,
    isAvailable: patch.isAvailable !== undefined ? patch.isAvailable : state.isAvailable,
  };
}

function CatForm({
  initialValues,
  onSubmit,
  onCancel,
  isPending,
}: {
  initialValues?: Partial<CatFormData>;
  onSubmit: (data: CatFormData) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useReducer(catFormReducer, {
    name: initialValues?.name ?? "",
    breedId: initialValues?.breedId?.toString() ?? "",
    color: initialValues?.color ?? "",
    gender: initialValues?.gender ?? "unknown",
    ageMonths: initialValues?.ageMonths?.toString() ?? "",
    weightKg: initialValues?.weightKg?.toString() ?? "",
    description: initialValues?.description ?? "",
    isAvailable: initialValues?.isAvailable ?? true,
  });

  const { data: breeds = [] } = useQuery<Breed[]>({
    queryKey: ["breeds"],
    queryFn: () => http.get<Breed[]>("/breed").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const trimmed = form.name.trim();
    if (!trimmed) return;
    onSubmit({
      name: trimmed,
      breedId: form.breedId ? Number(form.breedId) : undefined,
      color: form.color.trim() || undefined,
      gender: form.gender || undefined,
      ageMonths: form.ageMonths ? Number(form.ageMonths) : undefined,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      description: form.description.trim() || undefined,
      isAvailable: form.isAvailable,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-1 flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="cat-name">Name *</Label>
        <Input
          id="cat-name"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          placeholder="e.g. Whiskers, Luna, Mochi…"
          required
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cat-breed">Breed</Label>
          <select
            id="cat-breed"
            value={form.breedId}
            onChange={(e) => setForm({ breedId: e.target.value })}
            className={selectClass}
          >
            <option value="">Not specified</option>
            {breeds.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cat-gender">Gender</Label>
          <select
            id="cat-gender"
            value={form.gender}
            onChange={(e) => setForm({ gender: e.target.value })}
            className={selectClass}
          >
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cat-color">Color / coat</Label>
        <Input
          id="cat-color"
          value={form.color}
          onChange={(e) => setForm({ color: e.target.value })}
          placeholder="e.g. Orange tabby, Black and white…"
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cat-age">Age (months)</Label>
          <Input
            id="cat-age"
            type="number"
            min={0}
            value={form.ageMonths}
            onChange={(e) => setForm({ ageMonths: e.target.value })}
            placeholder="e.g. 18"
            className="h-11"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cat-weight">Weight (kg)</Label>
          <Input
            id="cat-weight"
            type="number"
            min={0}
            step={0.1}
            value={form.weightKg}
            onChange={(e) => setForm({ weightKg: e.target.value })}
            placeholder="e.g. 4.5"
            className="h-11"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cat-description">Description</Label>
        <textarea
          id="cat-description"
          aria-label="Description"
          value={form.description}
          onChange={(e) => setForm({ description: e.target.value })}
          placeholder="Personality, health notes, special needs…"
          rows={3}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="cat-available"
          type="checkbox"
          aria-label="Available for adoption"
          checked={form.isAvailable}
          onChange={(e) => setForm({ isAvailable: e.target.checked })}
          className="border-input accent-primary size-4 rounded"
        />
        <Label htmlFor="cat-available" className="cursor-pointer font-normal">
          Available for adoption
        </Label>
      </div>

      <DialogFooter className="gap-2 pt-1 sm:gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending || !form.name.trim()}>
          {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {isPending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function CatModal({
  open,
  onOpenChange,
  title,
  description = "Fill in the cat's details.",
  initialValues,
  onSubmit,
  isPending,
}: CatModalProps) {
  const formKey = `${String(open)}-${initialValues?.name ?? ""}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <p
            className="text-primary mb-0.5 text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            🐾 La Gatería
          </p>
          <DialogTitle style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <CatForm
          key={formKey}
          initialValues={initialValues ?? {}}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
