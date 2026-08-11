# Harrow & Thread — Image Generation Prompts

Generate each image and save to the path listed. All images are AI-generated design visualisations. They must depict hand-tufted rugs, wall hangings, or carpets in realistic interior settings. No people. Editorial photography style. Warm neutral palette with the rug providing the colour.

---

## 1. hero-banner-main
**Save to:** `public/images/hero-banner-main-1600w.avif`
**Dimensions:** 1200×1600 (3:4 vertical)
**Prompt:**
```
A single hand-tufted rug in a minimalist, light-filled interior. The rug features an abstract painterly design in muted madder red, ochre, and deep indigo tones on a warm cream ground. Natural daylight from a large window falls across the textured wool surface, showing the cut-pile detail. No people. Editorial, architectural photography style, 35mm film aesthetic, warm neutral palette, high-end interior magazine quality. Vertical orientation.
```

---

## 2. render-rug-01
**Save to:** `public/images/render-rug-01-1600w.avif`
**Dimensions:** 1200×900 (4:3)
**Prompt:**
```
A hand-tufted rug with a botanical painterly design in sage green, dusty rose, and cream, placed in a bright living room with oak floors, a linen sofa, and soft natural light. The rug texture shows visible cut-pile detail. Editorial interior photography style, warm neutral tones. No people.
```

---

## 3. render-rug-02
**Save to:** `public/images/render-rug-02-1600w.avif`
**Dimensions:** 1200×900 (4:3)
**Prompt:**
```
A hand-tufted rug with a bold geometric border pattern in charcoal and warm cream, placed under a dark wood dining table in a minimalist dining room. Clean lines, natural light, architectural interior. Editorial style. No people.
```

---

## 4. render-rug-03
**Save to:** `public/images/render-rug-03-1600w.avif`
**Dimensions:** 1200×900 (4:3)
**Prompt:**
```
A single-colour hand-tufted rug in warm ochre amber tone, placed at the foot of a bed in a serene bedroom with white linen bedding and pale walls. Deep luxurious pile texture visible. Soft morning light. No people. Editorial interior photography.
```

---

## 5. render-rug-04
**Save to:** `public/images/render-rug-04-1600w.avif`
**Dimensions:** 1200×900 (4:3)
**Prompt:**
```
A hand-tufted runner rug with an abstract watercolour-like design in indigo, rust, and cream, placed in a wide hallway with arched doorways and terracotta floor tiles. Mediterranean architecture influence. No people. Editorial interior photography.
```

---

## 6. render-wall-hanging-01
**Save to:** `public/images/render-wall-hanging-01-1200w.avif`
**Dimensions:** 900×1200 (3:4)
**Prompt:**
```
A large hand-tufted textile wall hanging featuring an abstract landscape design in muted earth tones — ochre, olive, charcoal, and cream — mounted on a clean white wall in a minimalist interior. The textile's cut-pile texture and varied pile heights are visible. No frame visible; the piece hangs directly on the wall. Soft gallery lighting. No people. Editorial fine-art textile photography.
```

---

## 7. render-wall-hanging-02
**Save to:** `public/images/render-wall-hanging-02-1600w.avif`
**Dimensions:** 1200×1200 (1:1)
**Prompt:**
```
A close-up detail of a hand-tufted wall hanging showing varied pile heights — 6mm, 12mm, 20mm — creating a sculptural, topographic surface in warm neutral tones. Raking light emphasises the texture and depth. Abstract, editorial, fine-art textile photography style. No people.
```

---

## 8. carpets-teaser
**Save to:** `public/images/carpets-teaser-1600w.avif`
**Dimensions:** 1600×900 (16:9)
**Prompt:**
```
A hand-tufted wall-to-wall carpet in a warm cream oatmeal tone, filling a generously proportioned room with large windows, showing the seamless wall-to-wall coverage. The carpet extends fully to the skirting boards. Natural daylight. Editorial interior photography. No people.
```

---

## 9. wall-hanging-context
**Save to:** `public/images/wall-hanging-context-1200w.avif`
**Dimensions:** 900×1200 (3:4)
**Prompt:**
```
A hand-tufted textile wall hanging in an abstract composition of layered earth tones and muted blues, mounted flush against a white wall in a modern living room. The piece is approximately 2m × 1.5m. No visible mounting hardware. Soft natural daylight. Editorial interior style. No people.
```

---

## 10. carpet-room-context
**Save to:** `public/images/carpet-room-context-1600w.avif`
**Dimensions:** 1600×900 (16:9)
**Prompt:**
```
A hand-tufted wall-to-wall carpet in a warm neutral tone filling a room with a bay window. The carpet extends fully to the skirting boards. The room is minimally furnished with a single armchair and side table, emphasising the seamless floor coverage. Natural daylight. Editorial interior photography. No people.
```

---

## Notes

- All images must be labelled "Design visualisation" in the UI (handled by the code)
- Generate in AVIF format. WebP fallback and responsive sizes (640w, 1024w, 1600w, 2400w) are handled by the `<ImagePlaceholder>` component using the AVIF as source
- If the generator only outputs one size, generate at the largest dimension listed and the component will reference it
- No stock photography aesthetic. No fake people. No text overlays on the image itself
- Colour palette of the rugs should feel warm, natural, sophisticated — madder reds, ochres, indigos, sages, warm creams, charcoals