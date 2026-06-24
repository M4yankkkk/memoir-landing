# Memoir Landing Page Improvement Plan

## 1. Aesthetic Preservation
- Maintain the existing design language precisely as it is.
- Preserve the existing `Inter` font stack and do not introduce `Outfit` or `JetBrains Mono`.
- Retain the current CSS-based 3x3 dot grid logo (`.logo-grid`) instead of switching to an SVG asset.
- Keep all interactive element styles untouched (e.g., `6px` border-radius for buttons, `16px` for cards) to preserve the established prototype aesthetic.

## 2. Content Expansion
- **Pricing Section:** Add a new pricing tier section (Free, Pro, Enterprise) beneath the "What We Do" / "Mid CTA" sections. This will use the existing `.card`, `.btn-primary`, and `.btn-ghost` classes to perfectly match the current visual style.
- **Integrations Refinement:** Expand the existing integrations list (`#logos`) or create a visual "Supported Platforms" section that fits seamlessly into the current layout without altering base styles.

## 3. Structural Additions
- Ensure all new elements hook into the existing scroll-reveal animation logic (`checkReveal()` and `.in` classes).
