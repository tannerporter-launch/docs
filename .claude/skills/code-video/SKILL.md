---
name: code-video
description: Make a motion-graphics, product-demo or explainer video from pure code (no AI video generator, no Remotion). Use when the user asks for a demo video, explainer, animated mockup, or social clip. Renders frames with Playwright, synthesizes sound in code, stitches with FFmpeg.
---

# Code-rendered video

A video is a function of time: `render(t)` draws one frame. Draw 60 per second, stitch to MP4. Free, deterministic, checkable.

## Toolkit (`toolkit/`, a working CRM demo to copy from)
- `timeline.js`: all event times in one place; shared by visuals and sound
- `index.html`: the scene + `render(t)`. No CSS animations/transitions; every value is computed from `t`
- `audio.js`: synthesizes music bed + sfx from math -> `out/audio.wav`
- `render.js`: Playwright screenshots every frame (4 workers, 1920x1080@60) + FFmpeg -> mp4
- `shot.js`: `node shot.js sheet.png t1 t2 ...` -> contact sheet of chosen moments

## Workflow
1. **Intake** (ask only what's missing): topic, length, aspect (16:9 or 9:16), style/brand colors, voiceover or music only, any reference images/video.
2. **Storyboard first**: write the beats as a timeline, build the scene, render 8-12 key moments with `shot.js`, show the contact sheet, let the user adjust before the full render.
3. **Build**: copy `toolkit/` into a work folder; edit `timeline.js`, `index.html`, `audio.js`. Keep scratch output (`OUT_DIR`) outside the repo.
4. **Voiceover (optional)**: get the audio plus word-level timestamps; set event times in `timeline.js` from the words; mux the voice in `render.js` instead of / mixed with `audio.wav`.
5. **Render**: `OUT_DIR=<scratch> node render.js` (~3 min for 40s).
6. **QA loop**: `ffmpeg -i out.mp4 -vf "fps=1/2.6,scale=480:-1,tile=4x4" -frames:v 1 sheet.png`, view it, check `volumedetect`, fix problems, re-render. Repeat until clean.
7. **Deliver**: send the MP4 to the user; commit only if asked.

## Rules of thumb
- Cursor targets are measured from real elements at the moment they matter (see `resolve()`), so layout changes don't break paths.
- Hold the cursor still while typing; add hold waypoints.
- Sound events come from `timeline.js` so picture and audio never drift.
- Vertical: change viewport to 720x1280 (or scale) and re-layout.
- Needs: node, Playwright (chromium), FFmpeg. Weak fit: live action / photoreal footage.

## Canvas toolkit v2 (`toolkit-canvas/`, preferred for brand/motion-graphics videos)
Canvas 1920x1080@60, one module per video in `videos/<slug>.js` exporting `{duration, sfx:[[t,name],...], draw(c,t,L)}`. `node shot.js <slug> sheet.png t1 t2..` to storyboard/QA, `OUT_DIR=<scratch> node render.js <slug>` to render.
Free/open-source stack used (all installable from apt/npm/pip, no paid services):
- **Music**: `music.py` (mido) writes MIDI -> **FluidSynth** + FluidR3_GM soundfont (MIT) renders real instruments (`apt-get install fluidsynth fluid-soundfont-gm`)
- **SFX**: synthesized in `audio.js`; keep `whoosh` very quiet (~-20 dB under music), then **SoX** reverb + mix (`apt-get install sox libsox-fmt-all`), **FFmpeg** loudnorm to -16 LUFS
- **Icons**: **Lucide** (ISC) via `npm i lucide-static` -> `node build-icons.js` -> `icons.js`
- **Font**: Inter (OFL). **Render**: Playwright + FFmpeg
- Brand: read the client's site CSS (`curl` the stylesheet, grep `--vars`/hex) and favicon.svg; put colors in `lib.js` `L.C` and the logo in `L.logo`. If the host is blocked, request it with create_environment/update_environment.
