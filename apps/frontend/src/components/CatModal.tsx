import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface CatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  initialValue?: string;
  onSubmit: (name: string) => void;
  isPending: boolean;
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
  const [name, setName] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setName(initialValue);
  }, [initialValue, open]);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(26, 15, 7, 0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl p-8 outline-none"
          style={{
            backgroundColor: "var(--color-cream)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 32px 80px rgba(26, 15, 7, 0.18), 0 0 0 1px rgba(212, 120, 62, 0.08)",
          }}
        >
          {/* Header */}
          <div className="mb-7 flex items-start justify-between">
            <div>
              <p
                className="mb-1.5 text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: "var(--color-accent)", fontFamily: "var(--font-body)" }}
              >
                🐾 La Gatería
              </p>
              <Dialog.Title
                className="text-2xl leading-tight font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-espresso)" }}
              >
                {title}
              </Dialog.Title>
              <Dialog.Description
                className="mt-1.5 text-sm"
                style={{
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                }}
              >
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-xl p-2 transition-all hover:opacity-60"
              style={{ color: "var(--color-muted)" }}
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="cat-name-input"
                className="text-sm font-semibold"
                style={{ color: "var(--color-cocoa)", fontFamily: "var(--font-body)" }}
              >
                Nombre del gato
              </label>
              <input
                id="cat-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Whiskers, Luna, Mochi…"
                required
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full rounded-xl px-4 py-3 text-base transition-all outline-none"
                style={{
                  backgroundColor: "var(--color-warm)",
                  border: `1.5px solid ${focused ? "var(--color-accent)" : "var(--color-border)"}`,
                  fontFamily: "var(--font-body)",
                  color: "var(--color-espresso)",
                  boxShadow: focused ? "0 0 0 3px rgba(212, 120, 62, 0.12)" : "none",
                }}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Dialog.Close
                className="flex-1 rounded-xl py-3 text-sm font-medium transition-all hover:opacity-70"
                style={{
                  backgroundColor: "transparent",
                  border: "1.5px solid var(--color-border)",
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Cancelar
              </Dialog.Close>
              <button
                type="submit"
                disabled={isPending || !name.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  fontFamily: "var(--font-body)",
                }}
              >
                {isPending && <Loader2 size={15} className="animate-spin" />}
                {isPending ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
