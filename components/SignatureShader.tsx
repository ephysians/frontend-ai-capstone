'use client';

import { useEffect, useRef } from 'react';

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
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
  float distanceToMouse = length(centeredUv - mouse * vec2(u_resolution.x / u_resolution.y, 1.0));
  float influence = smoothstep(0.75, 0.0, distanceToMouse) * 0.035;
  return normalize(mouse + vec2(0.001)) * influence;
}

void main() {
  vec2 uv = normalizedUv();
  vec2 centeredUv = aspectCorrect(uv);
  vec2 drift = mouseDrift(centeredUv);
  float slowTime = u_time * 0.035;

  float broadField = fbm(centeredUv * 1.35 + drift + vec2(slowTime * 0.18, -slowTime * 0.08));
  float contourField = fbm(centeredUv * 3.2 + drift * 2.0 - vec2(slowTime * 0.12, slowTime * 0.05));
  float ridge = smoothstep(0.47, 0.62, broadField + contourField * 0.18);
  float horizon = smoothstep(-0.28, 0.42, centeredUv.y + broadField * 0.24);

  // Color palette: blue-green soil, eucalyptus growth, teal ridges, and soft gold light.
  vec3 soil = vec3(0.02, 0.045, 0.05);
  vec3 forest = vec3(0.04, 0.18, 0.16);
  vec3 river = vec3(0.05, 0.42, 0.38);
  vec3 sunlight = vec3(0.35, 0.58, 0.42);
  vec3 color = mix(soil, forest, smoothstep(0.18, 0.56, broadField));
  color = mix(color, river, ridge * horizon * 0.62);
  color += sunlight * pow(max(ridge * horizon, 0.0), 3.0) * 0.16;

  // Vignette/depth treatment: pull attention toward the HTML foreground and horizon.
  float vignette = 1.0 - smoothstep(0.35, 0.82, length(centeredUv * vec2(0.72, 0.95)));
  float foregroundShade = smoothstep(0.12, -0.48, centeredUv.y) * 0.34;
  color *= 0.72 + vignette * 0.5;
  color *= 1.0 - foregroundShade;

  // Final output: a calm opaque background with no meaningful text in the canvas.
  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function SignatureShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId = 0;
    let disposed = false;
    let isVisible = document.visibilityState === 'visible';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'a_position');
    const time = gl.getUniformLocation(program, 'u_time');
    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const mouse = gl.getUniformLocation(program, 'u_mouse');
    const pointer = { x: 0.5, y: 0.5 };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(bounds.width * pixelRatio));
      const height = Math.max(1, Math.floor(bounds.height * pixelRatio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const draw = (elapsed = 0) => {
      if (disposed) return;
      resize();
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(time, reducedMotion ? 0 : elapsed * 0.001);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(mouse, reducedMotion ? 0.5 : pointer.x, reducedMotion ? 0.5 : pointer.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const animate = (elapsed: number) => {
      if (!isVisible || reducedMotion || disposed) return;
      draw(elapsed);
      frameId = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      pointer.y = Math.min(1, Math.max(0, 1 - (event.clientY - bounds.top) / bounds.height));
    };

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      window.cancelAnimationFrame(frameId);
      if (isVisible && !reducedMotion) frameId = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    draw();
    if (!reducedMotion && isVisible) frameId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="signature-shader" aria-hidden="true" />;
}
