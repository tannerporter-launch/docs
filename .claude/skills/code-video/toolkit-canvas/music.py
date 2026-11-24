"""Composes a gentle corporate-clean music bed as MIDI (mido), for rendering with FluidSynth + the MIT-licensed FluidR3_GM soundfont.
usage: music.py <slug> <duration_s> <out.mid>"""
import sys, random, math, mido
slug, dur, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
BPM = {'pipeline': 100, 'method': 96, 'engagement': 92, 'join': 104}.get(slug, 96)
# (root midi, chord tones) per bar, 4-bar loop per video: maj7 / m7 / maj7 / dom7 colors
Q = {'maj7': [0, 4, 7, 11], 'm7': [0, 3, 7, 10], 'dom7': [0, 4, 7, 10]}
PROG = {'pipeline': [(60, 'maj7'), (57, 'm7'), (53, 'maj7'), (55, 'dom7')],
        'method': [(53, 'maj7'), (50, 'm7'), (58, 'maj7'), (60, 'dom7')],
        'engagement': [(55, 'maj7'), (52, 'm7'), (60, 'maj7'), (62, 'dom7')],
        'join': [(62, 'maj7'), (59, 'm7'), (55, 'maj7'), (57, 'dom7')]}[slug]
random.seed(sum(map(ord, slug)))
TPB = 480; ev = []  # (tick, order, msg)
def note(ch, n, start_beat, len_beats, vel):
    t0 = int((start_beat + random.uniform(-.012, .012)) * TPB); t0 = max(0, t0)
    ev.append((t0, 1, mido.Message('note_on', channel=ch, note=int(n), velocity=int(max(1, min(127, vel + random.randint(-4, 4)))), time=0)))
    ev.append((t0 + int(len_beats * TPB), 0, mido.Message('note_off', channel=ch, note=int(n), velocity=0, time=0)))
for ch, prog in [(0, 4), (1, 11), (2, 89), (3, 33)]:  # e-piano, vibraphone, warm pad, fingered bass
    ev.append((0, -1, mido.Message('program_change', channel=ch, program=prog, time=0)))
bars = int(math.ceil(dur * BPM / 60 / 4)) + 1
for b in range(bars):
    root, q = PROG[b % 4]; tones = [root + i for i in Q[q]]; base = b * 4
    for n in tones: note(2, n, base, 4.1, 26)                                  # pad: whole bar
    for k, n in enumerate(tones[1:] + [tones[0] + 12]): note(0, n + 12 if n < 64 else n, base + (0 if k < 3 else 0), 1.6, 40 - k * 2)   # e-piano chord on 1
    for k, n in enumerate(tones): note(0, n + 12, base + 2, 1.2, 34)                                                                     # e-piano chord on 3
    for s, idx in enumerate([0, 2, 1, 3, 2, 1, 3, 2]): note(1, tones[idx] + 24, base + s * .5, .6, 44 if s % 2 == 0 else 34)             # vibraphone arpeggio
    note(3, root - 12, base, 1.4, 58); note(3, root - 12, base + 2.5, .8, 46)   # bass
    for s in range(4): note(9, 42, base + s + .5, .1, 16)                        # soft off-beat hat
mid = mido.MidiFile(ticks_per_beat=TPB); tr = mido.MidiTrack(); mid.tracks.append(tr)
tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
ev.sort(key=lambda e: (e[0], e[1])); last = 0
for t, _, m in ev: m.time = t - last; last = t; tr.append(m)
mid.save(out); print(slug, 'midi', BPM, 'bpm', bars, 'bars')
