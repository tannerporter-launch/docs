# Systemata videos v3 (premium pipeline)
Three videos: `audit`, `growth`, `call`. Code-rendered, no AI video generator. Content follows the owner's overview, not the website.

```bash
npm i lucide-static && node build-icons.js && cp icons.js v3/        # once
apt-get install -y fluidsynth fluid-soundfont-gm sox ffmpeg; pip install mido pedalboard pyloudnorm soundfile numpy scipy
OUT_DIR=/tmp/out node v3/render3.js audit        # -> systemata-audit-4k.mp4 + systemata-audit-1080p.mp4
node v3/shot3.js audit sheet.png 1 5 10 20       # storyboard / QA contact sheet (fast, 1080p)
```
- `lib3.js` engine: dark/light themes, drifting-light backgrounds, masked text reveals, glass cards, iris wipes, glow/particles, Lucide icons
- `player3.html`: 4K canvas, 5-sample motion blur (180-degree-style shutter), vignette, film grain
- `audio3.js` (SFX synthesis) -> `music3.py` (arranged MIDI) -> FluidSynth + FluidR3 (MIT) -> `master.py` (Pedalboard EQ/comp/reverb, ducking, -14 LUFS, FFmpeg limiter)
