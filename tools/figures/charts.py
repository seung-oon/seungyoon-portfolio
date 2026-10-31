"""Draw the two measured charts in the site's palette.

Usage: python charts.py <out-dir>
Fonts: Pretendard OTFs in tools/figures/fonts/ (not committed; fetch from
https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/).

dcc-steps: Mission 3 macro F1@0.5 per step, from DCC_Problem docs/MISSION3_FINAL_REPORT.md;
  the submitted checkpoint (0.6599) is the one packaged in ckpt/mission3.pt.
safedrug-clusters: SafeDrug adjusted mean Jaccard per diagnosis cluster, 4 seeds pooled,
  long_k10, from drug-recommendation-research track-04 results/tables/seeds_table_pooled_groups.csv.
"""
import os, sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, 'fonts')
for f in os.listdir(FONTS):
    fm.fontManager.addfont(os.path.join(FONTS, f))
plt.rcParams.update({'font.family': 'Pretendard', 'axes.unicode_minus': False})

PAPER, INK, MUTED, ACCENT = '#f4f4f2', '#0e0e0e', '#5b5b5d', '#1f5c49'
W, H, DPI = 16, 9, 100                      # 1600 x 900, the site's 16:9 frame


def frame():
    fig = plt.figure(figsize=(W, H), dpi=DPI, facecolor=PAPER)
    ax = fig.add_axes([0.07, 0.14, 0.86, 0.66], facecolor=PAPER)
    for s in ax.spines.values():
        s.set_visible(False)
    ax.tick_params(colors=MUTED, labelsize=17, length=0)
    return fig, ax


def dcc(out):
    steps = [('Plain BCE', 0.5967), ('pos_weight\npower 1.0', 0.6189), ('pos_weight\npower 0.5', 0.6496),
             ('+ TF-IDF', 0.6536), ('4-seed', 0.6546), ('TAPT\n+ LLRD', 0.6593), ('제출', 0.6599)]
    fig, ax = frame()
    xs = range(len(steps))
    ys = [v for _, v in steps]
    ax.step(xs, ys, where='mid', color=INK, lw=3)
    ax.plot([1.5, 2.5], [ys[2], ys[2]], color=ACCENT, lw=9, solid_capstyle='butt')
    for x, y in zip(xs, ys):
        ax.text(x, y + 0.0035, f'{y:.4f}', ha='center', va='bottom', fontsize=20,
                color=ACCENT if x == 2 else INK, fontweight='semibold')
    ax.set_xticks(list(xs), [n for n, _ in steps])
    ax.set_yticks([])
    ax.set_ylim(0.585, 0.672)
    ax.set_xlim(-0.6, len(steps) - 0.4)
    fig.text(0.07, 0.9, 'DCC 증상 분류 · Macro F1@0.5', fontsize=30, fontweight='extra bold', color=INK)
    fig.text(0.07, 0.845, '가장 큰 한 칸은 pos_weight power 0.5 (+0.0529). 제출 0.6599.', fontsize=19, color=MUTED)
    fig.savefig(out, facecolor=PAPER)


def safedrug(out):
    rows = [('안면외상·뇌동맥류', 0.5543), ('관상동맥질환·심근경색', 0.5480), ('전이암', 0.5393),
            ('수술 합병증', 0.5323), ('고혈압·정신과 약물', 0.5118), ('약물중독·긴 진단 목록', 0.5068),
            ('알코올성 간질환', 0.5031), ('심부전·만성신질환', 0.4972), ('심부전·말초혈관질환', 0.4943),
            ('호흡부전·폐렴·패혈증', 0.4876)]
    fig, ax = frame()
    ax.set_position([0.25, 0.08, 0.68, 0.72])
    ys = list(range(len(rows)))[::-1]
    vals = [v for _, v in rows]
    ax.hlines(ys, 0.48, vals, color='#d6d6d3', lw=10)
    for y, v in zip(ys, vals):
        top_or_bottom = v in (max(vals), min(vals))
        ax.plot(v, y, 'o', ms=15, color=ACCENT if top_or_bottom else INK)
        ax.text(v + 0.0015, y, f'{v:.3f}', va='center', fontsize=18,
                color=ACCENT if top_or_bottom else INK, fontweight='semibold')
    ax.set_yticks(ys, [n for n, _ in rows])
    ax.tick_params(axis='y', labelsize=18, colors=INK)
    ax.set_xticks([])
    ax.set_xlim(0.48, 0.565)
    fig.text(0.07, 0.9, 'SafeDrug 군집별 보정 Jaccard', fontsize=30, fontweight='extra bold', color=INK)
    fig.text(0.07, 0.845, '4개 시드 풀링. 같은 모델도 진단 군집에 따라 0.488에서 0.554까지 갈립니다.', fontsize=19, color=MUTED)
    fig.savefig(out, facecolor=PAPER)


if __name__ == '__main__':
    d = sys.argv[1]
    dcc(os.path.join(d, 'dcc-steps.png'))
    safedrug(os.path.join(d, 'safedrug-clusters.png'))
