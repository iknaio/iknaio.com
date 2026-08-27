"""Cover for the CSAM Checker post.

The checker sits at the left; each dashed ring is one further remove from the address
it was given (same cluster, direct neighbours, neighbouring clusters). Green is an
ordinary address, red one carrying a CSAM tag: the point of the picture is that the red
ones turn up at every distance, and the distance is what the checker reports.

The mark at the centre is the plugin's own icon, a shield carrying a check, taken from
the current CSAM Check logo (24x24 box, shield spanning x 4.5..19.5 and y 2.6..20.4).
The check is drawn in the cover's own green rather than the logo's #16BFA0 so it sits
with the green nodes around it.
"""

import math

W, H = 1200, 670
CX, CY = 140.0, 335.0
MARGIN = 42

BG    = "#1A1A1A"
GREEN = "#2ECC8F"
RED   = "#F0505A"
RING  = "#5A5A5A"
DIM   = "#3A3A3A"

# radius, node count, indices that carry a CSAM tag, angular phase
RINGS = [
    (175, 8,  {5},    0.35),
    (345, 11, {2},   -0.20),
    (520, 11, {4, 9}, 0.45),
    (705, 10, {3},   -0.30),
    (900, 9,  {2, 7}, 0.15),
]

SIZES = [7, 9, 8, 10, 7, 8, 10, 7, 9, 8, 7]

# nudged off the ring so the rows do not read as beads on a string
WOBBLE = [0, 15, -11, 6, -17, 10, -7, 19, -13, 4, -9]

# The CSAM Check logo, verbatim: shield outline and the check inside it.
SHIELD = "M12 2.6 4.5 5.6v6.8c0 4.2 3.6 6.8 7.5 8 3.9-1.2 7.5-3.8 7.5-8V5.6Z"
CHECK = "m8.4 12 2.6 2.6 4.8-5.2"

# The shield is 15 units wide and 17.8 tall, so this puts it at about 65x77px.
ICON_SCALE = 4.3

DIM_DOTS = [
    (250, 60, 5), (430, 108, 4), (640, 52, 6), (880, 96, 4), (1075, 44, 5),
    (330, 176, 4), (760, 172, 5), (1010, 200, 4), (1145, 300, 5),
    (300, 585, 5), (520, 630, 4), (740, 600, 6), (960, 640, 4), (1120, 560, 5),
    (170, 636, 4), (1165, 128, 4), (60, 100, 5), (48, 566, 5), (1080, 380, 4),
]


def max_angle(r):
    """Widest angle whose node still lands inside the frame, in radians."""
    return math.asin(min(1.0, (CY - MARGIN) / r))


def nodes():
    for radius, count, tagged, phase in RINGS:
        span = max_angle(radius)
        for i in range(count):
            # even sweep across the visible arc, nudged so rings do not line up
            t = (i + 0.5) / count + phase / count
            deg = -span + 2 * span * (t % 1.0)
            r = radius + WOBBLE[i % len(WOBBLE)]
            x = CX + r * math.cos(deg)
            y = CY + r * math.sin(deg)
            if x > W - MARGIN or not MARGIN < y < H - MARGIN:
                continue
            yield x, y, SIZES[i % len(SIZES)], RED if i in tagged else GREEN


out = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
    f'width="{W}" height="{H}">',
    '  <defs>',
    '    <radialGradient id="glow">',
    f'      <stop offset="0%" stop-color="{GREEN}" stop-opacity="0.13"/>',
    f'      <stop offset="55%" stop-color="{GREEN}" stop-opacity="0.05"/>',
    f'      <stop offset="100%" stop-color="{GREEN}" stop-opacity="0"/>',
    '    </radialGradient>',
    '  </defs>',
    f'  <rect width="{W}" height="{H}" fill="{BG}"/>',
    f'  <g fill="{DIM}">',
]
out += [f'    <circle cx="{x}" cy="{y}" r="{r}"/>' for x, y, r in DIM_DOTS]
out.append('  </g>')

out.append('  <!-- each ring is one further remove from the queried address -->')
for i, (radius, _, _, _) in enumerate(RINGS):
    out.append(
        f'  <circle cx="{CX:g}" cy="{CY:g}" r="{radius}" fill="none" stroke="{RING}" '
        f'stroke-width="2" stroke-dasharray="9 7" opacity="{0.62 - i * 0.09:.2f}"/>'
    )

out.append('  <!-- green: an ordinary address. red: one tagged as CSAM-related -->')
for x, y, rad, col in nodes():
    if col == RED:
        out.append(f'  <circle cx="{x:.1f}" cy="{y:.1f}" r="{rad + 10}" fill="{RED}" opacity="0.16"/>')
    out.append(f'  <circle cx="{x:.1f}" cy="{y:.1f}" r="{rad}" fill="{col}"/>')

out.append('  <!-- the CSAM Checker itself, at the centre of the rings -->')
out.append(f'  <circle cx="{CX:g}" cy="{CY:g}" r="115" fill="url(#glow)"/>')
out.append(f'  <g transform="translate({CX:g} {CY:g}) scale({ICON_SCALE}) translate(-12 -11.5)" '
           f'fill="none" stroke-linecap="round" stroke-linejoin="round">')
out.append(f'    <path d="{SHIELD}" stroke="#FFFFFF" stroke-width="1.75"/>')
out.append(f'    <path d="{CHECK}" stroke="{GREEN}" stroke-width="2"/>')
out.append('  </g>')
out.append('</svg>')

import sys
open(sys.argv[1], "w").write("\n".join(out) + "\n")
