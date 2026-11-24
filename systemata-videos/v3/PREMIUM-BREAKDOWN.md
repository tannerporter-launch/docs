# What makes a video premium, and what v3 does about it

## Done in v3
| Area | Technique | Free/open-source tool |
|---|---|---|
| Resolution | 4K master (3840x2160) + 1080p copy, 60 fps, bt709 tagged | Chromium canvas, FFmpeg/x264 |
| Motion | Real motion blur (5 sub-frames per frame, 180-degree-style shutter), expo/back easing, springy pops | custom canvas engine |
| Light | Dark/light scene rhythm, slowly drifting light blobs, vignette, film grain re-seeded 24x/s | canvas compositing |
| Depth | Layered soft shadows on paper cards, translucent glass cards on dark, glowing particles/flows | canvas |
| Type | Inter, strict size hierarchy, masked slide-up line reveals, tracked small-caps kickers | Inter (OFL) |
| Brand | Real palette and logo mark from the brand site; orange only for "chaos" | - |
| Icons | One consistent icon family | Lucide (ISC) |
| Transitions | Iris wipes in brand color, cut on bar lines of the music (96 BPM, 2.5s bars) | custom |
| Pacing | One idea per scene, text reveal -> visual -> hold; end card with logo lockup + CTA | - |
| Music | Arranged score with an energy curve (intro, build, drive, full, resolve), piano / strings / vibraphone / bass / drums, crash on each rise | mido + FluidSynth + FluidR3_GM (MIT) |
| Sound design | Designed UI ticks/pops, very quiet air swish, riser into impact, bell chimes, logo sting | math-synthesized |
| Mix/master | EQ, compression, reverb, sidechain-style ducking under effects, -14 LUFS, FFmpeg limiter | Pedalboard, pyloudnorm, FFmpeg |
| Honesty | "Illustrative" labels on example diagrams; no invented numbers, prices or claims | - |

## Further options (not done yet)
- Voiceover with a free neural TTS (Kokoro, Piper) or your own recording; word-timed visuals. Needs model-download network access.
- Burned-in captions and .srt files (most social video is watched muted).
- Vertical 9:16 and square cuts for LinkedIn/Reels/Shorts; 6-15s hooks cut from each video.
- Real screen footage or UI mockups of your actual tools (booking page, CRM) once you share them.
- CC0 sound packs (Kenney, Freesound) and better orchestral soundfonts for richer music. Needs network access.
- 3D scenes (three.js), Lottie micro-animations, animated logo draw-on.
- A/B hook variants, thumbnails, and per-platform loudness targets.
