# Portfolio signature

`wordmark.blend` contains the original logo curves, shallow extrusion, ceramic/graphite material, three softboxes, and an orthographic camera. The original artwork is `public/logo.svg`.

Rebuild both transparent 1800 × 480 WebP assets from the repository root:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python art/wordmark/render.py
```

The script creates a separate scene, renders both themes to `public/brand/`, and saves the editable scene here. It also exports four 1800 × 480 front layers that align into the wordmark and four 512 × 512 angled letter views per theme. Adjust depth, bevel, material, or lighting in `render.py` before rebuilding.

The website handles the scroll-driven edge appearances on every page at tablet/desktop widths (768px and up). Each page has its own A–N–A–S sequence; phones keep only the footer assembly. Near the bottom of the footer, the letters hop and tilt into place in a timed sequence that continues when scrolling stops. In dark mode, a soft bottom-up light sits over the artwork and below the footer links; light mode keeps the artwork clear. Reduced motion uses the static wordmark. The homepage also has an 850 ms entrance. No browser 3D runtime is required.
