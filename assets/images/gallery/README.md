# Gallery photos

Folder layout:

```
assets/images/gallery/<Category>/<number>-<name>/cover.jpg
```

- Top-level folder = category (must match a filter button in `pages/gallery.html`, e.g. `Crochet`, `Cooking`).
- Each album is one sub-folder, named `<number>-<name>` (e.g. `12-vest`). Higher numbers show first.
- `cover.<ext>` is required — it's the thumbnail shown on the gallery page. Album folders without one are silently skipped.
- Any other image files in the album folder (any name) become extra photos in that album's viewer, alongside the cover.

## After adding/renaming/removing anything here

Run this, then commit the updated `scripts/gallery-data.js` along with your image changes:

```
powershell -File scripts/build-gallery.ps1
```

Nothing shows up on the site until you run it — the page reads from the generated
`scripts/gallery-data.js`, not from this folder directly.
