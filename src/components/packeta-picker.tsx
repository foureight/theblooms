"use client";

import { useCallback, useEffect, useState } from "react";
import type { PacketaPoint } from "@/lib/checkout";
import { formatPacketaPoint } from "@/lib/checkout";
import { cn } from "@/lib/utils";

type Props = {
  value: PacketaPoint | null;
  onChange: (point: PacketaPoint | null) => void;
  apiKey?: string;
};

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (
          apiKey: string,
          callback: (point: Record<string, string> | null) => void,
          options?: Record<string, unknown>,
        ) => void;
      };
    };
  }
}

const DEMO_POINTS: PacketaPoint[] = [
  {
    id: "1313",
    name: "Zásilkovna Praha 1 — Národní",
    city: "Praha",
    street: "Národní 25",
    zip: "110 00",
  },
  {
    id: "2479",
    name: "Zásilkovna Praha 2 — I. P. Pavlova",
    city: "Praha",
    street: "Legerova 39",
    zip: "120 00",
  },
  {
    id: "3981",
    name: "Zásilkovna Brno — Česká",
    city: "Brno",
    street: "Česká 11",
    zip: "602 00",
  },
];

function loadPacketaScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Packeta?.Widget) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-packeta-widget="1"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const script = document.createElement("script");
    script.src = "https://widget.packeta.com/v6/www/js/library.js";
    script.async = true;
    script.dataset.packetaWidget = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Packeta widget load failed"));
    document.body.appendChild(script);
  });
}

function mapPoint(raw: Record<string, string>): PacketaPoint {
  return {
    id: String(raw.id || raw.pointId || ""),
    name: String(raw.name || raw.place || "Zásilkovna"),
    city: String(raw.city || ""),
    street: String(raw.street || raw.address || ""),
    zip: String(raw.zip || raw.zipCode || ""),
    url: raw.url || undefined,
  };
}

export function PacketaPicker({ value, onChange, apiKey = "" }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const live = Boolean(apiKey);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    void loadPacketaScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Widget Zásilkovny se nepodařilo načíst.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  const openWidget = useCallback(() => {
    setError("");
    if (!live) return;
    if (!window.Packeta?.Widget) {
      setError("Widget ještě není připravený.");
      return;
    }
    window.Packeta.Widget.pick(
      apiKey,
      (point) => {
        if (!point) return;
        const mapped = mapPoint(point);
        if (!mapped.id) return;
        onChange(mapped);
      },
      {
        country: "cz",
        language: "cs",
      },
    );
  }, [apiKey, live, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">
            Doprava — Zásilkovna
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Vyberte výdejní místo, kam věnec pošlu.
          </p>
        </div>
        {live ? (
          <button
            type="button"
            onClick={openWidget}
            disabled={!ready}
            className="border border-moss-deep/40 px-4 py-2.5 text-[10px] font-medium tracking-[0.16em] uppercase text-moss-deep transition-colors hover:border-bloom-light hover:text-bloom-light disabled:opacity-50"
          >
            {value ? "Změnit výdejní místo" : "Vybrat výdejní místo"}
          </button>
        ) : null}
      </div>

      {!live ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Demo režim (chybí <code>NEXT_PUBLIC_PACKETA_API_KEY</code>) — vyberte
            ukázkové místo:
          </p>
          <ul className="space-y-2">
            {DEMO_POINTS.map((point) => {
              const active = value?.id === point.id;
              return (
                <li key={point.id}>
                  <button
                    type="button"
                    onClick={() => onChange(point)}
                    className={cn(
                      "w-full border px-4 py-3 text-left text-sm transition-colors",
                      active
                        ? "border-moss-deep bg-moss-deep text-white"
                        : "border-border bg-white hover:border-moss-deep/40",
                    )}
                  >
                    <span className="font-medium">{point.name}</span>
                    <span
                      className={cn(
                        "mt-0.5 block text-xs",
                        active ? "text-white/80" : "text-muted-foreground",
                      )}
                    >
                      {formatPacketaPoint(point)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {live && value ? (
        <div className="border border-bloom/35 bg-white px-4 py-3 text-sm">
          <p className="font-medium text-moss-deep">{value.name}</p>
          <p className="mt-1 text-muted-foreground">
            {formatPacketaPoint(value)}
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
