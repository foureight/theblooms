"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CtaLink } from "@/components/cta-link";
import { Button } from "@/components/ui/button";

function MockPayInner() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId") || "";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function complete(action: "pay" | "cancel") {
    if (!orderId) {
      setError("Chybí číslo objednávky.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Operace selhala.");
        return;
      }
      router.replace(
        action === "pay"
          ? `/pokladna/uspech?orderId=${orderId}`
          : `/pokladna/zruseno?orderId=${orderId}`,
      );
    } catch {
      setError("Síťová chyba.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
        Demo platba kartou
      </p>
      <h1 className="mt-3 font-display text-4xl text-moss-deep sm:text-5xl">
        Testovací brána
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Stripe klíče nejsou nastavené — tady simulujeme platbu kartou.
        {orderId ? (
          <>
            {" "}
            Objednávka <span className="font-medium text-foreground">#{orderId}</span>.
          </>
        ) : null}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button disabled={busy} onClick={() => void complete("pay")}>
          {busy ? "Zpracovávám…" : "Zaplatit (demo)"}
        </Button>
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => void complete("cancel")}
        >
          Zrušit platbu
        </Button>
      </div>
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      <CtaLink href="/kosik" variant="ghost" className="mt-8">
        Zpět do košíku
      </CtaLink>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-20 text-center text-sm text-muted-foreground">
          Načítám platbu…
        </div>
      }
    >
      <MockPayInner />
    </Suspense>
  );
}
