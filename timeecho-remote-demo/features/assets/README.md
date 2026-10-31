# Product image sources

Both images are cropped from the user-provided `TimeEcho_Remote_System_Design_v3.pdf`, dated 2026-10-26.

- `remote-v3.jpg`: page 5, front and back of the remote.
- `box-v3.jpg`: page 14, assembled box and rear connectors.

The PDF identifies these as AI concept renders, not photographs or manufactured prototypes. The page preserves that distinction in the captions. Images were extracted from the PDF, cropped and saved as JPEGs for this local project; no external image service was used.

`remote-noscreen.svg` is an unused historical schematic from an earlier discussion. The feature page now uses `remote-v3.jpg` to summarize the original PDF, including its dot-matrix display.

`remote-controls.svg` and `box-interfaces.svg` are project-drawn, labeled functional diagrams based on PDF pages 6–10, 15–17, 31–32. They explain controls and interfaces, not manufacturing geometry. The page uses “音量键” at the user's request. Unspecified reset and indicator positions are not invented. Both diagrams appear above the hardware tables and link to their full-size SVG.

`journeys/` contains 19 original SVG storyboards, one per feature, with three illustrated steps drawn from the feature summaries. They are explanatory illustrations, not actual UI captures or manufactured hardware. Regenerate with `python3 scripts/generate-journey-images.py`; feature actions and responses are read from `features/features.js`. Unspecified controls remain explicitly unspecified.
