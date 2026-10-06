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

Typografie: značka používá **Acumin Pro Wide Regular** (Adobe Fonts).

1. V [Adobe Fonts](https://fonts.adobe.com/) vytvoř Web Project a přidej **Acumin Pro Wide** (Regular).
2. Zkopíruj kit ID z embed odkazu `https://use.typekit.net/XXXXXXX.css` (ta část `XXXXXXX`).
3. Do `.env.local` dej:

```bash
NEXT_PUBLIC_TYPEKIT_ID=xxxxxxx
```

Bez kit ID web padá na volnou náhradu Encode Sans Expanded. Fontové soubory z Typekitu nestahuj — licence vyžaduje CDN embed.
