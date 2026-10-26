"""Draw Safe-walk's own OSM walk network around Seoul City Hall with the score API's radii.

Usage: python safewalk_map.py <seoul.osm> <out.webp>
Center 37.5665, 126.978 is the example coordinate in Safe-walk's API docs.
Radii come from SafetyQueryService: CCTV / crime zone 150 m, security light / safety bell 100 m.
"""
import math, sys, json, os
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
LAT0, LNG0 = 37.5665, 126.978
W, H, SS = 1200, 675, 2                     # output size, supersampling
M_PER_PX = 0.62                             # ~744 m x 419 m view
M_LAT = 111320.0
M_LNG = 111320.0 * math.cos(math.radians(LAT0))
half_w_m, half_h_m = W * M_PER_PX / 2, H * M_PER_PX / 2
pad = 1.25
lat_min, lat_max = LAT0 - half_h_m * pad / M_LAT, LAT0 + half_h_m * pad / M_LAT
lng_min, lng_max = LNG0 - half_w_m * pad / M_LNG, LNG0 + half_w_m * pad / M_LNG

cache = os.path.splitext(out)[0] + '.ways.json'
if os.path.exists(cache):
    ways = json.load(open(cache))
else:
    nodes, ways = {}, []
    for ev, el in ET.iterparse(src, events=('end',)):
        if el.tag == 'node':
            lat, lon = float(el.get('lat')), float(el.get('lon'))
            if lat_min <= lat <= lat_max and lng_min <= lon <= lng_max:
                nodes[el.get('id')] = (lat, lon)
            el.clear()
        elif el.tag == 'way':
            hw = None
            for t in el.iter('tag'):
                if t.get('k') == 'highway':
                    hw = t.get('v')
            if hw:
                pts = [nodes[n.get('ref')] for n in el.iter('nd') if n.get('ref') in nodes]
                if len(pts) >= 2:
                    ways.append([hw, pts])
            el.clear()
        elif el.tag == 'relation':
            break                                # relations come last; nothing more to read
    json.dump(ways, open(cache, 'w'))
print('ways', len(ways))

def xy(lat, lng):
    return ((W / 2 + (lng - LNG0) * M_LNG / M_PER_PX) * SS, (H / 2 - (lat - LAT0) * M_LAT / M_PER_PX) * SS)

PAPER, MINOR, MAJOR, WALK = (250, 250, 249), (214, 214, 209), (190, 190, 184), (168, 168, 162)
SIGNAL, INK, MUTED = (15, 123, 95), (17, 18, 20), (92, 95, 102)
style = {  # class -> (color, width px)
    'motorway': (MAJOR, 11), 'trunk': (MAJOR, 11), 'primary': (MAJOR, 10), 'secondary': (MAJOR, 8),
    'tertiary': (MINOR, 6), 'residential': (MINOR, 4), 'unclassified': (MINOR, 4), 'service': (MINOR, 3),
    'living_street': (MINOR, 4), 'pedestrian': (WALK, 3), 'footway': (WALK, 2), 'path': (WALK, 2),
    'steps': (WALK, 2), 'crossing': (WALK, 2), 'cycleway': (WALK, 2),
}
img = Image.new('RGB', (W * SS, H * SS), PAPER)
d = ImageDraw.Draw(img, 'RGBA')
order = sorted(ways, key=lambda w: -style.get(w[0], (MINOR, 1))[1])
for hw, pts in order:
    hw = hw.replace('_link', '')
    color, width = style.get(hw, (MINOR, 2))
    d.line([xy(*p) for p in pts], fill=color, width=width * SS, joint='curve')

cx, cy = xy(LAT0, LNG0)
for r_m, alpha, w in ((150, 22, 3), (100, 30, 2)):
    r = r_m / M_PER_PX * SS
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=SIGNAL + (alpha,), outline=SIGNAL + (255,), width=w * SS)
d.ellipse([cx - 9 * SS, cy - 9 * SS, cx + 9 * SS, cy + 9 * SS], fill=(255, 255, 255))
d.ellipse([cx - 6 * SS, cy - 6 * SS, cx + 6 * SS, cy + 6 * SS], fill=SIGNAL)

mono = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 15 * SS)
kr = ImageFont.truetype('C:/Windows/Fonts/malgunbd.ttf', 17 * SS)
krs = ImageFont.truetype('C:/Windows/Fonts/malgun.ttf', 14 * SS)
def label(x, y, text, font, fill):
    bx = d.textbbox((x, y), text, font=font)
    d.rounded_rectangle([bx[0] - 8 * SS, bx[1] - 5 * SS, bx[2] + 8 * SS, bx[3] + 5 * SS], 6 * SS, fill=(250, 250, 249, 235))
    d.text((x, y), text, font=font, fill=fill)
label(cx + 150 / M_PER_PX * SS * 0.72 + 10 * SS, cy - 150 / M_PER_PX * SS * 0.72 - 24 * SS, '150 m', mono, SIGNAL)
label(cx + 100 / M_PER_PX * SS * 0.72 + 10 * SS, cy - 100 / M_PER_PX * SS * 0.72 - 6 * SS, '100 m', mono, SIGNAL)
label(28 * SS, (H - 86) * SS, '반경 기반 안전 인프라 집계', kr, INK)
label(28 * SS, (H - 50) * SS, 'CCTV·범죄주의구역 150 m  ·  보안등·안심벨 100 m', krs, MUTED)
tag = 'OSM walk network · 37.5665, 126.978'
label(W * SS - d.textlength(tag, font=mono) - 36 * SS, 26 * SS, tag, mono, MUTED)

img = img.resize((W, H), Image.LANCZOS)
img.save(out, 'WEBP', quality=88, method=6)
print('saved', out, os.path.getsize(out))
