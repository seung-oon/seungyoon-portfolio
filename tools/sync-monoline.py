"""Copy the Monoline design system into this site.

Usage: python tools/sync-monoline.py <path to the design system's project/ folder>

Writes styles/tokens.css (compiled from tokens.json), styles/monoline.css and
scripts/monoline.js. Run it again whenever the design system changes.
"""
import json, os, re, sys

src = sys.argv[1]
site = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t = json.load(open(os.path.join(src, 'tokens.json'), encoding='utf-8'))
themes = [th['id'] for th in t['color']['themes']]


def value(tok, theme):
    v = tok['value']
    v = v if isinstance(v, str) else v.get(theme, v[themes[0]])
    alias = re.fullmatch(r'\{(.+)\}', v)
    return 'var(--%s)' % alias.group(1) if alias else v


lines = ['/* Monoline — generated from tokens.json by tools/sync-monoline.py */']
for theme in themes:
    sel = ':root, [data-theme="%s"]' % theme if theme == themes[0] else '[data-theme="%s"]' % theme
    lines.append(sel + ' {')
    lines += ['  --%s: %s;' % (k['name'], value(k, theme)) for k in t['color']['tokens'] + t['shadow']['tokens']]
    lines.append('}')
lines.append(':root {')
for family in ('spacing', 'radius', 'duration', 'easing'):
    lines += ['  --%s: %s;' % (k['name'], k['value']) for k in t[family]['tokens']]
lines += ['  --font-%s: %s;' % (k, v) for k, v in t['type']['families'].items()]
lines.append('}')
open(os.path.join(site, 'styles', 'tokens.css'), 'w', encoding='utf-8', newline='\n').write('\n'.join(lines) + '\n')

# The font @import moves to <link> tags in index.html, so the stylesheet starts at the rules.
css = open(os.path.join(src, 'components', 'bundle.css'), encoding='utf-8').read()
css = re.sub(r"^@import url\([^)]*\);\s*", '', css)
open(os.path.join(site, 'styles', 'monoline.css'), 'w', encoding='utf-8', newline='\n').write(css)

js = open(os.path.join(src, 'components', 'bundle.js'), encoding='utf-8').read()
open(os.path.join(site, 'scripts', 'monoline.js'), 'w', encoding='utf-8', newline='\n').write(js)
print('synced from', src)
