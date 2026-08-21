# FE-AA3 — Signature Hero: A Fullscreen Shader

## Assignment

**Track:** Frontend AI Engineering  
**Assignment:** FE-AA3 — Signature Hero: A Fullscreen Shader  
**Project:** Frontend AI Engineering Capstone

## Live Deployment

**Production URL:**  
https://frontend-ai-capstone-two.vercel.app/

---

## 1. What I Built

I implemented a custom fullscreen WebGL fragment shader as the Home page hero background.

The visual direction is **Living Earth**: a calm, procedural landscape-like field using deep soil, forest green, muted cyan, and restrained warm light. The shader is interactive through gentle mouse influence and slow time-based movement, while real HTML hero content remains above the canvas for readability and accessibility.

The shader is decorative rather than semantic: the WebGL canvas is `aria-hidden` and does not contain meaningful text. The headline and supporting content remain normal HTML.

### Core characteristics

- Fullscreen shader rendered behind the hero content.
- Custom GLSL fragment shader.
- Uses all three requested core uniforms:
  - `u_time`
  - `u_resolution`
  - `u_mouse`
- Procedural value noise and four-octave FBM.
- Gentle cursor influence rather than aggressive distortion.
- Darkened foreground/horizon treatment to preserve text readability.
- Device pixel ratio capped at `1.5`.
- Animation pauses when the browser tab is hidden.
- `prefers-reduced-motion` renders a deterministic static frame.
- CSS gradient fallback is available if WebGL cannot provide the visual.
- Canvas initializes after the HTML hero has rendered so it does not unnecessarily block meaningful content.
- WebGL resources, animation frames, observers, and event listeners are cleaned up on unmount.

---

## 2. Complete Fragment Shader Source

```glsl
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// UV and coordinate normalization: center the procedural field around the viewport.
vec2 normalizedUv() {
  return gl_FragCoord.xy / u_resolution;
}

// Aspect-ratio correction: keep the terrain ridges from stretching on tall screens.
vec2 aspectCorrect(vec2 uv) {
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;
  return centered;
}

// Small, deterministic hash: the seed for the hand-built value noise below.
float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
}

// Procedural noise/FBM: layered value noise makes broad, slow landscape contours.
float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  local = local * local * (3.0 - 2.0 * local);

  float lower = mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x);
  float upper = mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x);
  return mix(lower, upper, local.y);
}

float fbm(vec2 point) {
  float field = 0.0;
  float amplitude = 0.5;

  for (int octave = 0; octave < 4; octave++) {
    field += amplitude * valueNoise(point);
    point = point * 2.02 + vec2(17.3, 9.1);
    amplitude *= 0.5;
  }

  return field;
}

// Mouse influence: a soft local drift, normalized so movement stays calm and bounded.
vec2 mouseDrift(vec2 centeredUv) {
  vec2 mouse = u_mouse - 0.5;
  float distanceToMouse = length(
    centeredUv - mouse * vec2(u_resolution.x / u_resolution.y, 1.0)
  );
  float influence = smoothstep(0.75, 0.0, distanceToMouse) * 0.035;
  return normalize(mouse + vec2(0.001)) * influence;
}

void main() {
  vec2 uv = normalizedUv();
  vec2 centeredUv = aspectCorrect(uv);
  vec2 drift = mouseDrift(centeredUv);
  float slowTime = u_time * 0.035;

  float broadField = fbm(
    centeredUv * 1.35 +
    drift +
    vec2(slowTime * 0.18, -slowTime * 0.08)
  );

  float contourField = fbm(
    centeredUv * 3.2 +
    drift * 2.0 -
    vec2(slowTime * 0.12, slowTime * 0.05)
  );

  float ridge = smoothstep(
    0.47,
    0.62,
    broadField + contourField * 0.18
  );

  float horizon = smoothstep(
    -0.28,
    0.42,
    centeredUv.y + broadField * 0.24
  );

  // Color palette: deep soil, forest green, river cyan, and restrained warm light.
  vec3 soil = vec3(0.025, 0.045, 0.038);
  vec3 forest = vec3(0.055, 0.15, 0.105);
  vec3 river = vec3(0.08, 0.34, 0.30);
  vec3 sunlight = vec3(0.53, 0.46, 0.22);

  vec3 color = mix(
    soil,
    forest,
    smoothstep(0.18, 0.56, broadField)
  );

  color = mix(
    color,
    river,
    ridge * horizon * 0.62
  );

  color += sunlight *
    pow(max(ridge * horizon, 0.0), 3.0) *
    0.16;

  // Vignette/depth treatment: pull attention toward the HTML foreground and horizon.
  float vignette =
    1.0 -
    smoothstep(
      0.35,
      0.82,
      length(centeredUv * vec2(0.72, 0.95))
    );

  float foregroundShade =
    smoothstep(0.12, -0.48, centeredUv.y) *
    0.34;

  color *= 0.72 + vignette * 0.5;
  color *= 1.0 - foregroundShade;

  // Final output: a calm opaque background with no meaningful text in the canvas.
  gl_FragColor = vec4(color, 1.0);
}
```

---

## 3. Shader Walkthrough

### `precision mediump float`

The fragment shader uses medium precision floating-point values. This is appropriate for a decorative fullscreen effect and helps keep the shader practical on mobile GPUs.

### `u_time`

`u_time` represents elapsed animation time.

It is intentionally slowed down:

```glsl
float slowTime = u_time * 0.035;
```

This creates slow atmospheric movement instead of fast animation. The broad and contour fields use different time directions and speeds so the landscape does not simply translate as one texture.

### `u_resolution`

`u_resolution` contains the actual drawing-buffer dimensions.

It is used to normalize fragment coordinates and correct the aspect ratio:

```glsl
centered.x *= u_resolution.x / u_resolution.y;
```

Without this correction, the procedural shapes would appear stretched differently depending on the viewport dimensions.

### `u_mouse`

`u_mouse` contains normalized pointer coordinates.

The shader converts the pointer to centered coordinates and uses distance-based falloff to create a small drift:

```glsl
float influence = smoothstep(0.75, 0.0, distanceToMouse) * 0.035;
```

The maximum influence is deliberately small so interaction feels atmospheric rather than visually disruptive.

---

## 4. UV and Coordinate System

### `normalizedUv()`

```glsl
vec2 normalizedUv() {
  return gl_FragCoord.xy / u_resolution;
}
```

`gl_FragCoord` gives the pixel position currently being rendered. Dividing by the resolution converts it to approximately `0.0 → 1.0` UV coordinates.

### `aspectCorrect()`

```glsl
vec2 centered = uv - 0.5;
centered.x *= u_resolution.x / u_resolution.y;
```

The UV space is first centered around `(0, 0)`, then the X axis is scaled according to the viewport aspect ratio.

This keeps the procedural landscape visually consistent across desktop and mobile screens.

---

## 5. Noise and FBM

The shader uses a small hand-built value-noise implementation rather than loading an external texture.

### `hash()`

```glsl
float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
}
```

This produces deterministic pseudo-random values from a 2D coordinate.

It acts as the random seed for the procedural noise.

### `valueNoise()`

The function first identifies the grid cell:

```glsl
vec2 cell = floor(point);
```

Then it gets the local position inside that cell:

```glsl
vec2 local = fract(point);
```

The cubic smoothing expression:

```glsl
local = local * local * (3.0 - 2.0 * local);
```

smooths the interpolation curve.

The four corners of the current grid cell are hashed and interpolated horizontally and then vertically.

The result is continuous, smooth value noise rather than visible blocky grid cells.

### `fbm()`

FBM means **Fractional Brownian Motion**.

Instead of using one noise layer, the shader combines four layers:

```glsl
for (int octave = 0; octave < 4; octave++) {
  field += amplitude * valueNoise(point);
  point = point * 2.02 + vec2(17.3, 9.1);
  amplitude *= 0.5;
}
```

Each octave:

1. Samples the noise.
2. Adds it to the accumulated field.
3. Increases spatial frequency.
4. Reduces amplitude.

The result contains both broad forms and smaller details.

The `2.02` frequency multiplier and coordinate offset help prevent obvious repetition between layers.

If FBM were removed and only one noise layer remained, the visual would become much flatter and less terrain-like.

---

## 6. Landscape Composition

Two FBM fields are used:

```glsl
broadField
contourField
```

`broadField` creates large-scale terrain structure.

`contourField` uses a higher spatial frequency to add smaller ridge detail.

The two are combined into:

```glsl
float ridge = smoothstep(
  0.47,
  0.62,
  broadField + contourField * 0.18
);
```

This turns the continuous noise field into brighter terrain-like bands.

The `horizon` value limits the strongest color treatment to the intended landscape region.

---

## 7. Color Direction

The palette was authored specifically for this capstone:

- Deep soil
- Forest green
- Muted river/cyan
- Restrained warm sunlight

The colors are progressively mixed based on the procedural terrain values rather than applied as a static gradient.

The warm light is intentionally restrained:

```glsl
color += sunlight *
  pow(max(ridge * horizon, 0.0), 3.0) *
  0.16;
```

This keeps the hero visually distinctive without competing with the foreground content.

---

## 8. Vignette and Text Readability

The shader is designed around the HTML content rather than treating the canvas as the primary information layer.

The vignette reduces visual intensity around the edges.

The foreground shade additionally darkens the lower text-facing area.

This helps maintain readable contrast between the hero content and the animated background.

The canvas itself is decorative and `aria-hidden`; meaningful content remains accessible HTML.

---

## 9. Adapted vs Authored

### Adapted

The following ideas are based on established procedural shader techniques:

- Grid-based hash function.
- Value-noise construction.
- Smooth interpolation between noise-cell corners.
- Multi-octave FBM.
- Standard UV normalization.
- Aspect-ratio correction.
- GLSL/WebGL fullscreen rendering boilerplate.

These are standard techniques rather than claims of inventing a new noise algorithm.

### Authored for this project

The following composition decisions were made specifically for this capstone:

- The **Living Earth** visual direction.
- Soil/forest/cyan/warm-light palette.
- Two-field terrain composition.
- Broad-field and contour-field frequency choices.
- Ridge threshold and horizon treatment.
- Slow animation rates.
- Mouse drift strength and falloff.
- Vignette and foreground shading.
- The relationship between the shader and the HTML hero content.
- Reduced-motion/static behavior.
- Performance constraints and lifecycle handling.

The shader is therefore a meaningful remix and personalization of established procedural techniques rather than a copied playground shader.

---

## 10. Responsible Performance

The implementation includes several safeguards required by FE-AA3.

### Device Pixel Ratio

The device pixel ratio is capped:

```ts
Math.min(window.devicePixelRatio || 1, 1.5)
```

This limits the number of pixels processed by the fragment shader, particularly on high-density mobile displays.

### Tab Visibility

The animation listens for `visibilitychange`.

When the page becomes hidden, the active animation frame is cancelled. When the page becomes visible again, animation resumes.

This avoids spending animation work while the user cannot see the page.

### Reduced Motion

For users who request reduced motion, the implementation does not continuously animate the shader.

Instead it renders one deterministic frame using:

```text
u_time = 0
```

and a centered mouse position.

The same visual palette is therefore preserved without continuous motion.

### Lazy Initialization

The WebGL canvas is initialized from `useEffect`, after the HTML hero has rendered.

This keeps meaningful page content available without requiring the browser to initialize WebGL before rendering the hero content.

### Cleanup

The implementation cleans up:

- WebGL buffers
- shaders
- shader program
- animation frames
- resize observer
- event listeners

when the component unmounts.

---

## 11. Accessibility

The shader is decorative and does not replace semantic content.

- The WebGL canvas is `aria-hidden`.
- The hero headline is real HTML.
- Foreground content remains keyboard and screen-reader accessible.
- The visual background does not contain essential information.
- Reduced-motion behavior is supported.
- Existing site accessibility improvements remain in place, including skip-to-content behavior and focus-visible styling.

---

## 12. Verification

### Automated checks

The implementation was verified with:

```text
npm run typecheck   PASS
npm run lint        PASS
npm run test:unit   PASS — 10 tests
npm run build       PASS
```

### End-to-end testing

At the time of implementation, the Playwright E2E run was blocked because the local Chromium browser was not installed:

```text
npm run test:e2e
→ blocked: Playwright Chromium is not installed
```

The required browser installation command is:

```bash
npx playwright install chromium
```

After installation, the E2E suite should be rerun before treating the complete automated verification as final.

### Manual smoke checks

Desktop smoke testing confirmed:

- Canvas matched the hero dimensions.
- Hero heading remained visible above the shader.

Mobile smoke testing at a `390px` viewport confirmed:

- Canvas resized correctly.
- Hero heading remained present and readable.

---

## 13. Reduced-Motion / Performance One-Liner

**The shader caps DPR at 1.5, pauses animation when the tab is hidden, and renders a deterministic static frame for `prefers-reduced-motion`, with a CSS gradient available as the visual fallback.**

---

## 14. Final FE-AA3 Requirement Checklist

| Requirement | Status |
|---|---|
| Custom or meaningfully remixed fragment shader | PASS |
| Fullscreen hero | PASS |
| Real content over hero | PASS |
| Headline present | PASS |
| `u_time` used | PASS |
| `u_resolution` used | PASS |
| `u_mouse` used | PASS |
| Readable text / contrast considered | PASS |
| Device pixel ratio capped | PASS |
| Animation pauses when tab is hidden | PASS |
| `prefers-reduced-motion` fallback | PASS |
| Static/CSS visual fallback | PASS |
| Shader source included | PASS |
| Shader sections commented | PASS |
| Noise/FBM explained | PASS |
| Adapted vs authored work identified | PASS |
| Live deployment available | PASS |
| Typecheck | PASS |
| Lint | PASS |
| Unit tests | PASS |
| Production build | PASS |
| Full E2E verification | PENDING Playwright Chromium installation |

---

## 15. Submission

**Live URL:**

https://frontend-ai-capstone-two.vercel.app/

**Source repository:**

https://github.com/ephysians/frontend-ai-capstone

**Primary deliverable:** This document plus the deployed hero at the live URL.

---

*Prepared for FE-AA3 — Signature Hero: A Fullscreen Shader.*
