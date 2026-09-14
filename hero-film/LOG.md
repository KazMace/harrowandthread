# Hero film log

Brief: home page hero film from the approved hero picture (`public/images/grand/hero-grand-3200w.webp`, 21:9). Slow forward push a few feet at eye height down the room centre, fire burning in the background, no people, no text, no music, no dialogue. Final web file under 1MB. A dark see-through panel with the hero text drops in near the loop point (site work, later, after Kaz approves the film).

Tools: `runware.mjs` + `.env` copied from `media/fless` on 2026-09-14. Run from this folder.

Model choice: Seedance, because the picture is 21:9 and Seedance supports 21:9; Kling 3.0 only outputs 16:9 / 9:16 / 1:1 and would crop the sides. Cheap draft first on Seedance 2.0 Mini at 720p, audio off (the site plays it muted).

## Takes

- **t1** 2026-09-14 — `tests/t1-seedance20mini-720p-glide.mp4`. bytedance:seedance@2.0-mini, first frame = hero JPG, 5s, 720p preset (came back 1470x630, 21:9, 24fps, 3.7MB), audio off, prompt `prompts/v1-glide.txt`. Cost $0.41. First frame matches the picture; centred eye-height glide; fire burns. Faults: camera travels past the double doors, so the model invents space outside the picture (wall sconces both sides, right sideboard with lamp, a second room through a right doorway), the bookcase moves into a recess, the rug medallion and border change shape. Cause: the move reveals area the picture never showed. Shown to Kaz: "freaking amazing". On review he judged the revealed side areas natural (a real walk-through reveals them); the rug stays the same design with slight medallion drift; the bookcase was half hidden by the door, not moved. A "fade" he saw was Chrome's player controls; no-controls playback has none (bottom-strip brightness measured, screenshot checked). Kept as the film.
- **web v1** 2026-09-14 — `working/v1-hero-glide-web.mp4` from t1: H.264 high, CRF 26, veryslow, no audio, faststart, 1470x630, 947,605 bytes, SSIM 0.976 vs t1. Poster `working/v1-hero-glide-poster.jpg` (first frame). A higher-resolution regeneration would be a new take, so t1 itself is the source.
- **web v2 (slow)** 2026-09-14 — `working/v2-hero-glide-slow-web.mp4`, site copy `public/video/hero-glide-slow.mp4`. Kaz asked for a slower glide with the panel holding, then a reset each cycle. t1 motion-interpolated to 36fps (ffmpeg minterpolate mci/aobmc/bidir) and retimed to 24fps = 1.5x slower, 7.46s; H.264 CRF 27 veryslow, no audio, faststart, 985,843 bytes. Full-size door crops of in-between frames checked: no ghosting. Picked over browser playbackRate 2/3 (Way 1). Site: plays once, holds last frame with panel 4.5s, panel fades, restarts; pointer or focus on the panel holds it.

