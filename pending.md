# Pending — Harrow & Thread

## Fonts
Fontsource packages are installed (`@fontsource/instrument-serif`, `@fontsource-variable/inter-tight`) but may need WOFF2 files verified at runtime. If fonts don't render, download and place in `public/fonts/`:
- `instrument-serif-regular.woff2`
- `instrument-serif-italic.woff2`
- `inter-tight-regular.woff2`
- `inter-tight-medium.woff2`

## Company details
Replace placeholders in `src/data/site.json`:
- `company.number` — `[Company registration number]`
- `company.address` — `[Registered office address]`

## Form endpoint
Currently set to Netlify Forms (`data-netlify="true"` in `src/pages/enquire.astro`). Options:
- Deploy to Netlify (built-in form handling with file uploads)
- Swap to Formspark + Uploadcare
- Swap to Basin
- Supabase Storage + serverless function

## Analytics
Uncomment Plausible/Fathom script in `src/layouts/BaseLayout.astro` and add your domain.

## Real images
Generate images using the prompts in the plan file and drop into `public/images/` matching the naming pattern:
- `{id}-640w.avif` / `{id}-640w.webp`
- `{id}-1024w.avif` / `{id}-1024w.webp`
- `{id}-1600w.avif` / `{id}-1600w.webp`
- `{id}-2400w.avif` / `{id}-2400w.webp`

10 image IDs: `hero-banner-main`, `render-rug-01` through `04`, `render-wall-hanging-01`, `render-wall-hanging-02`, `carpets-teaser`, `wall-hanging-context`, `carpet-room-context`.

## Solicitor review
Before launch, have a solicitor review:
- `/terms` — B2C and B2B terms
- `/privacy` — Privacy policy
- `/cookies` — Cookie policy

## Outstanding vendor items (from build spec)
- **O1**: Cost differential between geometric border and all-over geometric pattern. Affects the geometric rate caveat on `/commissions` and `/carpets`.
- **O2**: Finished weight per m² at 6mm, 12mm and 20mm pile. Affects the wall hanging section — currently states "weight confirmed at quote".