import { Loader2 } from "lucide-react";
import { useState } from "react";

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

interface CatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  initialValue?: string;
  onSubmit: (name: string) => void;
  isPending: boolean;
}

interface CatFormProps {
  initialValue: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  isPending: boolean;
}

function CatForm({ initialValue, onSubmit, onCancel, isPending }: CatFormProps) {
  const [name, setName] = useState(initialValue);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-1">
      <div className="flex flex-col gap-2">
        <Label htmlFor="cat-name-input">Nombre del gato</Label>
        <Input
          id="cat-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Whiskers, Luna, Mochi…"
          required
          className="h-11"
        />
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending || !name.trim()}>
          {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {isPending ? "Guardando…" : "Guardar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function CatModal({
  open,
  onOpenChange,
  title,
  description = "Ingresa el nombre del compañero felino.",
  initialValue = "",
  onSubmit,
  isPending,
}: CatModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-0.5"
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
          key={`${String(open)}-${initialValue}`}
          initialValue={initialValue}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
