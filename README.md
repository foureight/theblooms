# THE BLOOMS

Web floristického studia **THE BLOOMS** — svatby, věnce (e-shop), větší květinové zakázky, eventy a workshopy.

## Spuštění

```bash
npm install
npm run dev -- -p 43123
```

Otevřete [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Co je hotové

- Homepage s jasným rozdělením: **věnce = koupit**, ostatní = **poptávka**
- Galerie svateb s detailními stránkami realizací
- E-shop věnců (filtrování dle sezóny, košík, demo checkout)
- Sekce Kytky, Workshopy, O mně, Kontakt
- Formulář poptávky s typy SVATBA / KYTKY / EVENT / WORKSHOP / JINÉ a poli pro svatbu

## Tech

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.

Poptávky se logují na server (`/api/inquiry`) — e-mailová služba a platební brána zatím nejsou napojené.

Kontakty (z vizitky): Alena Šmejkalová · theblooms@chtel.biz · +420 775 125 224 · Instagram @thebloomscz

Typografie:
- Czech text → **Encode Sans Expanded** (latin-ext) — Typekit kit `zwe5oqo` zatím nemá CE znaky (Š/č/ř/ě/ů/ž)
- Wordmark THE BLOOMS → **Acumin Pro Wide** Extra Bold Italic (ASCII)

Až v Adobe Fonts u kitu zapneš jazyk **Czech** / character set **All Characters**, můžeme Acumin vrátit i na tělo webu.

SVG loga: pošli do chatu nebo do `public/brand/`.
