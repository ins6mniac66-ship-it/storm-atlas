from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "og-app-views.png"
SCREENSHOTS = [
    ROOT / "public" / "screenshots" / "items.png",
    ROOT / "public" / "screenshots" / "build.png",
    ROOT / "public" / "screenshots" / "reference.png",
]
ICON = ROOT / "public" / "assets" / "storm-atlas-icon.png"
FONT_DIR = Path("/System/Library/Fonts/Supplemental")


def font(name: str, size: int):
    return ImageFont.truetype(FONT_DIR / name, size)


canvas = Image.new("RGB", (1200, 630), "#080c11")
draw = ImageDraw.Draw(canvas)

# App-like background grid, intentionally quiet so the real screens stay primary.
for x in range(0, 1201, 32):
    draw.line((x, 0, x, 630), fill="#0d1820", width=1)
for y in range(0, 631, 32):
    draw.line((0, y, 1200, y), fill="#0d1820", width=1)
draw.rectangle((0, 0, 10, 630), fill="#22c7e8")
draw.rectangle((10, 0, 18, 630), fill="#101d25")

# Left title block.
icon = Image.open(ICON).convert("RGBA")
icon.thumbnail((86, 86))
canvas.paste(icon, (58, 64), icon)
draw.text((58, 171), "STORM", font=font("Arial Black.ttf", 58), fill="#f5f7fa")
draw.text((58, 231), "ATLAS", font=font("Arial Black.ttf", 58), fill="#f5f7fa")
draw.rectangle((58, 311, 316, 315), fill="#22c7e8")
draw.text((58, 394), "Item lookup  •  Build tracking  •  Quick reference", font=font("Arial.ttf", 15), fill="#6f8190")

# Actual screenshots, treated as product evidence rather than invented UI.
positions = [(422, 66), (679, 66), (936, 66)]
labels = ["ITEMS", "BUILD", "REFERENCE"]
for source, (x, y), label in zip(SCREENSHOTS, positions, labels):
    shot = Image.open(source).convert("RGB")
    shot.thumbnail((230, 498), Image.Resampling.LANCZOS)
    framed = Image.new("RGB", (240, 510), "#111a24")
    framed.paste(shot, ((240 - shot.width) // 2, 8))
    framed = framed.filter(ImageFilter.UnsharpMask(radius=1, percent=110, threshold=2))
    draw.rounded_rectangle((x - 5, y - 5, x + 245, y + 515), radius=12, fill="#1e3341", outline="#2c5264", width=2)
    canvas.paste(framed, (x, y))
    draw.rounded_rectangle((x + 12, y + 17, x + 86, y + 40), radius=5, fill="#0a1118")
    draw.text((x + 20, y + 21), label, font=font("Arial Bold.ttf", 11), fill="#b8eaff")

draw.text((422, 588), "REAL APP VIEWS", font=font("Arial Bold.ttf", 13), fill="#22c7e8")
draw.text((563, 588), "Dense tools for a live run.", font=font("Arial.ttf", 13), fill="#91a2ae")
canvas.save(OUT, optimize=True)
print(OUT)
