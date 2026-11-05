# Koraveo — web studio portfolio

© 2026 Koraveo. All rights reserved. See LICENSE.
Demo websites (Hebrew, RTL) for small Israeli businesses + portfolio page. Static HTML/CSS/JS, no build step.
All businesses, names and reviews are fictional (אתר לדוגמה).

## SEO / Google Search Console
- Sitemap: https://ggadielggtv-ux.github.io/adiel-web/sitemap.xml (all public pages; `portfolio/thanks.html` is noindex and excluded).
- `robots.txt` in this repo is served at `/adiel-web/robots.txt`, which crawlers ignore (robots only counts at the domain root `ggadielggtv-ux.github.io/robots.txt`). Submit the sitemap manually in Search Console instead.
- Search Console: add a **URL-prefix** property `https://ggadielggtv-ux.github.io/adiel-web/` and choose **HTML file** verification. Download the `googleXXXXXXXXXXXX.html` file Google gives you and commit it to the repo root (next to this README), so it is served at `https://ggadielggtv-ux.github.io/adiel-web/googleXXXXXXXXXXXX.html`. Then submit `sitemap.xml`. (A Domain property is not possible on github.io.)

## Galilee demos (2026-11-05)
- `galil-stay/` – "מושבה 1882", boutique stone suites in Rosh Pina (fictional).
- `tzfat-gallery/` – "תכלת", gallery & studio in Safed's artists' quarter (fictional).
- Location photos: Wikimedia Commons (CC BY / CC BY-SA, credited in each site's footer). Interiors/artworks/videos: Pexels License. Videos: 720p H.264 + VP9, muted, lazy-loaded, skipped for prefers-reduced-motion / Save-Data.
