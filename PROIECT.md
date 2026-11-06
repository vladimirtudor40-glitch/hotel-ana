# Hotel Ana Constanța

Concept de redesign pentru hotelanaconstanta.ro: site static RO/EN, cu rezervări trimise direct în motorul oficial al hotelului. Pagina urmează clădirea, de la stradă până la terasa de pe acoperiș.

| | |
|---|---|
| **Tip** | Hotel 3★ |
| **Zonă** | Constanța, lângă stadionul Farul |
| **Adresă** | Str. Limanului, nr. 1, 900635, Constanța |
| **Telefon** | 0773 822 993 (mobil), 0241 650 025 (recepție) |
| **Email** | hotelana2000@yahoo.ro |
| **Firmă** | Ana Prod 2000 SRL, CUI RO19126353 |
| **Tehnologie** | Astro static, RO + EN, 1,8 KB JavaScript |
| **Rezervări** | https://hotel-ana.pynbooking.direct |
| **Site actual** | https://hotelanaconstanta.ro (WordPress) |
| **Site live** | https://vladimirtudor40-glitch.github.io/hotel-ana/template-1/ |
| **GitHub** | https://github.com/vladimirtudor40-glitch/hotel-ana |
| **Creat** | 2026-11-06 |

## Comenzi

```bash
cd template-1
npm install
npm run dev
npm run build
```

Sunt planificate 3 șabloane cu design diferit, fiecare în folderul lui: `template-1/`, `template-2/`, `template-3/`. Sursa e pe `main`, iar site-ul construit e pe `gh-pages`, câte un subfolder pentru fiecare șablon (vezi `base` în `astro.config.mjs`).

## Înainte de lansare

1. Acordul hotelului pentru fotografii. Termenii site-ului actual spun că tot conținutul este protejat.
2. Șterge `<meta name="robots" content="noindex">` din `src/components/Site.astro`.
3. Șterge mențiunea „Concept de redesign” din `src/i18n/content.ts`.
4. Mută paginile legale. Acum footer-ul trimite la cele de pe site-ul vechi.
5. Adaugă tarifele pe 2027. Lista actuală se termină la 24.12.2026.
6. Actualizează `site` și `base` dacă site-ul merge pe domeniul hotelului.

## De confirmat cu hotelul

Sursele se contrazic sau există o singură sursă pentru aceste informații.

| Informație | Pe site | Problema |
|---|---|---|
| Anulare gratuită | 7 zile | Motorul de rezervări spune 7 zile, politica de pe site spune 14 |
| Check-out | până la 11:30 | Travelminit și Nocowanie spun 12:00 |
| Check-in | 15:00–20:30 | Valoare din motorul de rezervări; Kayak spune de la 14:00 |
| Suprafață apartament | 35 m² | Site-ul hotelului spune 35, Litoralul Românesc spune 40 |
| Renovare 2024 | în hero | O singură sursă: Litoralul Românesc |
| Mic dejun | contra cost, à la carte | Google îl afișează gratuit; prețul nu apare nicăieri |
| Taxă de oraș | neafișată | 1% conform Litoralul Românesc, zero conform Travelminit |
| Luminatoare în apartament | în text | Dedus din fotografii |
| Vârste copii și pat suplimentar | fără cifre | Motorul are prețuri pe vârste, dar regula nu e clară |
| Aer condiționat | în toate camerele | Travelminit spune „câteva camere” |
| Evaluări | 8,9 / 4,3 / 9,6 | Instantaneu din 2026-11-06; se schimbă în timp |

Google afișează și piscină. Nicio sursă detaliată nu o confirmă, așa că nu apare pe site.

## Fotografii

Fotografiile sunt ale hotelului, preluate din motorul de rezervări, Travelminit și Litoralul Românesc. `scripts/prepare-photos.mjs` le decupează și le ajustează ușor. Terasa are cea mai slabă imagine (1200 px, decupată strâns): o fotografie nouă, la apus, ar aduce cel mai mare câștig vizual.

## Rezultate măsurate (2026-11-06)

Build local, fără CDN, Lighthouse mobil.

| Măsură | Țintă | Rezultat |
|---|---|---|
| Performanță | ≥ 95 | 99 |
| Accesibilitate | ≥ 95 | 100 |
| Best practices | ≥ 95 | 100 |
| SEO | ≥ 98 | 66, doar din cauza `noindex` intenționat |
| LCP | ≤ 1,2 s | 2,0–2,2 s, peste țintă |
| CLS | ≤ 0,05 | 0,001 |
| Greutate pagină | ≤ 250 KB | 236 KB |
| JavaScript | ≤ 30 KB | 1,8 KB |
| axe (WCAG 2.2 AA) | 0 probleme | 0, la 320, 390, 820 și 1440 px |
