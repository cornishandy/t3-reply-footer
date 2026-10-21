"""Contrast of the footer pills and verdict text (WCAG 2), light and dark, as color-mix(in srgb) composes them.
Run: python3 -I contrast.py   (exit 1 if any pair is under 4.5:1)"""
import sys
def hx(s): s=s.lstrip('#'); return [int(s[i:i+2],16)/255 for i in (0,2,4)]
def mix(a,b,p): return [x*p+y*(1-p) for x,y in zip(a,b)]
def lum(c): return sum(w*((v/12.92) if v<=0.04045 else ((v+0.055)/1.055)**2.4) for w,v in zip((0.2126,0.7152,0.0722),c))
def ratio(a,b): la,lb=sorted((lum(a),lum(b)),reverse=True); return (la+0.05)/(lb+0.05)
# T3 theme: light card #ffffff, foreground neutral-950 (oklch 14.5%) ~ #0a0a0a;
# dark background #0a0a0a, card = mix(background 97%, white) ~ #111111, foreground neutral-100 ~ #f5f5f5.
THEMES = {'light': dict(card=hx('ffffff'), fg=hx('0a0a0a')), 'dark': dict(card=mix(hx('0a0a0a'), hx('ffffff'), .97), fg=hx('f5f5f5'))}
PILLS = {  # key: (light colour, dark colour)
  'opus': ('c2410c','fb923c'), 'fable': ('be185d','f472b6'), 'haiku': ('a16207','facc15'), 'sonnet': ('b45309','fbbf24'),
  'sol': ('15803d','4ade80'), 'astra': ('0f766e','2dd4bf'), 'grok': ('475569','94a3b8'), 'gemini': ('2563eb','60a5fa'), 'flash': ('0e7490','22d3ee')}
TEXT = {'settle-no': ('dc2626','f87171'), 'settle-yes': ('15803d','4ade80'), 'failed': ('dc2626','f87171')}
fails = 0
for theme, t in THEMES.items():
    i = 0 if theme == 'light' else 1
    for k, cs in PILLS.items():
        c = hx(cs[i]); bg = mix(c, t['card'], .15); fg = mix(c, t['fg'], .78 if theme == 'light' else .85)
        r = ratio(fg, bg); fails += r < 4.5
        print(f'{theme:5} pill {k:7} {r:5.2f}' + ('  FAIL' if r < 4.5 else ''))
    head = mix(t['fg'], t['card'], .05)  # tinted verdict header
    for k, cs in TEXT.items():
        c = hx(cs[i]); fg = mix(c, t['fg'], .85); bg = head if k.startswith('settle') else t['card']
        r = ratio(fg, bg); fails += r < 4.5
        print(f'{theme:5} text {k:10} {r:5.2f}' + ('  FAIL' if r < 4.5 else ''))
print('contrast:', 'all >= 4.5' if not fails else f'{fails} under 4.5'); sys.exit(1 if fails else 0)
