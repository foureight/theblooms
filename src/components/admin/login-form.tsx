"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CtaLink } from "@/components/cta-link";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Přihlášení selhalo.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Síťová chyba.");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="font-display text-4xl text-moss-deep">Admin</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Nastavte proměnnou prostředí{" "}
          <code className="text-foreground">ADMIN_PASSWORD</code> a restartujte
          server. Pak se sem Alena přihlásí a bude měnit texty i fotky.
        </p>
        <CtaLink href="/" variant="outline" className="mt-8">
          Zpět na web
        </CtaLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-display text-4xl text-moss-deep">Admin</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Přihlášení pro úpravu textů a fotek na webu.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="password"
            className="text-xs tracking-[0.16em] uppercase text-muted-foreground"
          >
            Heslo
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-bloom"
            required
          />
        </div>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center bg-moss-deep px-7 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-white transition-colors hover:bg-bloom-light disabled:opacity-60"
        >
          {loading ? "Přihlašuji…" : "Přihlásit"}
        </button>
      </form>
    </div>
  );
}
