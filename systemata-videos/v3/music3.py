"""Arranged music bed as MIDI (mido). Energy per bar: 0 sparse, 1 build, 2 drive, 3 full. usage: music3.py spec.json out.mid"""
import sys, json, random, mido
spec = json.load(open(sys.argv[1])); slug, bpm, energy = spec['slug'], spec['bpm'], spec['energy']
random.seed(sum(map(ord, slug)))
PROG = {'audit': [(45, 'm'), (41, 'M'), (48, 'M'), (43, 'M')], 'growth': [(50, 'm'), (46, 'M'), (53, 'M'), (48, 'M')], 'call': [(52, 'm'), (48, 'M'), (43, 'M'), (50, 'M')]}[slug]
TONES = {'m': [0, 3, 7, 14], 'M': [0, 4, 7, 14]}
TPB = 480; ev = []
def note(ch, n, beat, ln, vel):
    t0 = max(0, int((beat + random.uniform(-.01, .01)) * TPB)); v = int(max(1, min(127, vel + random.randint(-4, 4))))
    ev.append((t0, 1, mido.Message('note_on', channel=ch, note=int(n), velocity=v, time=0))); ev.append((t0 + int(ln * TPB), 0, mido.Message('note_off', channel=ch, note=int(n), velocity=0, time=0)))
for ch, pr in [(0, 0), (1, 11), (2, 48), (3, 38)]: ev.append((0, -1, mido.Message('program_change', channel=ch, program=pr, time=0)))  # piano, vibraphone, strings, synth bass
nb = len(energy)
for b in range(nb):
    e = energy[b]; root, q = PROG[b % 4]; tn = [root + i for i in TONES[q]]; base = b * 4; last = b == nb - 1
    for n in tn[:3]: note(2, n + 12, base, 4.05, 40 + 8 * e)                       # strings pad
    if e >= 2:
        for n in tn[:3]: note(2, n + 24, base, 4.05, 24)
    if last:
        for n in tn[:3]: note(0, n + 12, base, 3.6, 52)                              # resolve: held piano chord
        note(0, tn[0] + 24, base + .5, 3.2, 46); continue
    pat = [0, 1, 2, 1, 2, 1, 2, 3] if e >= 1 else [0, None, 2, None, 1, None, 2, None]
    for s, ix in enumerate(pat):
        if ix is not None: note(0, tn[ix] + 24, base + s * .5, .6 if e else 1.0, 50 + 3 * e - (s % 2) * 6)      # piano arpeggio
    if e >= 1:
        for s in (1.5, 3.5): note(1, tn[2] + 36, base + s, .5, 36)                                                # vibraphone sparkle
        for ofs, ln, nn in [(0, 1.4, 0), (1.5, .4, 0), (2, 1.0, 0), (3, .9, 2 if e >= 3 else 0)]: note(3, root - 12 + (7 if nn == 2 else 0), base + ofs, ln, 62 + 4 * e)   # bass
    if e >= 2:
        for k in ([0, 2] if e == 2 else [0, 1.5, 2, 3.5]): note(9, 36, base + k, .2, 78 + (6 if k == 0 else 0))   # kick
        for k in (1, 3): note(9, 39, base + k, .2, 52)                                                             # clap
        for s in range(8): note(9, 42, base + s * .5, .1, 24 if s % 2 == 0 else 38)                                # hats
        if e >= 3:
            for s in range(16): note(9, 42, base + s * .25 + .125, .05, 16)
            note(9, 46, base + 3.5, .3, 34)
    elif e == 1:
        for s in range(4): note(9, 42, base + s + .5, .08, 20)
    if b > 0 and e > energy[b - 1]: note(9, 49, base, 1.5, 60)                                                     # crash when energy rises
mid = mido.MidiFile(ticks_per_beat=TPB); tr = mido.MidiTrack(); mid.tracks.append(tr); tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(bpm), time=0))
ev.sort(key=lambda x: (x[0], x[1])); last_t = 0
for t, _, m in ev: m.time = t - last_t; last_t = t; tr.append(m)
mid.save(sys.argv[2]); print(slug, 'midi', nb, 'bars')
