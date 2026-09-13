# Photo slots — hand-off for vetted photography

Built 2026-08-26, alongside the LV-style homepage rebuild. This is the exact list of
image slots the new homepage and linked pages need. Shoot and vet against this table so
photos arrive the right shape the first time — no relayout needed on drop-in.

## How a photo gets into a slot

Every slot is a Tailwind/Astro `id`. Once a vetted photo is ready:

1. Export it at the three (or four) widths listed for that slot, as **WebP**.
2. Name each file `public/images/{id}-{width}w.webp` exactly — e.g.
   `public/images/render-rug-05-1600w.webp`. For slots inside `grand/`, keep the
   subfolder: `public/images/grand/hero-grand-2400w.webp`.
3. Drop the files in. No code change needed — `ImagePlaceholder.astro` finds them on
   disk at build time and the colour-block placeholder disappears automatically.
4. If it's a **new** id (not replacing an existing one), tell me the id, the page it's
   for, and I'll wire the one line that references it.

Standard width ladder: **640 / 1024 / 1600** for normal slots, **800 / 1600 / 2400**
for `grand/`-sourced slots (that's the size the mill/photographer masters were cut at).

## The rule that overrides everything else in this table

**No rug or wall hanging may ever be shown cropped.** If the "Croppable" column says
No, the photo must be shot so the *entire* piece fits inside the frame with room to
spare — the layout will show it whole, at its true aspect ratio, no exceptions. This
is a standing client requirement (a previous build cropped a rug to a sliver and it was
pulled). If in doubt, shoot wider than you think you need.

## Slots

| Slot id | Appears in | Ratio | Min width | Croppable? | What the shot must show |
|---|---|---|---|---|---|
| `grand/hero-grand` | Homepage hero (full-bleed) | 16:9 | 2400px | **Yes — room-context only, see warning below** | A grand, light-filled room. No rug may be the framed subject or sit near the frame edge — this is the one slot allowed to crop, and only because nothing in it can be cut wrong. |
| `render-rug-01` | Homepage category tile "Rugs"; Plate I | 16:9 | 1600px | No | Whole rug, shown in full, reception hall context. |
| `render-rug-04` | Plate II | 16:9 | 1600px | No | Whole rug, saloon context. |
| `render-rug-02` | Plate III | 4:3 | 1600px | No | Whole rug, library context. |
| `render-rug-03` | Plate IV | 4:3 | 1600px | No | Whole rug, principal bedroom context. |
| `render-wall-hanging-01` | Homepage category tile "Wall hangings"; Plate V | 4:3 | 1600px | No | Whole wall hanging, hung, saloon context. |
| `render-wall-hanging-02` | Plate VI | 4:3 | 1600px | No | Whole wall hanging, hung, drawing room context. |
| `carpets-teaser` | Homepage "Wall-to-wall, made to your room" block; category tile "Carpets" | 16:9 | 1600px | No (currently shown whole) | Wall-to-wall carpet filling a room edge to edge — the carpet itself is the room's floor, so there's no crop risk in the same way a rug has, but keep the whole floor in frame. |
| `wall-hanging-context` | Homepage category tile "Trade"; `/commissions` wall-hangings split | 16:9 | 1600px | No | A finished piece styled in a real interior. |
| `carpet-room-context` | `/carpets` full-bleed section | 16:9 | 1600px | Not currently — flagged below | See note. |

## ⚠ Hero crop check — do this before the real hero photo ships

The current placeholder (`grand/hero-grand`) **fails this check**: its rug sits so close
to the bottom of the photo that the hero crop cuts it at most screen widths, not just on
phones. Left as-is deliberately — it's a placeholder, not real photography, so it's flagged
here rather than fixed now.

When the real hero photo is chosen, check it this way before it ships:

1. Build the site, open the homepage in a real browser at **375px, 768px, and 1440px** wide.
2. Look at the very edges of the visible photo at each width — top, bottom, left, right.
3. If any part of a rug, wall hanging, or carpet is sliced by the frame at *any* of those
   three widths — no border, no fringe, no floor margin, pattern just stops at the edge —
   the photo fails. Pick a different one, or ask for a version shot with more headroom
   around the rug. Do not ship it and do not loosen this check to make one photo work.
4. A photo passes only if, at all three widths, either no rug is visible at all, or every
   rug visible has its complete border/fringe inside the frame with margin to spare.

## Not yet wired in — reserved / worth reviewing

These already exist on disk (`public/images/grand/`) but aren't referenced by any page.
Four of them are genuinely new photography, not duplicates of what's already live:

| Slot id | Ratio | What it is | Suggested use |
|---|---|---|---|
| `grand/grand-contemporary` | 16:9 | Unused room shot | Alternate hero, or a second full-bleed moment if the homepage grows a section. |
| `grand/macro-pile` | 3:2 | Unused close-up of tufted pile texture | Could replace `ColourRail`'s flat colour swatches with a real macro shot later — worth a conversation, not part of this build. |
| `grand/wall-hanging` | **3:4 portrait** | Unused, the only portrait asset in the repo | Nothing in the current layout wants a portrait slot. Keep in reserve. |

The other 23 files in `public/images/grand/` are byte-identical duplicates of images
already live under different names — no new photography there.

## Known gap, out of scope for this build

`/carpets` has a section labelled "full-bleed" with a fixed-height container, but the
image inside is shown whole (letterboxed), not actually cropped to fill it — see
`ImagePlaceholder`'s new `fit="cover"` option, added in this build, which that section
could adopt later since a wall-to-wall carpet has no "whole piece" edge to protect the
way a rug or wall hanging does. Flagging, not fixing, per the plan.
