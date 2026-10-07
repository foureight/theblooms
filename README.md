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

Poptávky se logují na server (`/api/inquiry`) — e-mailová služba a platební brána zatím nejsou napojené. Formulář má matematickou captchu (HMAC) a honeypot; volitelně nastavte `CAPTCHA_SECRET` v prostředí.

SEO / GEO / AIO: stránky mají rozšířené texty, FAQ a JSON-LD (`Service`, `FAQPage`, `BreadcrumbList`, u věnců `Product`). Canonical URL nastavte přes `NEXT_PUBLIC_SITE_URL` (výchozí `https://theblooms.cz`).

## Admin (texty + fotky)

Alena spravuje obsah na [`/admin`](http://127.0.0.1:43123/admin).

- **Texty** — nadpisy a odstavce (úvod, svatby, kytky, věnce, workshopy, o mně, kontakt)
- **Fotky stránek** — hero a sekční fotky
- **Svatby / Věnce** — názvy, popisy, ceny, cover i galerie; u věnců šipky ↑↓ pro pořadí na webu
- **Knihovna** — nahrání JPG/PNG/WEBP (max 8 MB)

Lokálně nastavte v `.env.local`:

```bash
ADMIN_PASSWORD=vas-heslo
ADMIN_SECRET=nahodny-retezec
UPLOADS_DIR=./uploads
```

Na Zerops: Local Storage `vol` namountovaný na `/srv/uploads`, secret `ADMIN_PASSWORD` (+ ideálně `ADMIN_SECRET`), `UPLOADS_DIR=/srv/uploads`.

## GitHub (Zerops / foureight)

Kanónické GitHub repo pro nasazení: **https://github.com/foureight/theblooms**

Kód z Cursoru / Origin je na [tomas-forejt/blooms-web](https://cursor.com/codebase/tomas-forejt/blooms-web). Na prázdné GitHub repo ho pošlete jednou z počítače (Cloud Agent nemá přístup k vašemu GitHub účtu):

```bash
git clone https://origin.cursor.com/tomas-forejt/blooms-web.git theblooms
cd theblooms
git remote add github https://github.com/foureight/theblooms.git
git push -u github main
```

(Případně `gh auth login` a pak `git push github main`.)

Ve Zerops u služby `app` napojte pipeline na `https://github.com/foureight/theblooms`, větev `main`, setup `app` (viz `zerops.yml` v kořeni).

## Nasazení (Zerops)

### Rychlý import projektu

1. Otevřete [Zerops](https://app.zerops.io) → **Import a project**.
2. Vložte obsah souboru [`zerops-import.yml`](./zerops-import.yml) (nebo nahrajte soubor).
3. Import vytvoří projekt **theblooms** se službami:
   - `vol` — Local Storage (CMS + fotky)
   - `app` — Node.js 22 (Next.js SSR)
4. Ve službě `app` → Pipelines & CI/CD napojte GitHub `foureight/theblooms` (větev `main`, setup `app`). Import sám o sobě Git nevyžaduje — `buildFromGit` + `zeropsSetup` v [`zerops-import.yml`](./zerops-import.yml) až po prvním pushi na GitHub.
5. V secrets změňte `ADMIN_PASSWORD` na silné heslo (výchozí z importu je jen placeholder).
6. Přidejte vlastní doménu / public HTTP; zkontrolujte `NEXT_PUBLIC_SITE_URL`.

CLI alternativa:

```bash
zcli project project-import zerops-import.yml
```

Build a run konfigurace je v [`zerops.yml`](./zerops.yml) (Node.js 22, port 3000, volume `vol` → `/srv/uploads`).

Lokálně: `npm run dev` (port 43123). Produkce: `npm run build && npm run start` (port 3000).

Kontakty (z vizitky): Alena Šmejkalová · theblooms@chtel.biz · +420 775 125 224 · Instagram @thebloomscz

Typografie: celý web na **Acumin Pro Wide** (Adobe Fonts kit `zwe5oqo`, včetně češtiny). V Adobe Fonts → kit → **Web Domains** musí být ostrou doménu i Zerops (`theblooms.cz`, `*.prg1.zerops.app`), jinak prohlížeč spadne na systémový font.

- text / jméno Aleny → Regular (400)
- wordmark BLOOMS → Extra Bold Italic (800)
- fallback → Encode Sans Expanded
