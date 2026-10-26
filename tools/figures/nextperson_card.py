"""NextPerson illustration built only from facts in the repo README (not a game screenshot).

Case: DSR 67.3% over the 40% limit -> reject (borrower DSR rule). Rules: 25 s per customer,
ranks 사원 -> 지점장, 5 complaints ends the game.
Usage: python nextperson_card.py <out.webp>
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

out = sys.argv[1]
W, H, S = 1200, 675, 2
PAPER, SURFACE, SUNKEN, LINE = (250, 250, 249), (255, 255, 255), (241, 241, 239), (229, 229, 226)
STRONG, INK, MUTED = (138, 138, 133), (17, 18, 20), (92, 95, 102)
SIGNAL, SIGNAL_SOFT, DANGER, DANGER_SOFT = (15, 123, 95), (226, 243, 236), (180, 35, 24), (253, 236, 234)

img = Image.new('RGB', (W * S, H * S), PAPER)
d = ImageDraw.Draw(img)
F = lambda name, size: ImageFont.truetype('C:/Windows/Fonts/' + name, size * S)
kr, krb, krbig = F('malgun.ttf', 17), F('malgunbd.ttf', 19), F('malgunbd.ttf', 40)
mono, monob, monobig = F('consola.ttf', 14), F('consolab.ttf', 16), F('consolab.ttf', 30)
def R(x0, y0, x1, y1, r, **kw): d.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], r * S, **kw)
def T(x, y, s, f, c, anchor='la'): d.text((x * S, y * S), s, font=f, fill=c, anchor=anchor)

# monitor panel
R(56, 56, 760, 619, 16, fill=SURFACE, outline=LINE, width=2 * S)
R(56, 56, 760, 112, 16, fill=INK)
d.rectangle([56 * S, 96 * S, 760 * S, 112 * S], fill=INK)
T(84, 84, '고객 정보 검토', krb, PAPER, 'lm')
T(732, 84, 'CASE  DSR', mono, (157, 160, 166), 'rm')

T(88, 150, '총부채원리금상환비율 (DSR)', kr, MUTED)
T(88, 210, '67.3%', F('malgunbd.ttf', 64), DANGER, 'lm')
T(330, 214, '규제 한도 40%', krb, INK, 'lm')
# gauge: 0..100%
gx0, gx1, gy = 88, 728, 280
R(gx0, gy, gx1, gy + 18, 9, fill=SUNKEN)
R(gx0, gy, gx0 + (gx1 - gx0) * 0.673, gy + 18, 9, fill=DANGER)
lim = gx0 + (gx1 - gx0) * 0.40
d.line([lim * S, (gy - 12) * S, lim * S, (gy + 30) * S], fill=INK, width=3 * S)
T(lim, gy + 44, '40%', monob, INK, 'mm')
T(gx0, gy + 44, '0', mono, MUTED, 'lm')
T(gx1, gy + 44, '100%', mono, MUTED, 'rm')

# decision buttons
R(88, 392, 400, 452, 30, fill=SURFACE, outline=STRONG, width=2 * S)
T(244, 422, '처리완료', krb, MUTED, 'mm')
R(424, 392, 728, 452, 30, fill=INK)
T(576, 422, '거절', krb, PAPER, 'mm')
# result
R(88, 482, 728, 588, 12, fill=SIGNAL_SOFT)
T(112, 512, '정답', F('malgunbd.ttf', 16), SIGNAL, 'lm')
T(160, 512, '+10', monob, SIGNAL, 'lm')
T(112, 556, '근거: 차주별 DSR 규제 — 한도 40% 초과', krb, INK, 'lm')

# right column: timer, ranks, complaints
x0 = 808
T(x0, 74, '응대 제한시간', kr, MUTED, 'lm')
cx, cy, r = x0 + 54, 150, 50
d.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], outline=LINE, width=8 * S)
d.arc([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], -90, 210, fill=SIGNAL, width=8 * S)
T(cx, cy, '25s', monobig, INK, 'mm')
T(cx + 78, cy - 14, '손님 1명당', kr, MUTED, 'lm')
T(cx + 78, cy + 14, '시간 초과', krb, INK, 'lm')
T(cx + 78 + d.textlength('시간 초과 ', font=krb) / S, cy + 15, '-5', monob, DANGER, 'lm')

T(x0, 240, '직급', kr, MUTED, 'lm')
ranks = ['지점장', '부장', '차장', '과장', '대리', '주임', '사원']
for i, name in enumerate(ranks):
    y = 270 + i * 36
    on = i >= 4
    R(x0, y, x0 + 132, y + 28, 14, fill=INK if i == 4 else (SUNKEN if on else SURFACE), outline=None if on else LINE, width=2 * S)
    T(x0 + 66, y + 14, name, F('malgunbd.ttf', 15) if i == 4 else F('malgun.ttf', 15), PAPER if i == 4 else (INK if on else MUTED), 'mm')
T(x0 + 150, 284, '+10점씩', kr, MUTED, 'lm')
T(x0 + 150, 312, '승진', krb, INK, 'lm')

T(x0, 540, '불만', kr, MUTED, 'lm')
for i in range(5):
    cx2 = x0 + 12 + i * 30
    fill = DANGER if i < 2 else SURFACE
    d.ellipse([(cx2 - 10) * S, (566 - 10) * S, (cx2 + 10) * S, (566 + 10) * S], fill=fill, outline=DANGER, width=2 * S)
T(x0, 604, '5건이면 권고사직', krb, INK, 'lm')

# honesty tag
tag = 'ILLUSTRATION · README 사례'
R(W - 36 - 230, H - 44, W - 36, H - 16, 14, fill=SUNKEN)
T(W - 36 - 115, H - 30, tag, F('malgun.ttf', 13), MUTED, 'mm')

img.resize((W, H), Image.LANCZOS).save(out, 'WEBP', quality=90, method=6)
print('saved', out, os.path.getsize(out))
