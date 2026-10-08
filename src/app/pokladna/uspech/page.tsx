"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CtaLink } from "@/components/cta-link";
import { useCart } from "@/lib/cart";

function SuccessInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";
  const sessionId = params.get("session_id") || "";
  const { clear } = useCart();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/checkout/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            sessionId: sessionId || undefined,
            action: "pay",
          }),
        });
        if (cancelled) return;
        if (res.ok) {
          clear();
          setStatus("ok");
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, sessionId, clear]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-5xl text-moss-deep">
        {status === "error" ? "Platba neověřena" : "Platba přijata"}
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {status === "loading"
          ? "Potvrzuji platbu…"
          : status === "ok"
            ? "Děkuji. Objednávku připravím a pošlu na Zásilkovnu."
            : "Platbu se nepodařilo potvrdit. Pokud vám odešly peníze, napište mi e-mail."}
        {orderId && status === "ok" ? (
          <>
            {" "}
            Číslo objednávky:{" "}
            <span className="font-medium text-foreground">#{orderId}</span>.
          </>
        ) : null}
      </p>
      <CtaLink href="/vence" className="mt-8">
        Zpět k věncům
      </CtaLink>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-20 text-center text-sm text-muted-foreground">
          Potvrzuji platbu…
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
