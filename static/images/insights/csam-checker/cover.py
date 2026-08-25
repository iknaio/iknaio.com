"""Cover for the CSAM Checker post.

The checker sits at the left; each dashed ring is one further remove from the address
it was given (same cluster, direct neighbours, neighbouring clusters). Green is an
ordinary address, red one carrying a CSAM tag: the point of the picture is that the red
ones turn up at every distance, and the distance is what the checker reports.

The mark at the centre is the plugin's own icon, lifted verbatim from the dashboard
theme (Theme.Svg.Navbar.iconsChecker): a 40x40 box holding a square outline centred on
(20, 20) and a check that deliberately overruns its top right corner.
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

# The check of Theme.Svg.Navbar.iconsChecker, verbatim.
CHECK = (
    "M1.25771 3.3354C0.585671 2.64079 -0.522217 2.6225 -1.21682 3.29454C-1.91143 "
    "3.96658 -1.92972 5.07447 -1.25768 5.76908L1.50682e-05 4.55224L1.25771 3.3354ZM"
    "4.97619 9.6955L3.71849 10.9123L4.95179 12.187L6.20981 10.9367L4.97619 9.6955ZM"
    "15.9652 1.24124C16.6507 0.559931 16.6541 -0.548103 15.9728 -1.23362C15.2915 "
    "-1.91914 14.1835 -1.92255 13.498 -1.24124L14.7316 0L15.9652 1.24124ZM1.50682e-05 "
    "4.55224L-1.25768 5.76908L3.71849 10.9123L4.97619 9.6955L6.23389 8.47866L1.25771 "
    "3.3354L1.50682e-05 4.55224ZM4.97619 9.6955L6.20981 10.9367L15.9652 1.24124L14.7316 "
    "0L13.498 -1.24124L3.74257 8.45426L4.97619 9.6955Z"
)

# 20.44 units wide in the source box, so this puts the square at about 72px.
ICON_SCALE = 3.5

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
out.append(f'  <g transform="translate({CX:g} {CY:g}) scale({ICON_SCALE}) translate(-20 -20)">')
out.append(f'    <rect x="9.78173828125" y="9.753662109375" width="20.4365234375" '
           f'height="20.492431640625" fill="none" stroke="#FFFFFF" stroke-width="3"/>')
out.append('    <g transform="translate(15.4866943359375, 14.0706787109375)">')
out.append(f'      <path fill="{GREEN}" d="{CHECK}"/>')
out.append('    </g>')
out.append('  </g>')
out.append('</svg>')

import sys
open(sys.argv[1], "w").write("\n".join(out) + "\n")
