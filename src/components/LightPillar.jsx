// React Bits LightPillar, moved from three.js to ogl so the site does not ship
// three.js for one full-screen plane. The shader, quality tiers, and frame
// pacing are the original's. Pointer control and light mode were left out
// because the codex backdrop uses neither, and a stopped pillar (rotationSpeed
// 0) draws once instead of every frame.
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './LightPillar.css';

const QUALITY = {
  low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
  medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
  high: { iterations: 80, waveIterations: 4, pixelRatio: 2, precision: 'highp', stepMultiplier: 1.0 }
};

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = s => `#version 300 es
precision ${s.precision} float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uIntensity;
uniform float uGlowAmount;
uniform float uPillarWidth;
uniform float uPillarHeight;
uniform float uNoiseIntensity;
uniform float uRotCos;
uniform float uRotSin;
uniform float uPillarRotCos;
uniform float uPillarRotSin;
uniform float uWaveSin;
uniform float uWaveCos;
in vec2 vUv;
out vec4 fragColor;

const float STEP_MULT = ${s.stepMultiplier.toFixed(1)};
const int MAX_ITER = ${s.iterations};
const int WAVE_ITER = ${s.waveIterations};

void main() {
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
  uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

  vec3 ro = vec3(0.0, 0.0, -10.0);
  vec3 rd = normalize(vec3(uv, 1.0));

  vec3 col = vec3(0.0);
  float t = 0.1;

  for (int i = 0; i < MAX_ITER; i++) {
    vec3 p = ro + rd * t;
    p.xz = vec2(uRotCos * p.x - uRotSin * p.z, uRotSin * p.x + uRotCos * p.z);

    vec3 q = p;
    q.y = p.y * uPillarHeight + uTime;

    float freq = 1.0;
    float amp = 1.0;
    for (int j = 0; j < WAVE_ITER; j++) {
      q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
      q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
      freq *= 2.0;
      amp *= 0.5;
    }

    float d = length(cos(q.xz)) - 0.2;
    float bound = length(p.xz) - uPillarWidth;
    float k = 4.0;
    float h = max(k - abs(d - bound), 0.0);
    d = max(d, bound) + h * h * 0.0625 / k;
    d = abs(d) * 0.15 + 0.01;

    float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
    col += mix(uBottomColor, uTopColor, grad) / d;

    t += d * STEP_MULT;
    if (t > 50.0) break;
  }

  float widthNorm = uPillarWidth / 3.0;
  col = tanh(col * uGlowAmount / widthNorm);

  col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;

  fragColor = vec4(clamp(col * uIntensity, 0.0, 1.0), 1.0);
}
`;

const LightPillar = ({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  className = '',
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = 'screen',
  pillarRotation = 0,
  quality = 'high'
}) => {
  const containerRef = useRef(null);
  const programRef = useRef(null);
  const drawRef = useRef(null);
  const speedRef = useRef(rotationSpeed);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    let effective = quality;
    if (isLowEndDevice && quality === 'high') effective = 'medium';
    if (isMobile && quality !== 'low') effective = 'low';
    const settings = QUALITY[effective] || QUALITY.medium;

    let renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: effective === 'high' ? 'high-performance' : 'low-power',
        dpr: effective === 'high' ? Math.min(window.devicePixelRatio || 1, settings.pixelRatio) : settings.pixelRatio
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment: fragment(settings),
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uTopColor: { value: hexToRgb(topColor) },
        uBottomColor: { value: hexToRgb(bottomColor) },
        uIntensity: { value: intensity },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uRotCos: { value: 1 },
        uRotSin: { value: 0 },
        uPillarRotCos: { value: Math.cos((pillarRotation * Math.PI) / 180) },
        uPillarRotSin: { value: Math.sin((pillarRotation * Math.PI) / 180) },
        uWaveSin: { value: Math.sin(0.4) },
        uWaveCos: { value: Math.cos(0.4) }
      }
    });
    programRef.current = program;
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const draw = () => renderer.render({ scene: mesh });
    drawRef.current = draw;

    const setSize = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
      draw();
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let time = 0;
    let lastTime = performance.now();
    const frameTime = 1000 / (effective === 'low' ? 30 : 60);
    const animate = now => {
      raf = requestAnimationFrame(animate);
      const delta = now - lastTime;
      if (delta < frameTime || speedRef.current === 0) return;
      time += 0.016 * speedRef.current;
      program.uniforms.uTime.value = time;
      program.uniforms.uRotCos.value = Math.cos(time * 0.3);
      program.uniforms.uRotSin.value = Math.sin(time * 0.3);
      draw();
      lastTime = now - (delta % frameTime);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      programRef.current = null;
      drawRef.current = null;
      try {
        container.removeChild(canvas);
      } catch {}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  useEffect(() => {
    speedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    const u = programRef.current?.uniforms;
    if (!u) return;
    u.uTopColor.value = hexToRgb(topColor);
    u.uBottomColor.value = hexToRgb(bottomColor);
    u.uIntensity.value = intensity;
    u.uGlowAmount.value = glowAmount;
    u.uPillarWidth.value = pillarWidth;
    u.uPillarHeight.value = pillarHeight;
    u.uNoiseIntensity.value = noiseIntensity;
    u.uPillarRotCos.value = Math.cos((pillarRotation * Math.PI) / 180);
    u.uPillarRotSin.value = Math.sin((pillarRotation * Math.PI) / 180);
    drawRef.current?.();
  }, [topColor, bottomColor, intensity, glowAmount, pillarWidth, pillarHeight, noiseIntensity, pillarRotation]);

  return <div ref={containerRef} className={`light-pillar-container ${className}`.trim()} style={{ mixBlendMode }} />;
};

export default LightPillar;
