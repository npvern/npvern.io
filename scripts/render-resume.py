"""Render public/resume.pdf to public/resume.png for browsers that cannot show a PDF inline
(most phones). Run again whenever resume.pdf changes:

    pip install pypdfium2
    python scripts/render-resume.py
"""
from pathlib import Path

import pypdfium2 as pdfium

root = Path(__file__).resolve().parent.parent
pdf = pdfium.PdfDocument(root / "public" / "resume.pdf")
page = pdf[0]
# 1700 px wide: sharp on 2x phone screens, still a small file.
scale = 1700 / page.get_size()[0]
image = page.render(scale=scale).to_pil().convert("RGB")
out = root / "public" / "resume.png"
image.save(out, optimize=True)
print(f"wrote {out.relative_to(root)} {image.size[0]}x{image.size[1]}")
