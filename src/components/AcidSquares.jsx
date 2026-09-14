import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './AcidSquares.css';

// React Bits AcidSquares trimmed to what the world setting backdrop uses. The
// blur post-process, pointer dent, film grain, and light mode were removed;
// maxDpr is an added cap on the canvas pixel ratio for a full-page backdrop.
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const DETAIL_STEPS = { low: 20, medium: 32, high: 48 };

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uWaveDepth;
uniform float uZoom;
uniform float uDensity;
uniform float uSpread;
uniform float uStepSize;
uniform float uGlow;
uniform float uExposure;
uniform float uColorShift;
uniform float uContrast;
uniform float uBrightness;
uniform float uOpacity;
uniform float uSteps;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

void main() {
  float zoom = max(uZoom, 0.05);
  vec2 ndc = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  vec2 dir = ndc * (0.5 / zoom);

  float travel = sin(iTime * uSpeed) * uWaveDepth;
  float density = max(uDensity, 1.0);
  float spread = clamp(uSpread, 0.05, 0.6);
  float stepSize = max(uStepSize, 0.0005);
  float glowGain = max(uGlow, 0.0);

  vec3 tOffset = vec3(0.0, 0.0, travel);
  vec3 p = vec3(0.0);
  float s = 0.0;
  float glow = 0.0;

  for (int i = 0; i < 64; i++) {
    if (float(i) >= uSteps) break;
    p += vec3(dir * s, s);
    vec3 q = p + tOffset;
    s += density - length(q.xz) + length(ceil(q).xy);
    s = stepSize + abs(s) * spread;
    glow += glowGain / s;
  }

  float e = glow / max(uExposure, 1.0);
  float shimmer = 0.5 + 0.5 * dot(cos(iTime * uColorShift + p), vec3(0.3333));
  float v = tanh(e * uBrightness * mix(0.7, 1.05, shimmer));
  v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, 0.55, v));
  col = mix(col, uColor3, smoothstep(0.55, 1.0, v));
  col *= v;

  float a = clamp(v, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * a, a);
}
`;

const AcidSquares = ({
  color1 = '#5227FF',
  color2 = '#A855F7',
  color3 = '#FFFFFF',
  detail = 'medium',
  speed = 0.7,
  waveDepth = 1,
  zoom = 1.3,
  density = 10.0,
  glow = 1.0,
  exposure = 2700,
  spread = 0.3,
  stepSize = 0.002,
  colorShift = 0,
  contrast = 1,
  brightness = 1.0,
  opacity = 1.0,
  maxDpr = 2,
  className = ''
}) => {
  const containerRef = useRef(null);
  const programRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, maxDpr)
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: 0 },
        uWaveDepth: { value: 0 },
        uZoom: { value: 1 },
        uDensity: { value: 1 },
        uSpread: { value: 0 },
        uStepSize: { value: 0 },
        uGlow: { value: 0 },
        uExposure: { value: 1 },
        uColorShift: { value: 0 },
        uContrast: { value: 1 },
        uBrightness: { value: 1 },
        uOpacity: { value: 1 },
        uSteps: { value: 32 },
        uColor1: { value: new Float32Array(3) },
        uColor2: { value: new Float32Array(3) },
        uColor3: { value: new Float32Array(3) }
      }
    });
    programRef.current = program;
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();
    const loop = t => {
      program.uniforms.iTime.value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      isVisible ? tryStart() : tryStop();
    });
    io.observe(container);
    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);
    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      programRef.current = null;
      try {
        container.removeChild(canvas);
      } catch {}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const u = programRef.current?.uniforms;
    if (!u) return;
    u.uSpeed.value = speed;
    u.uWaveDepth.value = waveDepth;
    u.uZoom.value = zoom;
    u.uDensity.value = density;
    u.uSpread.value = spread;
    u.uStepSize.value = stepSize;
    u.uGlow.value = glow;
    u.uExposure.value = exposure;
    u.uColorShift.value = colorShift;
    u.uContrast.value = contrast;
    u.uBrightness.value = brightness;
    u.uOpacity.value = opacity;
    u.uSteps.value = DETAIL_STEPS[detail] || DETAIL_STEPS.medium;
    u.uColor1.value.set(hexToRgb(color1));
    u.uColor2.value.set(hexToRgb(color2));
    u.uColor3.value.set(hexToRgb(color3));
  }, [color1, color2, color3, detail, speed, waveDepth, zoom, density, glow, exposure, spread, stepSize, colorShift, contrast, brightness, opacity]);

  return <div ref={containerRef} className={`acid-squares-container ${className}`.trim()} />;
};

export default AcidSquares;
