"""Render the V browser icon as PNG/ICO to match src/app/icon.svg. Run after changing the design:

    python scripts/render-icons.py

Writes src/app/favicon.ico (16/32/48 px, older browsers) and src/app/apple-icon.png (180 px, iOS).
"""
from pathlib import Path

from PIL import Image, ImageDraw

RED = (194, 31, 53)  # --signal
PAPER = (250, 251, 250)  # --signal-ink
V = [(5.5, 7), (11.7, 7), (16, 19.6), (20.3, 7), (26.5, 7), (19.4, 25), (12.6, 25)]

root = Path(__file__).resolve().parent.parent / "src" / "app"


def render(size: int, radius: float = 5, ss: int = 8) -> Image.Image:
    """Draw on a 32-unit grid at size*ss pixels, then downsample for clean edges."""
    big = size * ss
    k = big / 32
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, big - 1, big - 1], radius=radius * k, fill=RED)
    d.polygon([(x * k, y * k) for x, y in V], fill=PAPER)
    return img.resize((size, size), Image.LANCZOS)


render(48).save(root / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
# iOS masks its own rounded corners, so the touch icon is a full square.
render(180, radius=0).convert("RGB").save(root / "apple-icon.png", optimize=True)
print("wrote favicon.ico and apple-icon.png")
