# Mansion-scale image prompt

Written 2026-08-11. This supersedes the prompts in `IMAGE_PROMPTS.md`, which produced
small rugs in modest rooms — the reason the old hero showed an empty beige wall.

**Why this one is different.** At £600–£1,200/m² a 15m × 10m commission is
£90,000–£180,000. The imagery has to fish for that buyer. Scale is created by four
things, and block 3 is the one that was missing:

1. Camera raised and centred, looking down the long axis of the room.
2. **Full-size furniture sitting ON the rug, looking small against it.** An earlier
   prompt said "no furniture on the rug" and "a wide band of empty floor on all four
   sides" — which is exactly what makes a rug read as small.
3. The room is architecture, not furnishing — double height, columns, chandeliers.
4. The rug fills the lower two-thirds while all four corners stay inside the frame.

The raised camera is what reconciles "make it look enormous" with the client's rule
that **no rug may ever be cropped**.

---

## The prompt

```
A single enormous bespoke hand-tufted wool rug, approximately 15 metres by 10
metres, covering most of the floor. A bold contemporary abstract design in
saturated deep indigo, burnt ochre, madder red and cream, in large confident
graphic shapes. Deep cut pile with visible wool texture and a fine
hand-finished border.

A vast double-height reception hall in an English country mansion. Coffered
and gilded ceiling, marble Corinthian columns, a carved stone fireplace, tall
arched French windows along one side opening onto formal gardens, two large
crystal chandeliers, polished marble floor surrounding the rug.

The scale must be unmistakable. Full-size furniture sits ON the rug — a grand
piano, two facing sofas, armchairs, a large centre table — and looks small
against it. The far wall is a long way off. Ceiling at least eight metres high.

Camera raised, as if from a mezzanine or the top of a staircase, looking down
the long axis of the room in symmetrical one-point perspective. THE ENTIRE RUG
IS INSIDE THE FRAME: all four corners and the complete border are visible, with
marble floor showing beyond every edge of the rug. The rug fills the lower
two-thirds of the picture. Nothing crops or clips it.

Architectural interior photography for a luxury magazine. Wide lens with no
distortion, natural daylight through the windows plus warm chandelier light,
rich but not oversaturated, full detail held in shadow and highlight. No
people, no clutter, no text. Ultra high detail.
```

## Negative prompt

```
people, clutter, text, brand names, fisheye distortion, cropped rug,
rug edges running off frame, bathroom, office
```

## The five blocks and what each controls

| Block | Controls | Change it to |
|---|---|---|
| 1 | The rug | Design and colours |
| 2 | The room | Mansion → penthouse, ballroom, gallery, orangery |
| 3 | **Scale** | The critical block. Furniture *on* the rug is the mechanism |
| 4 | **Framing** | Carries the no-crop rule. Raised camera buys whole rug + depth |
| 5 | Photography | Light and lens |

## The main dial

Swap the design line in block 1 for a classical look:

> A classical medallion design in indigo, gold and ivory with an intricate border

That lands closest to the client's own reference,
`/mnt/c/Smash IT 2026/new images/Hero large rug 4.webp`.

**Open argument against it:** a Persian medallion reads "importer of traditional rugs".
A bold contemporary design in the same classical room says "we will make anything, at
any scale" — which is the actual proposition, and no importer can copy it. Generate
both, decide by eye. Client's call.

## Settings

- Model `bytedance-seed/seedream-4.5` — ~4p, 11 seconds, best of the four tested
- `aspect_ratio: "16:9"`, `n: 1`
- Optionally pass `Hero large rug 4.webp` as `input_references` so the set inherits
  the client's own reference world
- Endpoint and cost notes: see `NOTES-codebase.md`

## Bathrooms

Never generate or use bathroom scenes. The client does not encourage rugs in bathrooms,
and `/care` already says so.
