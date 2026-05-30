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

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, email: string, password: string) => void;
  isPending: boolean;
  error?: string | null;
  onSwitchToLogin: () => void;
  catName?: string | undefined;
}

export default function RegisterModal({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  error,
  onSwitchToLogin,
  catName,
}: RegisterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName("");
      setEmail("");
      setPassword("");
    }
    onOpenChange(next);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    onSubmit(name.trim(), email.trim(), password);
  }

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && password.length >= 6;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-sm">
        <DialogHeader>
          <p
            className="text-primary mb-0.5 text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            🐾 La Gatería
          </p>
          <DialogTitle style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
            Create an account
          </DialogTitle>
          <DialogDescription>
            {catName
              ? `Register to submit your adoption request for ${catName}.`
              : "Create a free account to continue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-name">Full name</Label>
            <Input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ana García"
              required
              className="h-11"
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-email">Email address</Label>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ana@email.com"
              required
              className="h-11"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="h-11"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <DialogFooter className="mt-1 flex-col gap-2 sm:flex-col">
            <Button type="submit" disabled={isPending || !canSubmit} className="w-full">
              {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
              {isPending ? "Creating account…" : "Create account & continue"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground w-full text-sm"
              onClick={() => {
                handleOpenChange(false);
                onSwitchToLogin();
              }}
            >
              Already have an account? Sign in
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
