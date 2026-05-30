import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

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

export interface ApplicationFormData {
  catId: number;
  applicantName: string;
  applicantEmail: string;
  phone?: string;
  message?: string;
}

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catName: string;
  catId: number;
  onSubmit: (data: ApplicationFormData) => void;
  isPending: boolean;
  prefillName?: string;
  prefillEmail?: string;
}

export default function ApplicationModal({
  open,
  onOpenChange,
  catName,
  catId,
  onSubmit,
  isPending,
  prefillName = "",
  prefillEmail = "",
}: ApplicationModalProps) {
  const initNameRef = useRef(prefillName);
  const initEmailRef = useRef(prefillEmail);
  const [applicantName, setApplicantName] = useState(initNameRef.current);
  const [applicantEmail, setApplicantEmail] = useState(initEmailRef.current);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function reset() {
    setApplicantName("");
    setApplicantEmail("");
    setPhone("");
    setMessage("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    onSubmit({
      catId,
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
      ...(message.trim() ? { message: message.trim() } : {}),
    });
  }

  const canSubmit = applicantName.trim().length > 0 && applicantEmail.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <p
            className="text-primary mb-0.5 text-xs font-semibold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            🐾 La Gatería
          </p>
          <DialogTitle style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>
            Adopt {catName}
          </DialogTitle>
          <DialogDescription>
            Fill in your details and we will contact you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="app-name">Full name *</Label>
            <Input
              id="app-name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="e.g. Ana García"
              required
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="app-email">Email address *</Label>
            <Input
              id="app-email"
              type="email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              placeholder="e.g. ana@email.com"
              required
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="app-phone">Phone number</Label>
            <Input
              id="app-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +57 300 000 0000"
              className="h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="app-message">Message</Label>
            <textarea
              id="app-message"
              aria-label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why would you like to adopt this cat?"
              rows={3}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !canSubmit}>
              {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
              {isPending ? "Sending…" : "Submit application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
