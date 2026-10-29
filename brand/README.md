# Pragmatis · Identidad de marca

Símbolo **Ascenso**, paleta **Páramo** y eslogan **"Software que trabaja por tu negocio."**

| Fase | Carpeta | Abrir |
|---|---|---|
| 1. Estudio de marca | `01-estudio/` | `estudio-de-marca.md`, `index.html`, `paletas.html` (comparativa de paletas) |
| 2. Conceptos de símbolo | `02-logo/` | `preview.html` (6 conceptos; se eligió el 5) |
| 3. Logo final | `03-logo-final/` | `index.html` (variantes, favicon, perfil, Open Graph, PNG) |
| 4. Mockups | `04-mockups/` | `index.html`, `firma-correo.html`, `propuesta-portada.html` |
| 5. Guía de marca | `05-guia/` | `guia-de-marca.html` (documento único; imprimible a PDF) |
| 6. Tokens | `06-tokens/` | `tokens.css` (primitivos → semánticos → componentes) |

Todo es SVG/HTML hecho a mano, sin generadores de imágenes con IA. Los PNG se exportaron localmente desde los SVG con `rsvg-convert`.

## Regenerar el logo

`03-logo-final/_fuente/generar.py` produce todas las variantes, incluidos los textos convertidos a trazados. Requiere Python con `fonttools` y `uharfbuzz`, y la fuente Space Grotesk instanciada en los pesos 500 y 600 (`SG-500.ttf` y `SG-600.ttf`):

```bash
python -m venv .venv && .venv/bin/pip install fonttools uharfbuzz
# Descargar SpaceGrotesk[wght].ttf de github.com/google/fonts (ofl/spacegrotesk) e instanciar:
.venv/bin/fonttools varLib.instancer "SpaceGrotesk[wght].ttf" wght=500 -o fuentes/SG-500.ttf
.venv/bin/fonttools varLib.instancer "SpaceGrotesk[wght].ttf" wght=600 -o fuentes/SG-600.ttf
.venv/bin/python brand/03-logo-final/_fuente/generar.py fuentes brand/03-logo-final
```

Después de regenerar, vuelve a exportar los PNG que necesites (por ejemplo `rsvg-convert -w 1200 redes/og-1200x630.svg -o png/og-1200x630.png`) y cópialos a `public/` si cambian el favicon o la imagen Open Graph de la web.
