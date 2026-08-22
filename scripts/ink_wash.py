# -*- coding: utf-8 -*-
"""사진 → 수묵화(水墨畫) 변환.
사용: python scripts/ink_wash.py [입력] [출력]
기본: src/assets/minhwa-art/sejong_src.jpg → src/assets/minhwa-art/sejong_ink.jpg
  (sejong_src.* 가 없으면 world-art/sejong.jpg(남극 명화)로 임시본을 만든다)
기법: 명도 분리 → 먹 농담(포스터라이즈+번짐) + 윤곽 붓선 + 한지 착색 + 종이 결 + 여백 바램
"""
import sys, glob, os
from PIL import Image, ImageFilter, ImageOps, ImageChops, ImageEnhance

src = sys.argv[1] if len(sys.argv) > 1 else None
out = sys.argv[2] if len(sys.argv) > 2 else 'src/assets/minhwa-art/sejong_ink.jpg'
if src is None:
    cands = glob.glob('src/assets/minhwa-art/sejong_src.*')
    src = cands[0] if cands else 'src/assets/world-art/sejong.jpg'
print('input:', src)

im = Image.open(src).convert('RGB')
if im.width > 2000:
    im = im.resize((2000, round(im.height * 2000 / im.width)), Image.LANCZOS)
W, H = im.size

# 1) 명도 — 먹 농담의 바탕. 하늘처럼 밝은 곳은 거의 비운다
g = ImageOps.grayscale(im)
g = ImageOps.autocontrast(g, cutoff=2)
# 먹은 아껴 쓴다 — 중간 밝기는 옅은 담묵, 밝은 곳은 종이 여백. 감마로 그림자를 들어 올린 뒤 4단으로
lift = g.point(lambda v: int(255 * (v / 255) ** 0.6))
tone = lift.filter(ImageFilter.GaussianBlur(2.0))
def level(v):
    if v < 60: return 52      # 농묵
    if v < 115: return 118    # 중묵
    if v < 175: return 190    # 담묵
    return 255                # 여백
tone = tone.point(level)
tone = tone.filter(ImageFilter.GaussianBlur(2.6))  # 번짐

# 2) 붓선 — 윤곽을 굵고 거칠게
edges = g.filter(ImageFilter.GaussianBlur(1)).filter(ImageFilter.FIND_EDGES)
edges = ImageOps.autocontrast(edges, cutoff=2)
edges = edges.point(lambda v: 255 if v > 46 else 0)
edges = edges.filter(ImageFilter.GaussianBlur(0.7))
ink_lines = ImageOps.invert(edges).point(lambda v: 90 + int(v * 0.65))  # 선=진먹(완전 검정은 피함)

# 3) 합성 — 농담 × 선
ink = ImageChops.multiply(tone, ink_lines)
# 먹의 결: 미세 노이즈
noise = Image.effect_noise((W, H), 18).filter(ImageFilter.GaussianBlur(0.6))
ink = ImageChops.multiply(ink, noise.point(lambda v: 205 + v // 5))

# 4) 한지 착색 + 종이 결
paper_col = (241, 231, 208)
ink_col = (38, 32, 28)
tinted = ImageOps.colorize(ink, black=ink_col, white=paper_col, mid=(120, 108, 96))
grain = Image.effect_noise((W, H), 30).filter(ImageFilter.GaussianBlur(1.4))
grain = ImageOps.autocontrast(grain).point(lambda v: 225 + v // 9)
tinted = ImageChops.multiply(tinted, Image.merge('RGB', (grain, grain, grain)))

# 5) 여백 바램 — 가장자리로 갈수록 종이에 스민다
vign = Image.new('L', (W, H), 0)
from PIL import ImageDraw
d = ImageDraw.Draw(vign)
d.ellipse((-W * 0.15, -H * 0.25, W * 1.15, H * 1.25), fill=255)
vign = vign.filter(ImageFilter.GaussianBlur(W * 0.12))
paper = Image.new('RGB', (W, H), paper_col)
final = Image.composite(tinted, paper, vign.point(lambda v: 70 + int(v * 0.73)))

final.save(out, quality=82, optimize=True)
print('saved', out, final.size, round(os.path.getsize(out) / 1024), 'KB')
