# Project Log - WWF Co Bien Site

## 2026-05-23 - Rebuild Homepage desktop from real Figma frame

**Scope**

- Rebuilt the desktop Homepage against the requested Figma page: `01 Homepage`, frame `Homepage - 1440px`.
- Ignored mobile layout for this pass, per request, to focus on desktop fidelity.
- Replaced hand-typed logo treatment with exported logo SVG assets.
- Rebuilt visual sections using Figma-derived images and SVG assets instead of approximated placeholders.
- Fixed Vietnamese text encoding in source so rendered typography no longer shows mojibake.
- Reworked the Section 3 to Section 4 wave divider and added missing bubble/underwater decorative details.
- Built and copied production output into `docs/` for GitHub Pages.

**Files touched**

- `src/main.tsx`
- `src/styles.css`
- `public/assets/logo-cobien-mark.svg`
- `public/assets/logo-cobien-wordmark.svg`
- `public/assets/island-map-illustration.png`
- `public/assets/figma-home/*`
- `docs/*` production build output

**Verification**

- Ran production build successfully with `npm run build`.
- Checked desktop locally at `http://127.0.0.1:5174/WWF-CoBien-Site/home`.
- Captured local review screenshots:
  - `fig-home-font-fixed.png`
  - `fig-home-wave-fixed.png`
  - `fig-home-wave-orientation.png`

**Known open work**

- Homepage desktop may still need pixel-level tuning after visual review against Figma.
- Mobile layout has not been rebuilt in this pass.
- The `co-bien` and `o-dau` pages still need the same strict Figma-frame rebuild approach.

**Git**

- Commit pushed: `d4e02c4`
- Commit message: `Rebuild homepage desktop from Figma frame`
- Branch: `main`
- Remote: `origin https://github.com/docteurmeo/WWF-CoBien-Site.git`

## 2026-05-23 - Add 1920px desktop responsive behavior

**Scope**

- Updated Homepage desktop behavior for wide screens such as 1920px.
- Kept the 1440px Figma canvas/grid centered so all in-grid object positions and dimensions remain unchanged.
- Extended section backgrounds to full viewport width to remove the left/right gaps on wide displays.
- Updated full-bleed visual assets such as waves, hero grass, seagrass grass, and dual CTA image panels so they expand across the viewport without changing the 1440px content grid.
- Kept in-grid objects fixed to their original Figma-derived coordinates.

**Implementation notes**

- Added desktop CSS variables:
  - `--fig-canvas: 1440px`
  - `--fig-offset`
  - `--fig-full`
  - `--page-pad`
- Used section pseudo-backgrounds for full-bleed color/gradient bands.
- Kept horizontal overflow hidden at page level while allowing section visuals to extend beyond the centered canvas.
- Made the final dual CTA image band full viewport width while preserving text alignment to the centered 1440px grid.

**Verification**

- Ran `npm run build` successfully.
- Captured and reviewed a 1920px full-page screenshot:
  - `homepage-1920-responsive-final.png`

**Known open work**

- The current pass targets desktop/wide desktop only.
- Mobile remains intentionally out of scope for this phase.

## 2026-05-24 - Replace fixed SVG waves with code waves

**Scope**

- Replaced fixed exported wave SVGs on Homepage with inline code-generated wave layers.
- Fixed wave height across viewport widths so waves no longer scale taller on 1920px screens.
- Added subtle wave drift animation for a light ocean motion effect.
- Added `prefers-reduced-motion` handling to disable wave animation when requested by the user/browser.
- Adjusted wave layer stacking so the hero wave does not cover the seagrass strip or turtle.
- Fixed Section 4 bridge layout by separating the bridge copy selector from decorative wave `div` elements.
- Removed unused fixed wave SVG assets from `public/assets/figma-home`.

**Verification**

- Ran `npm run build` successfully.
- Checked local screenshots:
  - `wave-hero-1920-final.png`
  - `wave-full-1920-final.png`
  - `wave-bridge-crop-final.png`
  - `wave-full-1440-final.png`

**Known open work**

- This pass only changes Homepage desktop/wide desktop wave behavior.
- Mobile remains intentionally out of scope for this phase.
