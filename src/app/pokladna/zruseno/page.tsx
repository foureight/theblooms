"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CtaLink } from "@/components/cta-link";

function CancelInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";

  useEffect(() => {
    if (!orderId) return;
    void fetch("/api/checkout/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, action: "cancel" }),
    });
  }, [orderId]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-5xl text-moss-deep">Platba zrušena</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Platba neproběhla. Košík můžete znovu vyplnit a zkusit to znovu.
        {orderId ? (
          <>
            {" "}
            Objednávka #{orderId} byla označena jako zrušená.
          </>
        ) : null}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <CtaLink href="/kosik">Zpět do košíku</CtaLink>
        <CtaLink href="/vence" variant="outline">
          E-shop věnců
        </CtaLink>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 py-20 text-center text-sm text-muted-foreground">
          Načítám…
        </div>
      }
    >
      <CancelInner />
    </Suspense>
  );
}
