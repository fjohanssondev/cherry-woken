"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Status = "idle" | "sending" | "success" | "error";

const MIN_LENGTH = 3;
const MAX_LENGTH = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FeedbackDialog({ triggerLabel }: { triggerLabel: string }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  // Honeypot: real people never see or fill this; bots usually do.
  const [company, setCompany] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");

  function handleOpenChange(next: boolean) {
    // Reset on open (not on close) so the success view doesn't flash back to
    // the form during Radix's close animation.
    if (next) {
      setStatus("idle");
      setMessage("");
      setEmail("");
      setCompany("");
    }
    setOpen(next);
  }

  const trimmedEmail = email.trim();
  const emailInvalid = trimmedEmail !== "" && !EMAIL_RE.test(trimmedEmail);
  const tooShort = message.trim().length < MIN_LENGTH;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (tooShort || emailInvalid) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: trimmedEmail, // optional
          company, // honeypot
          path: window.location.pathname,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent>
        {status === "success" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                Tack för din feedback!
              </DialogTitle>
              <DialogDescription>
                Meddelandet är skickat. Det hjälper till att göra sidan bättre.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Stäng</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Lämna feedback</DialogTitle>
              <DialogDescription>
                Sett ett fel i menyn eller något som skaver på sidan? Skriv en
                rad, så blir den bättre.
              </DialogDescription>
            </DialogHeader>

            {/* Honeypot — hidden from people and assistive tech, tempting to bots. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
            >
              <label>
                Lämna detta fält tomt
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-1.5">
              <Textarea
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Vad tänker du?"
                rows={5}
                maxLength={MAX_LENGTH}
                required
                autoFocus
                aria-label="Din feedback"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {message.length}/{MAX_LENGTH}
                </span>
              </div>
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="feedback-email" className="text-sm font-medium">
                E-post{" "}
                <span className="font-normal text-muted-foreground">
                  (valfritt)
                </span>
              </label>
              <Input
                id="feedback-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="du@exempel.se"
                aria-invalid={emailInvalid}
                aria-describedby="feedback-email-help"
              />
              <p id="feedback-email-help" className="text-xs text-muted-foreground">
                {emailInvalid
                  ? "Ser inte ut som en giltig e-postadress."
                  : "Fyll i om du vill ha svar. Används bara för att svara dig."}
              </p>
            </div>

            {status === "error" ? (
              <p className="text-sm text-destructive" aria-live="polite">
                Något gick fel. Försök igen om en stund.
              </p>
            ) : null}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Avbryt
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={status === "sending" || tooShort || emailInvalid}
              >
                {status === "sending" ? "Skickar…" : "Skicka"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
