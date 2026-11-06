"""One-off: builds the small self-hosted fonts in src/assets/fonts from the @fontsource packages.

Needs fonttools + brotli. Both families are SIL Open Font License.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
OF = ROOT / "node_modules/@fontsource-variable/outfit/files"
WS = ROOT / "node_modules/@fontsource-variable/work-sans/files"
OUT = ROOT / "src/assets/fonts"

LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + " ÂâÎîàáéèëöüäÄÖÜçñ²·×©«»°–—‘’“”„…"
LATIN_EXT = "ĂăȘșȚțŞşŢţ"

# Only the features the page uses; Work Sans has tabular glyphs that break a full-feature subset.
DISPLAY_FEATURES = ["kern", "liga", "mark", "mkmk", "ccmp", "locl"]

JOBS = [
    (OF / "outfit-latin-wght-normal.woff2", "outfit", {"wght": (300, 600)}, LATIN),
    (OF / "outfit-latin-ext-wght-normal.woff2", "outfit-ro", {"wght": (300, 600)}, LATIN_EXT),
    (WS / "work-sans-latin-wght-normal.woff2", "work-sans", {"wght": (400, 600)}, LATIN),
    (WS / "work-sans-latin-ext-wght-normal.woff2", "work-sans-ro", {"wght": (400, 600)}, LATIN_EXT),
]

for source, name, axes, chars in JOBS:
    font = instancer.instantiateVariableFont(TTFont(source), axes)
    options = subset.Options(layout_features=DISPLAY_FEATURES, hinting=False, desubroutinize=True)
    options.flavor = "woff2"
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=chars)
    subsetter.subset(font)
    font.flavor = "woff2"
    target = OUT / f"{name}.woff2"
    font.save(target)
    print(f"{target.name}: {target.stat().st_size // 1024} KB")
