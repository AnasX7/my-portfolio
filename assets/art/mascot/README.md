# Portfolio mascot

The 56px header character is based on `public/avatar-light.jpg`. Both versions keep the same glasses, facial hair, white ghutra, black agal, and white kandura. Light mode uses warm cream shadows; dark mode uses cooler pearl shadows and a subtle light edge. The hero retains the real photograph.

Created with the built-in ImageGen tool using the [page-mascot workflow](https://github.com/nilbuild/page-mascot/tree/main/skills/page-mascot). Original transparent PNG sheets are in `characters/`; the production WebP atlases are in `public/mascots/`. The small React component is adapted from that project's MIT-licensed component; the license is included here.

## Prompt set

1. **Light directions:** Use the color portrait as the likeness reference. Restyle as a friendly, big-head chibi cartoon with expressive brown eyes, thin black wire glasses, a short tidy beard and moustache, white ghutra with a black agal, and white kandura. Use clean varied-weight warm outlines, natural warm skin tones, and warm cream fabric shadows. Make one transparent square 3×3 sprite sheet. Directions, in row order: up-left, up, up-right, left, center, right, down-left, down, down-right. Left and right refer to the viewer. Keep one identical front-facing body across all cells. Only the head turns. All busts share scale, head center, shoulder baseline, and wide clear cell margins. No hands, arms, props, backdrop, labels, symbols, or photo realism.
2. **Light reactions:** Reference the light direction sheet. Copy its identity, colors, line weight, scale, and front-facing center pose. Keep identical bodies and aligned shoulders. Make a matching transparent 3×3 sheet with these expressions: blink, blink with a small coral heart, blink with three golden sparkles, surprised, wink, bashful, sleepy with small blue zzz, dizzy, delighted. All heads face the viewer. Keep all symbols inside their own cell and no drawing touching a cell boundary.
3. **Dark directions:** Reference the light direction sheet. Change only palette and lighting: cool pearl/stone shadows in the white fabric, slightly brighter warm face highlights, and fine ivory edges for contrast on charcoal. Keep skin colored, clothes white, glasses and agal black. Preserve every pose, expression, cell location, scale, and silhouette. No glow clouds, backdrop, neon, labels, or new accessories. Real transparent alpha.
4. **Dark reactions:** Reference both the light reactions and dark directions. Match the dark palette precisely while preserving the light reaction sheet's cell order, expressions, symbols, scale, and front-facing bodies. Keep opaque white clothing, warm skin, and a real transparent background.

## Build and verification

Use the upstream skill's `mascot.py` with Python, Pillow, NumPy, and SciPy. From this repository, point `MASCOT_ROOT` at `assets/art/mascot` and pass `--dest` pointing at `public/mascots`:

```sh
MASCOT_ROOT="$PWD/assets/art/mascot" python /path/to/page-mascot/skills/page-mascot/scripts/mascot.py anas-light --skip-generate --dest "$PWD/public/mascots"
MASCOT_ROOT="$PWD/assets/art/mascot" python /path/to/page-mascot/skills/page-mascot/scripts/mascot.py anas-dark --skip-generate --dest "$PWD/public/mascots"
```

Both built pairs passed: measured vertical movement on reaction is 0.00 rendered pixels at 140px. Light palette agreement is 84.7%, shoulder width difference 2.8%; dark palette agreement is 81.6%, shoulder width difference 5.0%. Left/right directions were also checked visually. The sleepy symbol touches a source cell edge, so that frame is not used; the component uses blink, heart, sparkle, and delighted reactions.

The production atlases are resized to 432×432 with Sharp at WebP quality 90 after building. Each cell is 144×144, displayed at 56px in the header. Keep this resize step when rebuilding; the original PNG sheets retain their full resolution.

Pointer tracking pauses far from the viewport, on hidden pages, on touch devices, and when reduced motion is enabled. Tap, Enter, or Space can still change the expression. Theme selection uses CSS, so the face does not flash the wrong theme during hydration. Only the current theme's sheets load, when the mascot approaches the viewport.
