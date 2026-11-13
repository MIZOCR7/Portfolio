"""Rebuild every web image from the originals in D:\IMPORTANT\Admission\Certifications.

Run from the project root:  python tools/prepare-assets.py
Originals are never modified; every output is a new file under public/img/.
"""

from pathlib import Path

from PIL import Image, ImageOps

SRC = Path(r"D:\IMPORTANT\Admission\Certifications")
SHOW = SRC / "images and showcase stuff"
CAP = SHOW / "Capstone project images for the new green house"
OUT = Path("public/img")
ARCHIVE = OUT / "archive"
NEW = Path("tools/_pdf")  # raw PDF renders, not shipped


def save(im: Image.Image, path: Path, max_w=1400, quality=80) -> None:
    im = ImageOps.exif_transpose(im).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{path}  {im.width}x{im.height}  {path.stat().st_size // 1024} KB")


def trim_white(im: Image.Image, pad=18) -> Image.Image:
    """Crop the empty paper around a PDF page's content."""
    grey = im.convert("L")
    box = grey.point(lambda p: 255 if p < 244 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop(
        (max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad))
    )


# ── portraits ──────────────────────────────────────────────────────────
# The studio print carries a watermark in its lower corner; cropping to 4:5
# above it keeps the photograph itself untouched.
portrait = Image.open(SHOW / "my formal image.jpg")
save(portrait.crop((0, 0, portrait.width, int(portrait.width * 1.25))), OUT / "portrait.jpg", 720, 86)
save(Image.open(SHOW / "my best casual image with a suit.jpg"), OUT / "about.jpg", 520, 86)

# ── METU ───────────────────────────────────────────────────────────────
save(Image.open(SHOW / "image of the METU univeristy that I wanna involve in main image of it.jpg"),
     OUT / "metu-sign.jpg", 1400, 82)
save(Image.open(SHOW / "METU's Stadium.jpg"), OUT / "metu-stadium.jpg", 900, 82)

logo = ImageOps.exif_transpose(Image.open(SHOW / "METU logo.jpg")).convert("RGB")
logo = trim_white(logo, 4)
logo.save(OUT / "metu-logo.png", "PNG", optimize=True)
print(f"{OUT / 'metu-logo.png'}  {logo.width}x{logo.height}")

# ── certificates rendered from the PDFs ────────────────────────────────
save(trim_white(Image.open(NEW / "metu-ai-1.png")), OUT / "certs" / "metu-ai.jpg", 1400, 84)
save(trim_white(Image.open(NEW / "metu-logo-study-1.png")), OUT / "certs" / "metu-study.jpg", 1400, 86)
save(trim_white(Image.open(NEW / "physics-brawl-1.png")), OUT / "certs" / "physics.jpg", 1400, 84)

# ── the visual archive ─────────────────────────────────────────────────
archive = [
    (CAP / "our team image.jpg", "team.jpg"),
    (CAP / "project_image1 (1).jpg", "build-1.jpg"),
    (CAP / "project_image1 (2).jpg", "build-2.jpg"),
    (CAP / "project_image1 (3).jpg", "build-3.jpg"),
    (CAP / "project_image1 (4).jpg", "build-4.jpg"),
    (SHOW / "acpc1.jpg", "contest-1.jpg"),
    (SHOW / "acpc2.jpg", "contest-2.jpg"),
    (SHOW / "3D design of ISEF project (1).jpg", "model-1.jpg"),
    (SHOW / "3D design of ISEF project (4).jpg", "model-2.jpg"),
]

# Deliberately not published:
#   Doctor Sinan Kalkan…png — a third party's portrait, no consent on file
#   Geology club/*.PNG, قصر القفاقة/*.jpg — already on the wall as certificates
#   Be My Eyes/*.jpg — a screenshot of an app profile, not a photograph
#   my best casual image with a suit.jpg — reused as img/about.jpg

for src, name in archive:
    if not src.exists():
        print("missing", src)
        continue
    save(Image.open(src), ARCHIVE / name, 1200, 80)


# ── sharing card ───────────────────────────────────────────────────────
def og_card() -> None:
    """1200x630 preview: name at the size it deserves, portrait on the right."""
    from PIL import ImageDraw, ImageFont

    W, H = 1200, 630
    card = Image.new("RGB", (W, H), (242, 239, 232))
    draw = ImageDraw.Draw(card)
    serif = ImageFont.truetype(r"C:\Windows\Fonts\georgia.ttf", 116)
    serif_it = ImageFont.truetype(r"C:\Windows\Fonts\georgiai.ttf", 116)
    mono = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 19)

    draw.text((76, 92), "Ziad Emad", font=serif, fill=(19, 18, 15))
    draw.text((76, 214), "Ahmed", font=serif_it, fill=(169, 72, 31))
    draw.text((78, 372), "COMPUTER VISION  ·  EMBEDDED AI", font=mono, fill=(75, 71, 64))
    draw.text((78, 402), "STEM OCTOBER, EGYPT  ·  ANKARA, 2027", font=mono, fill=(75, 71, 64))
    draw.line([(78, 452), (560, 452)], fill=(19, 18, 15), width=2)
    draw.text((78, 476), "ISEF finalist 2026  ·  ICPC Teens, 31st", font=mono, fill=(124, 118, 106))

    shot = Image.open(OUT / "portrait.jpg").convert("RGB")
    tw = 420
    shot = shot.resize((tw, round(shot.height * tw / shot.width)), Image.LANCZOS)
    top = (H - shot.height) // 2
    card.paste(shot, (W - tw - 70, top))
    card.save(Path("public/og.jpg"), "JPEG", quality=88, optimize=True)
    print(f"public/og.jpg  {W}x{H}  {Path('public/og.jpg').stat().st_size // 1024} KB")


og_card()
