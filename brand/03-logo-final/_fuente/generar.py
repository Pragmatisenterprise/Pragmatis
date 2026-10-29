"""Genera las variantes finales del logo Pragmatis (paleta Páramo) como SVG.

Uso: python -I gen.py <dir_fuentes> <dir_salida>
Todo el texto se convierte a trazados con HarfBuzz (kerning real) + fontTools.
"""
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONTS, OUT = Path(sys.argv[1]), Path(sys.argv[2])

# ---- Paleta Páramo -------------------------------------------------------
TINTA, PAPEL, BLANCO = "#0E1511", "#F4F2EB", "#FFFFFF"
VERDE, VERDE_LUZ, PUENTE, MAIZ, OCRE, INICIO_OSCURO = "#1C5A43", "#6CC19A", "#3C8C68", "#E3B23C", "#A87B12", "#2F7A5A"
GRIS_OSCURO = "#A7AFA8"  # texto secundario sobre tinta

GRADS = {
    # sobre fondos claros: todas las paradas >= 3:1 contra papel
    "claro": [(0, VERDE), (0.55, PUENTE), (1, OCRE)],
    # sobre fondos oscuros: todas las paradas >= 3:1 contra tinta
    "oscuro": [(0, INICIO_OSCURO), (0.55, VERDE_LUZ), (1, MAIZ)],
}

# ---- Símbolo Ascenso (retícula 64): escalera como polígono relleno --------
SYMBOL = "M8 57H27V43H41V29H55V6H45V19H31V33H17V47H8Z"
SX0, SY0, SX1, SY1 = 8, 6, 55, 57  # caja dibujada
SW, SH = SX1 - SX0, SY1 - SY0


def grad_def(gid, kind, x1, y1, x2, y2):
    stops = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in GRADS[kind])
    return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" '
            f'x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}">{stops}</linearGradient>')


def symbol_group(x, y, h, fill, gid=None, kind=None):
    """Símbolo con su caja dibujada en (x, y) y alto h. Devuelve (svg, defs, ancho)."""
    k = h / SH
    tx, ty = x - SX0 * k, y - SY0 * k
    defs = ""
    if kind:
        # degradado diagonal de abajo-izquierda a arriba-derecha en coordenadas del símbolo
        defs = grad_def(gid, kind, SX0, SY1, SX1, SY0)
        fill = f"url(#{gid})"
    g = f'<path transform="translate({tx:.2f} {ty:.2f}) scale({k:.4f})" fill="{fill}" d="{SYMBOL}"/>'
    return g, defs, SW * k


# ---- Texto a trazados ---------------------------------------------------
_cache = {}


def _font(weight):
    if weight not in _cache:
        path = FONTS / f"SG-{weight}.ttf"
        blob = hb.Blob.from_file_path(str(path))
        _cache[weight] = (TTFont(path), hb.Font(hb.Face(blob)))
    return _cache[weight]


def text_path(text, size, weight=600, tracking=-0.02):
    """Devuelve (d, bounds) con la línea base en y=0 y el origen en x=0."""
    tt, hbfont = _font(weight)
    upem = tt["head"].unitsPerEm
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": True})
    gs = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    s = size / upem
    pen, bpen = SVGPathPen(gs), BoundsPen(gs)
    x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        t = (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s)
        gs[name].draw(TransformPen(pen, t))
        gs[name].draw(TransformPen(bpen, t))
        x += pos.x_advance + tracking * upem
    return pen.getCommands(), bpen.bounds


def svg(w, h, body, defs="", title="Pragmatis"):
    d = f"<defs>{defs}</defs>" if defs else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{d}{body}</svg>\n')


def write(rel, content):
    p = OUT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content)


def bg(w, h, color, rx=0):
    return f'<rect width="{w}" height="{h}" rx="{rx}" fill="{color}"/>' if color else ""


# ---- 1. Símbolo solo ----------------------------------------------------
PAD = 8  # margen en la retícula de 64 para los archivos con fondo
symbols = {
    # nombre: (fondo, color símbolo, degradado)
    "simbolo-tinta": (None, TINTA, None),
    "simbolo-papel": (None, PAPEL, None),
    "simbolo-blanco-sobre-negro": (TINTA, BLANCO, None),
    "simbolo-negro-sobre-blanco": (BLANCO, TINTA, None),
    "simbolo-una-tinta-verde": (None, VERDE, None),
    "simbolo-degradado-claro": (None, None, "claro"),
    "simbolo-degradado-oscuro": (None, None, "oscuro"),
}
for name, (bgc, color, kind) in symbols.items():
    if bgc:
        size = 64
        g, defs, _ = symbol_group((size - SW * 0.8) / 2, (size - SH * 0.8) / 2, SH * 0.8, color, "g", kind)
        write(f"simbolo/{name}.svg", svg(size, size, bg(size, size, bgc) + g, defs, "Pragmatis · símbolo"))
    else:
        g, defs, _ = symbol_group(0, 0, SH, color, "g", kind)
        write(f"simbolo/{name}.svg", svg(SW, SH, g, defs, "Pragmatis · símbolo"))

# ---- 2. Lockup horizontal ----------------------------------------------
F = 100                    # cuerpo del nombre
CAP = 0.70 * F             # altura de mayúsculas de Space Grotesk (700/1000)
SYM_H = 1.4 * CAP          # el símbolo mide 1.4 veces la altura de mayúscula
GAP = 0.32 * F             # espacio entre símbolo y nombre
word_d, (wx0, wy0, wx1, wy1) = text_path("Pragmatis", F)


def lockup(text_color, sym_color, kind, bgc=None, pad=0):
    # línea base en y=0; el símbolo se centra en la altura de mayúscula
    sym_y = -CAP / 2 - SYM_H / 2
    top = min(sym_y, wy0)
    bottom = max(sym_y + SYM_H, wy1)
    g, defs, sw = symbol_group(pad, pad - top + sym_y, SYM_H, sym_color, "g", kind)
    tx = pad + sw + GAP - wx0
    ty = pad - top
    word = f'<path transform="translate({tx:.2f} {ty:.2f})" fill="{text_color}" d="{word_d}"/>'
    w = pad * 2 + sw + GAP + (wx1 - wx0)
    h = pad * 2 + (bottom - top)
    return svg(w, h, bg(w, h, bgc) + g + word, defs, "Pragmatis")


lockups = {
    "lockup-tinta": (TINTA, TINTA, None, None, 0),
    "lockup-papel": (PAPEL, PAPEL, None, None, 0),
    "lockup-blanco-sobre-negro": (BLANCO, BLANCO, None, TINTA, 60),
    "lockup-negro-sobre-blanco": (TINTA, TINTA, None, BLANCO, 60),
    "lockup-una-tinta-verde": (VERDE, VERDE, None, None, 0),
    "lockup-degradado-claro": (TINTA, None, "claro", None, 0),
    "lockup-degradado-oscuro": (PAPEL, None, "oscuro", None, 0),
    "lockup-degradado-sobre-papel": (TINTA, None, "claro", PAPEL, 60),
    "lockup-degradado-sobre-tinta": (PAPEL, None, "oscuro", TINTA, 60),
}
for name, args in lockups.items():
    write(f"lockup/{name}.svg", lockup(*args))

# ---- 3. Favicon e íconos de app ---------------------------------------


def icon(size, bgc, color, kind, rx, ratio):
    h = size * ratio
    g, defs, sw = symbol_group((size - SW * h / SH) / 2, (size - h) / 2, h, color, "g", kind)
    return svg(size, size, bg(size, size, bgc, rx) + g, defs, "Pragmatis")


# Favicon dibujado a mano sobre retícula de 16 px (bordes nítidos a 16 y 32 px)
FAV = "M3 13H7V10H10V7H13V2H11V5H8V8H5V11H3Z"
write("favicon/favicon.svg", svg(16, 16, bg(16, 16, VERDE, 3.5) + f'<path fill="{PAPEL}" d="{FAV}"/>', "", "Pragmatis"))
write("favicon/apple-touch-icon.svg", icon(180, VERDE, PAPEL, None, 0, 0.5))
write("favicon/icon-512-maskable.svg", icon(512, VERDE, PAPEL, None, 0, 0.42))

# ---- 4. Fotos de perfil (1080, seguras en círculo) ----------------------
write("perfil/perfil-oscuro.svg", icon(1080, TINTA, None, "oscuro", 0, 0.44))
write("perfil/perfil-verde.svg", icon(1080, VERDE, PAPEL, None, 0, 0.44))
write("perfil/perfil-maiz.svg", icon(1080, MAIZ, TINTA, None, 0, 0.44))

# ---- 5. Open Graph 1200x630 --------------------------------------------
W, H = 1200, 630
parts, defs = [bg(W, H, TINTA)], []

# Escalera grande a la derecha, sangrando por abajo y por la derecha
big, d_big, _ = symbol_group(800, 172, 470, None, "gbig", "oscuro")
parts.append(f'<g opacity=".95">{big}</g>')
defs.append(d_big)

# Lockup arriba a la izquierda (cuerpo 44)
ls = 0.44
sym_h, cap = SYM_H * ls, CAP * ls
g, d_lock, sw = symbol_group(80, 80, sym_h, None, "glock", "oscuro")
defs.append(d_lock)
parts.append(g)
base = 80 + sym_h / 2 + cap / 2
parts.append(f'<path transform="translate({80 + sw + GAP * ls - wx0 * ls:.2f} {base:.2f}) scale({ls})" fill="{PAPEL}" d="{word_d}"/>')

# Titular
for i, line in enumerate(["Software que trabaja", "por tu negocio."]):
    d, _ = text_path(line, 70, 600, -0.025)
    parts.append(f'<path transform="translate(80 {318 + i * 82})" fill="{PAPEL}" d="{d}"/>')

# Línea inferior
d, _ = text_path("Páginas web · Apps · Automatización para pymes", 24, 500, 0)
parts.append(f'<path transform="translate(80 548)" fill="{GRIS_OSCURO}" d="{d}"/>')
d, _ = text_path("pragmatis.co", 24, 500, 0)
parts.append(f'<path transform="translate(80 584)" fill="{MAIZ}" d="{d}"/>')

write("redes/og-1200x630.svg", svg(W, H, "".join(parts), "".join(defs),
                                   "Pragmatis · Software que trabaja por tu negocio"))
print("ok")

# ---- 6. Plantillas de publicación (fase 4) ------------------------------
TEXTO2 = "#59615A"


def lockup_at(x, y, scale, text_color, kind, gid):
    """Lockup con la esquina superior izquierda del símbolo en (x, y)."""
    sym_h, cap = SYM_H * scale, CAP * scale
    g, d, sw = symbol_group(x, y, sym_h, None, gid, kind)
    base = y + sym_h / 2 + cap / 2
    word = f'<path transform="translate({x + sw + GAP * scale - wx0 * scale:.2f} {base:.2f}) scale({scale})" fill="{text_color}" d="{word_d}"/>'
    return g + word, d


def lines(texts, x, y0, size, lead, color, weight=600, tracking=-0.025):
    out = []
    for i, t in enumerate(texts):
        d, _ = text_path(t, size, weight, tracking)
        out.append(f'<path transform="translate({x} {y0 + i * lead:.2f})" fill="{color}" d="{d}"/>')
    return "".join(out)


# Publicación 1080x1080 · fondo papel
S = 1080
body, defs = [bg(S, S, PAPEL)], []
big, d = symbol_group(640, 560, 560, None, "gpost", "claro")[:2]
body.append(big); defs.append(d)
lk, d = lockup_at(80, 80, 0.5, TINTA, "claro", "gpostl"); body.append(lk); defs.append(d)
body.append(lines(["¿Tu negocio", "todavía vive", "en Excel?"], 80, 400, 96, 104, TINTA))
body.append(lines(["Lo automatizamos por ti."], 80, 690, 38, 0, TEXTO2, 500, 0))
body.append(lines(["pragmatis.co"], 80, 1000, 30, 0, VERDE, 500, 0))
write("redes/publicacion-1080.svg", svg(S, S, "".join(body), "".join(defs), "Pragmatis · publicación"))

# Historia 1080x1920 · fondo tinta
W2, H2 = 1080, 1920
body, defs = [bg(W2, H2, TINTA)], []
big, d = symbol_group(560, 1300, 700, None, "gsto", "oscuro")[:2]
body.append(big); defs.append(d)
lk, d = lockup_at(90, 150, 0.6, PAPEL, "oscuro", "gstol"); body.append(lk); defs.append(d)
body.append(lines(["Software", "que trabaja", "por tu", "negocio."], 90, 620, 132, 142, PAPEL))
body.append(lines(["Páginas web, apps y automatización", "para pymes en Colombia."], 90, 1200, 40, 56, GRIS_OSCURO, 500, 0))
cta_d, (cx0, _, cx1, _) = text_path("Agenda una asesoría", 40, 600, -0.01)
cw = cx1 - cx0 + 96
body.append(f'<rect x="90" y="1390" width="{cw:.0f}" height="104" rx="22" fill="{MAIZ}"/>')
body.append(f'<path transform="translate({90 + 48 - cx0:.2f} 1456)" fill="{TINTA}" d="{cta_d}"/>')
write("redes/historia-1080x1920.svg", svg(W2, H2, "".join(body), "".join(defs), "Pragmatis · historia"))
print("plantillas ok")
