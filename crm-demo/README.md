# Flowly CRM demo (code-rendered video)

No video generator, no Remotion. The video is a pure function of time: `render(t)` in `index.html` returns one frame.

- `timeline.js` – single source of truth for timing (shared by visuals and sound)
- `index.html` – the CRM UI + `render(t)`; open it directly for a live looping preview
- `audio.js` – synthesizes the soundtrack (music bed + UI sfx) from math → `out/audio.wav`
- `render.js` – headless Chromium (Playwright) draws every frame at 60 fps, FFmpeg stitches frames + audio → `flowly-crm-demo.mp4`
- `shot.js` – storyboard / QA: `node shot.js sheet.png 1 4.5 10.4 …` renders chosen moments into a contact sheet

```bash
node render.js          # ~3 min, 1920x1080 @ 60fps (set OUT_DIR to change scratch location)
```
Edit timings in `timeline.js`, check with `shot.js`, re-render.
