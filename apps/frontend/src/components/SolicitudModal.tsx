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

export interface SolicitudFormData {
  catId: number;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje?: string;
}

interface SolicitudModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catName: string;
  catId: number;
  onSubmit: (data: SolicitudFormData) => void;
  isPending: boolean;
}

export default function SolicitudModal({
  open,
  onOpenChange,
  catName,
  catId,
  onSubmit,
  isPending,
}: SolicitudModalProps) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  function reset() {
    setNombre("");
    setEmail("");
    setTelefono("");
    setMensaje("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    onSubmit({
      catId,
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim() || undefined,
      mensaje: mensaje.trim() || undefined,
    });
  }

  const canSubmit = nombre.trim().length > 0 && email.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-0.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            🐾 La Gatería
          </p>
          <DialogTitle style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
            Adoptar a {catName}
          </DialogTitle>
          <DialogDescription>
            Completa tu información y te contactaremos a la brevedad.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sol-nombre">Nombre completo *</Label>
            <Input
              id="sol-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Ana García"
              required
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sol-email">Correo electrónico *</Label>
            <Input
              id="sol-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: ana@email.com"
              required
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sol-telefono">Teléfono</Label>
            <Input
              id="sol-telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: +57 300 000 0000"
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sol-mensaje">Mensaje</Label>
            <textarea
              id="sol-mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="¿Por qué deseas adoptar a este gatito?"
              rows={3}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !canSubmit}>
              {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
              {isPending ? "Enviando…" : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
