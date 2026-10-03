# Portfolio signature

`wordmark.blend` contains the original logo curves, shallow extrusion, ceramic/graphite material, three softboxes, and an orthographic camera. The original artwork is `public/logo.svg`.

Rebuild both transparent 1800 × 480 WebP assets from the repository root:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python art/wordmark/render.py
```

The script creates a separate scene, renders both themes to `public/brand/`, and saves the editable scene here. It also exports four 1800 × 480 front layers that align into the wordmark and four 512 × 512 angled letter views per theme. Adjust depth, bevel, material, or lighting in `render.py` before rebuilding.

The website handles the scroll-driven edge appearances on every page except privacy at tablet/desktop widths (768px and up). Each page has its own A–N–A–S sequence; phones keep only the footer assembly. Near the bottom of the footer, the letters hop and tilt into place in a timed sequence that continues when scrolling stops. In dark mode, a soft bottom-up light sits over the artwork and below the footer links; light mode keeps the artwork clear. Reduced motion uses the static wordmark. No browser 3D runtime is required.

On the first visit per tab session, a 1.5-second welcome assembles the four 3D front layers with a gentle tilt and stagger, then fades into the page. The opaque cover activates before first paint; the animation waits for the themed images to decode, and the homepage entrance waits for its reveal. Repeat visits, reduced motion, unavailable session storage, or failed images skip the welcome; Escape dismisses it. Timing lives in `components/signature-entrance.module.css`.
