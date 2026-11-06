"""One-off: builds the small self-hosted fonts in src/assets/fonts from the @fontsource packages.

Needs fonttools + brotli. Both families are SIL Open Font License.
Bodoni Moda is pinned to one optical size and weight; the page only uses it for display text.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
BM = ROOT / "node_modules/@fontsource-variable/bodoni-moda/files"
MR = ROOT / "node_modules/@fontsource-variable/manrope/files"
OUT = ROOT / "src/assets/fonts"

LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + "\u00a0ÂâÎîàáéèëöüäÄÖÜçñ²·×©«»°–—‘’“”„…"
LATIN_EXT = "ĂăȘșȚțŞşŢţ"
FEATURES = ["kern", "liga", "mark", "mkmk", "ccmp", "locl", "tnum"]

JOBS = [
    (BM / "bodoni-moda-latin-opsz-normal.woff2", "bodoni", {"opsz": 28, "wght": 400}, LATIN),
    (BM / "bodoni-moda-latin-ext-opsz-normal.woff2", "bodoni-ro", {"opsz": 28, "wght": 400}, LATIN_EXT),
    (BM / "bodoni-moda-latin-opsz-italic.woff2", "bodoni-italic", {"opsz": 28, "wght": 400}, LATIN),
    (BM / "bodoni-moda-latin-ext-opsz-italic.woff2", "bodoni-italic-ro", {"opsz": 28, "wght": 400}, LATIN_EXT),
    (MR / "manrope-latin-wght-normal.woff2", "manrope", {"wght": (400, 700)}, LATIN),
    (MR / "manrope-latin-ext-wght-normal.woff2", "manrope-ro", {"wght": (400, 700)}, LATIN_EXT),
]

for source, name, axes, chars in JOBS:
    font = TTFont(source)
    present = {axis.axisTag for axis in font["fvar"].axes}
    font = instancer.instantiateVariableFont(font, {k: v for k, v in axes.items() if k in present})
    # Glyphs without variation data would otherwise break the subsetter.
    if "gvar" in font:
        variations = font["gvar"].variations
        for glyph in font.getGlyphOrder():
            if glyph not in variations:
                variations[glyph] = []
    options = subset.Options(layout_features=FEATURES, hinting=False, desubroutinize=True)
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=chars)
    subsetter.subset(font)
    font.flavor = "woff2"
    target = OUT / f"{name}.woff2"
    font.save(target)
    print(f"{target.name}: {target.stat().st_size // 1024} KB")
