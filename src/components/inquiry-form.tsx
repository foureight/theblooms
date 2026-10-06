"use client";

import { useState, type FormEvent } from "react";
import type { InquiryType } from "@/data/site";
import { inquiryTypes } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  defaultType?: InquiryType;
};

export function InquiryForm({ defaultType = "svatba" }: Props) {
  const [type, setType] = useState<InquiryType>(defaultType);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
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
        }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
      form.reset();
      setType(defaultType);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-moss/25 bg-card px-6 py-10 text-center">
        <p className="font-display text-4xl text-moss-deep">Děkuji</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Vaše poptávka je u mě. Ozvu se co nejdřív.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => setStatus("idle")}
        >
          Poslat další zprávu
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="type">Čeho se poptávka týká</Label>
        <Select
          value={type}
          onValueChange={(v) => {
            if (v) setType(v as InquiryType);
          }}
        >
          <SelectTrigger id="type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {inquiryTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Jméno</Label>
          <Input id="name" name="name" required placeholder="Vaše jméno" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vas@email.cz"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+420 …" />
      </div>

      {type === "svatba" && (
        <div className="space-y-5 border border-border/70 bg-muted/40 p-4">
          <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
            Detaily svatby
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weddingDate">Datum</Label>
              <Input id="weddingDate" name="weddingDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weddingPlace">Místo</Label>
              <Input
                id="weddingPlace"
                name="weddingPlace"
                placeholder="Kde se svatba koná"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weddingVision">Základní představa</Label>
            <Textarea
              id="weddingVision"
              name="weddingVision"
              rows={3}
              placeholder="Styl, barevnost, obřad, hostina…"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Zpráva</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Napište mi, co potřebujete…"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">
          Odeslání se nepovedlo. Zkuste to prosím znovu, nebo napište přímo na
          e-mail.
        </p>
      )}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Odesílám…" : "Odeslat poptávku"}
      </Button>
    </form>
  );
}
