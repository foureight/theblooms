"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { InquiryType } from "@/data/site";
import { inquiryTypes } from "@/data/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = {
  defaultType?: InquiryType;
  defaultMessage?: string;
};

type Captcha = {
  token: string;
  question: string;
};

const fieldClass =
  "h-11 rounded-none border-border/80 bg-background px-3 text-sm shadow-none focus-visible:border-bloom focus-visible:ring-0";

const labelClass =
  "text-[10px] font-normal tracking-[0.16em] uppercase text-muted-foreground";

export function InquiryForm({
  defaultType = "svatba",
  defaultMessage = "",
}: Props) {
  const [type, setType] = useState<InquiryType>(defaultType);
  const [message, setMessage] = useState(defaultMessage);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorKind, setErrorKind] = useState<"generic" | "captcha" | null>(
    null,
  );
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(true);

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const res = await fetch("/api/captcha", { cache: "no-store" });
      if (!res.ok) throw new Error("captcha");
      const data = (await res.json()) as Captcha;
      setCaptcha(data);
    } catch {
      setCaptcha(null);
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCaptcha();
  }, [loadCaptcha]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorKind(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          weddingDate: data.get("weddingDate"),
          weddingPlace: data.get("weddingPlace"),
          weddingVision: data.get("weddingVision"),
          website: data.get("website"),
          captchaToken: captcha?.token,
          captchaAnswer: data.get("captchaAnswer"),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          code?: string;
        } | null;
        if (payload?.code === "captcha") {
          setErrorKind("captcha");
          void loadCaptcha();
        } else {
          setErrorKind("generic");
        }
        throw new Error("fail");
      }
      setStatus("success");
      form.reset();
      setType(defaultType);
      setMessage(defaultMessage);
      void loadCaptcha();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-t border-bloom/40 bg-background px-1 py-12 text-center sm:px-2">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
          Poptávka odeslána
        </p>
        <p className="mt-3 font-display text-4xl text-moss-deep sm:text-5xl">
          Děkuji
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Vaše poptávka je u mě. Ozvu se co nejdřív.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-flex items-center border border-moss-deep/40 px-5 py-3 text-[10px] font-medium tracking-[0.18em] uppercase text-moss-deep transition-colors hover:border-bloom-light hover:text-bloom-light"
        >
          Poslat další zprávu
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
          Poptávka
        </p>
        <h2 className="mt-2 font-display text-5xl text-moss-deep sm:text-6xl">
          Napište mi
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Vyberte typ poptávky a pár vět stačí — ozvu se s dalšími detaily.
        </p>
      </div>

      {/* Honeypot — leave empty */}
      <div
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <Label htmlFor="website">Web</Label>
        <Input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className={labelClass}>Čeho se poptávka týká</legend>
        <div className="flex flex-wrap gap-2">
          {inquiryTypes.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={cn(
                  "px-4 py-2.5 text-[10px] tracking-[0.16em] uppercase transition-colors",
                  active
                    ? "bg-moss-deep text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className={labelClass}>
            Jméno
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Vaše jméno"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className={labelClass}>
            E-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vas@email.cz"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className={labelClass}>
          Telefon <span className="normal-case tracking-normal">(volitelně)</span>
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+420 …"
          className={fieldClass}
        />
      </div>

      {type === "svatba" ? (
        <div className="space-y-5 border-l-2 border-moss/35 pl-4 sm:pl-5">
          <p className={labelClass}>Detaily svatby</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weddingDate" className={labelClass}>
                Datum
              </Label>
              <Input
                id="weddingDate"
                name="weddingDate"
                type="date"
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weddingPlace" className={labelClass}>
                Místo
              </Label>
              <Input
                id="weddingPlace"
                name="weddingPlace"
                placeholder="Kde se svatba koná"
                className={fieldClass}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weddingVision" className={labelClass}>
              Základní představa
            </Label>
            <Textarea
              id="weddingVision"
              name="weddingVision"
              rows={3}
              placeholder="Styl, barevnost, obřad, hostina…"
              className="min-h-[5.5rem] rounded-none border-border/80 bg-background px-3 py-3 text-sm shadow-none focus-visible:border-bloom focus-visible:ring-0"
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="message" className={labelClass}>
          Zpráva
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napište mi, co potřebujete…"
          className="min-h-[8rem] rounded-none border-border/80 bg-background px-3 py-3 text-sm shadow-none focus-visible:border-bloom focus-visible:ring-0"
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Label htmlFor="captchaAnswer" className={labelClass}>
            Ověření{" "}
            <span className="normal-case tracking-normal text-muted-foreground">
              {captchaLoading
                ? "(načítám…)"
                : captcha
                  ? `— ${captcha.question}`
                  : "(nedostupné)"}
            </span>
          </Label>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              id="captchaAnswer"
              name="captchaAnswer"
              inputMode="numeric"
              autoComplete="off"
              required
              disabled={captchaLoading || !captcha}
              placeholder="Výsledek"
              className={cn(fieldClass, "max-w-[8rem]")}
            />
            <button
              type="button"
              onClick={() => void loadCaptcha()}
              className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground underline-offset-4 hover:text-moss-deep hover:underline"
            >
              Nový příklad
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading" || captchaLoading || !captcha}
          className="inline-flex items-center justify-center bg-moss-deep px-7 py-3.5 text-[10px] font-medium tracking-[0.18em] uppercase text-white transition-colors hover:bg-bloom-light disabled:opacity-60 sm:text-xs sm:tracking-[0.2em]"
        >
          {status === "loading" ? "Odesílám…" : "Odeslat poptávku"}
        </button>
      </div>

      {status === "error" ? (
        <p className="text-sm text-destructive">
          {errorKind === "captcha"
            ? "Ověření nesedí. Zkuste nový příklad a odešlete znovu."
            : "Odeslání se nepovedlo. Zkuste to prosím znovu, nebo napište přímo na e-mail."}
        </p>
      ) : null}
    </form>
  );
}
