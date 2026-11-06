"""One-off: builds the small self-hosted fonts in src/assets/fonts from the @fontsource packages.

Needs fonttools + brotli. Both families are SIL Open Font License.
Newsreader is pinned to one optical size and one weight per style; the page only
uses it for display text. Text is limited to the characters Romanian and English need.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
NR = ROOT / "node_modules/@fontsource-variable/newsreader/files"
IS = ROOT / "node_modules/@fontsource-variable/instrument-sans/files"
OUT = ROOT / "src/assets/fonts"

LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + " ÂâÎîàáéèëöüäÄÖÜçñ²·×©«»°–—‘’“”„…"
LATIN_EXT = "ĂăȘșȚțŞşŢţ"

JOBS = [
    (NR / "newsreader-latin-opsz-normal.woff2", "newsreader", {"opsz": 36, "wght": 350}, LATIN),
    (NR / "newsreader-latin-ext-opsz-normal.woff2", "newsreader-ro", {"opsz": 36, "wght": 350}, LATIN_EXT),
    (NR / "newsreader-latin-opsz-italic.woff2", "newsreader-italic", {"opsz": 36, "wght": 300}, LATIN),
    (NR / "newsreader-latin-ext-opsz-italic.woff2", "newsreader-italic-ro", {"opsz": 36, "wght": 300}, LATIN_EXT),
    (IS / "instrument-sans-latin-wght-normal.woff2", "instrument-sans", {"wght": (400, 600)}, LATIN),
    (IS / "instrument-sans-latin-ext-wght-normal.woff2", "instrument-sans-ro", {"wght": (400, 600)}, LATIN_EXT),
]

for source, name, axes, chars in JOBS:
    font = TTFont(source)
    available = {axis.axisTag for axis in font["fvar"].axes}
    font = instancer.instantiateVariableFont(font, {k: v for k, v in axes.items() if k in available})
    options = subset.Options(layout_features=["*"], hinting=False, desubroutinize=True)
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=chars)
    subsetter.subset(font)
    font.flavor = "woff2"
    target = OUT / f"{name}.woff2"
    font.save(target)
    print(f"{target.name}: {target.stat().st_size // 1024} KB")
