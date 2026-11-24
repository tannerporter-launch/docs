"""Studio-style master with open-source Pedalboard (Spotify): EQ, compression, reverb, sidechain-style ducking, -14 LUFS, true-peak limiter.
usage: master.py spec.json music_raw.wav sfx_dry.wav out.wav"""
import sys, json, numpy as np, soundfile as sf, pyloudnorm as pyln
from pedalboard import Pedalboard, Reverb, Compressor, Limiter, HighpassFilter, LowShelfFilter, HighShelfFilter, PeakFilter, Gain
spec = json.load(open(sys.argv[1])); dur = spec['duration']; sr = 48000; n = int(dur * sr)
music, msr = sf.read(sys.argv[2], dtype='float32'); sfx, ssr = sf.read(sys.argv[3], dtype='float32'); assert msr == sr and ssr == sr
def fit(x): x = x[:n]; return np.pad(x, ((0, n - len(x)), (0, 0))) if len(x) < n else x
music, sfx = fit(music), fit(sfx)
mchain = Pedalboard([HighpassFilter(38), LowShelfFilter(110, gain_db=1.5), PeakFilter(300, gain_db=-1.5, q=.8), HighShelfFilter(8500, gain_db=-1.5), Compressor(threshold_db=-19, ratio=2.2, attack_ms=25, release_ms=220), Reverb(room_size=.38, damping=.55, wet_level=.16, dry_level=.9)])
schain = Pedalboard([HighpassFilter(90), Compressor(threshold_db=-20, ratio=3, attack_ms=2, release_ms=80), Reverb(room_size=.28, damping=.5, wet_level=.2, dry_level=.9)])
music, sfx = mchain(music.T.copy(), sr).T, schain(sfx.T.copy(), sr).T   # pedalboard wants (channels, samples)
# duck music under sound effects (cheap sidechain): envelope follower -> up to ~-3.5 dB
env = np.abs(sfx).max(axis=1); k = int(.05 * sr); env = np.convolve(env, np.ones(k) / k, 'same'); env = np.clip(env / (np.percentile(env, 99) + 1e-9), 0, 1)
a, r = np.exp(-1 / (.01 * sr)), np.exp(-1 / (.25 * sr)); sm = np.zeros_like(env); y = 0.
for i, v in enumerate(env): y = a * y + (1 - a) * v if v > y else r * y + (1 - r) * v; sm[i] = y
duck = (1 - .33 * sm)[:, None]
mix = music * .62 * duck + sfx * .55
fade = np.minimum(1, np.arange(n) / (1.2 * sr)) * np.minimum(1, (n - np.arange(n)) / (2.2 * sr)); mix = mix * fade[:, None]
bus = Pedalboard([Compressor(threshold_db=-17, ratio=3.0, attack_ms=8, release_ms=140)])    # glue the whole mix so loud effects don't dominate
mix = bus(mix.T.copy(), sr).T
meter = pyln.Meter(sr); mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -14.0)
import subprocess, tempfile, os
tmp = sys.argv[4] + '.float.wav'; sf.write(tmp, mix, sr, subtype='FLOAT')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-af', 'alimiter=limit=0.84:attack=4:release=60:level=disabled', '-c:a', 'pcm_s24le', '-ar', str(sr), sys.argv[4]], check=True); os.remove(tmp)   # FFmpeg true-peak style limiter
y, _ = sf.read(sys.argv[4], dtype='float32'); print('mastered', round(meter.integrated_loudness(y), 1), 'LUFS, peak', round(20 * np.log10(np.abs(y).max()), 1), 'dBFS')
