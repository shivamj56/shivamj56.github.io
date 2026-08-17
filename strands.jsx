/* Strands — React Bits (JS + CSS variant), adapted for this project:
   - no bundler imports: ogl comes from the module already loaded in <helmet>
   - exported on window for <x-import>
   - the glass-ball path is dropped; this runs as a hero backdrop, not a subject
   - pauses when the hero scrolls out of view, so it costs nothing down-page */
const { useEffect, useRef } = React;

const MAX_STRANDS = 12;
const MAX_COLORS = 8;

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;
const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}
vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}
vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  float env = pow(max(cos(uv.x * PI * 1.3), 0.0), uTaper);

  vec3 col = vec3(0.0);

  for (int i = 0; i < ${MAX_STRANDS}; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

let __oglPromise = null;
function loadOgl() {
  if (window.ogl) return Promise.resolve(window.ogl);
  if (__oglPromise) return __oglPromise;
  __oglPromise = new Promise((resolve, reject) => {
    let settled = false;
    const done = () => { if (!settled && window.ogl) { settled = true; resolve(window.ogl); } };
    window.addEventListener('ogl-ready', done);
    const poll = setInterval(() => { if (window.ogl) { clearInterval(poll); done(); } }, 60);
    setTimeout(() => {
      clearInterval(poll);
      if (settled) return;
      import('https://unpkg.com/ogl@1.0.11/src/index.js').then(m => { settled = true; resolve(m); }).catch(reject);
    }, 6000);
  });
  return __oglPromise;
}

function buildPalette(ogl, colors) {
  const filled = colors && colors.length ? colors : ['#ffffff'];
  const padded = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    const hex = filled[i] != null ? filled[i] : filled[filled.length - 1];
    const c = new ogl.Color(hex);
    padded.push([c.r, c.g, c.b]);
  }
  return padded;
}

function Strands({
  colors = ['#FF4242', '#7C3AED', '#06B6D4', '#EAB308'],
  count = 3,
  speed = 0.5,
  amplitude = 1,
  waviness = 1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  hueShift = 0,
  intensity = 0.6,
  saturation = 1.5,
  opacity = 1,
  scale = 1.5,
  className = '',
  style
}) {
  const propsRef = useRef({});
  propsRef.current = { colors, count, speed, amplitude, waviness, thickness, glow, taper,
    spread, hueShift, intensity, saturation, opacity, scale };

  const ctnDom = useRef(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return undefined;
    let disposed = false;
    let cleanup = null;

    (async () => {
      let ogl;
      try { ogl = await loadOgl(); } catch (e) { return; }
      if (disposed) return;
      const { Renderer, Program, Mesh, Triangle } = ogl;

      const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2) });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      const p = propsRef.current;
      const program = new Program(gl, {
        vertex: VERT, fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
          uColors: { value: buildPalette(ogl, p.colors) },
          uColorCount: { value: Math.min(p.colors.length, MAX_COLORS) },
          uStrandCount: { value: Math.min(p.count, MAX_STRANDS) },
          uSpeed: { value: p.speed }, uAmplitude: { value: p.amplitude },
          uWaviness: { value: p.waviness }, uThickness: { value: p.thickness },
          uGlow: { value: p.glow }, uTaper: { value: p.taper },
          uSpread: { value: p.spread }, uHueShift: { value: p.hueShift },
          uIntensity: { value: p.intensity }, uOpacity: { value: p.opacity },
          uScale: { value: p.scale }, uSaturation: { value: p.saturation }
        }
      });
      const mesh = new Mesh(gl, { geometry, program });
      ctn.appendChild(gl.canvas);

      const resize = () => {
        const w = ctn.offsetWidth, h = ctn.offsetHeight;
        if (w < 2 || h < 2) return;
        renderer.setSize(w, h);
        program.uniforms.uResolution.value = [w, h];
      };
      window.addEventListener('resize', resize, { passive: true });
      resize();

      /* Only paint while the hero is actually on screen. A shader running behind
         thirteen thousand pixels of page the reader has already left is pure
         battery cost, and this page already drives a second WebGL context. */
      let visible = true;
      const io = new IntersectionObserver(es => {
        es.forEach(e => { visible = e.isIntersecting; });
      }, { threshold: 0.01 });
      io.observe(ctn);

      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let raf = 0;
      const update = t => {
        raf = requestAnimationFrame(update);
        if (!visible) return;
        const c = propsRef.current;
        program.uniforms.uTime.value = reduce ? 0 : t * 0.001;
        program.uniforms.uSpeed.value = c.speed;
        program.uniforms.uIntensity.value = c.intensity;
        program.uniforms.uOpacity.value = c.opacity;
        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(update);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener('resize', resize);
        if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      };
    })();

    return () => { disposed = true; if (cleanup) cleanup(); };
  }, []);

  return <div ref={ctnDom} className={`strands-container ${className}`.trim()} style={style} />;
}

window.Strands = Strands;
module.exports = { Strands };
