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

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string, password: string) => void;
  isPending: boolean;
  error?: string | null;
}

export default function LoginModal({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  error,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleOpenChange(next: boolean) {
    if (!next) {
      setEmail("");
      setPassword("");
    }
    onOpenChange(next);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    onSubmit(email.trim(), password);
  }

  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-sm">
        <DialogHeader>
          <p
            className="text-primary mb-0.5 text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            🐾 La Gatería · Staff
          </p>
          <DialogTitle style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
            Sign in
          </DialogTitle>
          <DialogDescription>Staff and administrator access only.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email address</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lagateria.com"
              required
              className="h-11"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <DialogFooter className="mt-1 gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !canSubmit}>
              {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
