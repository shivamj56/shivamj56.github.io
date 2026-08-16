/* FlyingPosters — React Bits (JS + CSS variant), adapted for this project:
   - no bundler imports: ogl is loaded as an ES module from CDN at runtime
   - exported on window for <x-import>
   - IMPORTANT DEVIATION: the upstream component binds wheel/mouse/touch to
     `window` and preventDefaults the wheel, which hijacks page scrolling.
     Here the poster reel is driven by the page's own scroll position as the
     section passes through the viewport, and dragging is scoped to the canvas.
     Nothing is stolen from the document. */
const { useRef, useEffect } = React;

const vertexShader = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;
varying vec2 vUv;
varying vec3 vNormal;
float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(
      oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0, 0.0, 0.0, 1.0
    );
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}
float qinticInOut(float t) {
  return t < 0.5 ? 16.0 * pow(t, 5.0) : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}
void main() {
  vUv = uv;
  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion), 0., 2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;
varying vec2 vUv;
void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;
  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);
  if (planeAspect > imageAspect) { scale.x = imageAspect / planeAspect; }
  else { scale.y = planeAspect / imageAspect; }
  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;
  gl_FragColor = texture2D(tMap, uv);
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

const lerp = (p1, p2, t) => p1 + (p2 - p1) * t;
const map = (num, min1, max1, min2, max2) => ((num - min1) / (max1 - min1)) * (max2 - min2) + min2;

function makeClasses(ogl) {
  const { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } = ogl;

  class Media {
    constructor({ gl, geometry, scene, screen, viewport, image, length, index, planeWidth, planeHeight, distortion }) {
      Object.assign(this, { extra: 0, gl, geometry, scene, screen, viewport, image, length, index, planeWidth, planeHeight, distortion });
      this.createShader();
      this.createMesh();
      this.onResize();
    }
    createShader() {
      const texture = new Texture(this.gl, { generateMipmaps: false });
      this.program = new Program(this.gl, {
        depthTest: false, depthWrite: false,
        fragment: fragmentShader, vertex: vertexShader,
        uniforms: {
          tMap: { value: texture },
          uPosition: { value: 0 },
          uPlaneSize: { value: [0, 0] },
          uImageSize: { value: [0, 0] },
          uSpeed: { value: 0 },
          rotationAxis: { value: [0, 1, 0] },
          distortionAxis: { value: [1, 1, 0] },
          uDistortion: { value: this.distortion },
          uViewportSize: { value: [this.viewport.width, this.viewport.height] },
          uTime: { value: 0 }
        },
        cullFace: false
      });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.image;
      img.onload = () => {
        texture.image = img;
        this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
      };
    }
    createMesh() {
      this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
      this.plane.setParent(this.scene);
    }
    setScale() {
      const aspect = this.planeWidth / this.planeHeight;
      // 0.86 leaves a margin so the whole screen capture stays inside the frustum
      const h = Math.min(this.planeHeight, this.screen.height * 0.86);
      const w = h * aspect;
      this.plane.scale.x = (this.viewport.width * w) / this.screen.width;
      this.plane.scale.y = (this.viewport.height * h) / this.screen.height;
      this.plane.position.x = 0;
      this.plane.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
    }
    onResize({ screen, viewport } = {}) {
      if (screen) this.screen = screen;
      if (viewport) {
        this.viewport = viewport;
        this.plane.program.uniforms.uViewportSize.value = [this.viewport.width, this.viewport.height];
      }
      this.setScale();
      this.padding = 5;
      this.height = this.plane.scale.y + this.padding;
      this.heightTotal = this.height * this.length;
      this.y = -this.heightTotal / 2 + (this.index + 0.5) * this.height;
    }
    update(scroll) {
      this.plane.position.y = this.y - scroll.current - this.extra;
      this.program.uniforms.uPosition.value = map(this.plane.position.y, -this.viewport.height, this.viewport.height, 5, 15);
      this.program.uniforms.uTime.value += 0.04;
      this.program.uniforms.uSpeed.value = scroll.current;
      const h = this.plane.scale.y, vh = this.viewport.height;
      if (this.plane.position.y + h / 2 < -vh / 2) this.extra -= this.heightTotal;
      else if (this.plane.position.y - h / 2 > vh / 2) this.extra += this.heightTotal;
    }
  }

  class Canvas {
    constructor({ container, canvas, items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ, scrollRange, stepSync, progressSelector, steps, entryDelay }) {
      Object.assign(this, { container, canvas, items, planeWidth, planeHeight, distortion, cameraFov, cameraZ, scrollRange });
      this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0, position: 0 };
      this.raf = this.raf.bind(this);
      this.step = this.step.bind(this);
      this.syncSteps = this.syncSteps.bind(this);
      this.onResize = this.onResize.bind(this);
      this.onPageScroll = this.onPageScroll.bind(this);
      this.onDown = this.onDown.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onUp = this.onUp.bind(this);

      this.renderer = new Renderer({ canvas, alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
      this.gl = this.renderer.gl;
      this.camera = new Camera(this.gl);
      this.camera.fov = cameraFov;
      this.camera.position.z = cameraZ;
      this.scene = new Transform();
      this.onResize();
      this.planeGeometry = new Plane(this.gl, { heightSegments: 1, widthSegments: 100 });
      this.medias = items.map((image, index) => new Media({
        gl: this.gl, geometry: this.planeGeometry, scene: this.scene,
        screen: this.screen, viewport: this.viewport, image,
        length: items.length, index, planeWidth, planeHeight, distortion
      }));
      if (this.medias[0]) this.scrollRange = this.medias[0].heightTotal;
      this.stepSync = stepSync;
      this.progressSelector = progressSelector;
      this.steps = steps || [];
      this.entryDelay = entryDelay == null ? 3000 : entryDelay;
      this.ready = false;
      this.canvas.style.opacity = '0';
      this.canvas.style.transition = 'opacity .8s ease';
      this.armEntry = () => {
        if (this._armed || this.dormant) return;
        const r = this.container.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        this._armed = true;
        setTimeout(() => {
          this.ready = true;
          this.canvas.style.opacity = '1';
          [this.nodeL, this.nodeR].forEach(n => { if (n) n.style.transition = 'opacity .6s ease'; });
        }, this.entryDelay);
      };
      /* IntersectionObserver is delivered on the rendering steps, which are
         suspended when the frame is not painting — so the scroll handler arms
         the entry too. Whichever fires first wins; _armed makes it idempotent. */
      this.entryIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) this.armEntry();
        });
      }, { threshold: 0.05 });
      this.entryIO.observe(this.container);
      this.leftNodes = items.map(() => null);
      this.rightNodes = items.map(() => null);
      this.addEventListeners();
      this.onPageScroll();
      this.frame = requestAnimationFrame(this.raf);
    }
    onResize() {
      const rect = this.container.getBoundingClientRect();
      /* Hidden at the mobile breakpoint: with a 0x0 box the camera aspect is
         NaN, so skip all GL work rather than render garbage every scroll. */
      this.dormant = rect.width < 2 || rect.height < 2;
      if (this.dormant) {
        this.screen = this.screen || { width: 1, height: 1 };
        this.viewport = this.viewport || { width: 1, height: 1 };
        return;
      }
      this.screen = { width: rect.width, height: rect.height };
      this.renderer.setSize(this.screen.width, this.screen.height);
      this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });
      const fov = (this.camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
      this.viewport = { height, width: height * this.camera.aspect };
      if (this.medias) this.medias.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }));
      if (this.medias && this.medias[0]) this.scrollRange = this.medias[0].heightTotal;
      this.onPageScroll();
    }
    /* page scroll drives the reel — the section's travel through the viewport
       maps onto the full poster run, so nothing hijacks the wheel */
    onPageScroll() {
      /* When the rig is pinned, this.container stops moving — so progress has to
         come from the tall track that owns the section's scroll length. Mapping
         the run onto exactly the pinned duration means every step is revealed
         while the reel and its caption are actually on screen. */
      if (this.armEntry) this.armEntry();
      if (this.progressSelector) {
        if (!this.progressEl) this.progressEl = document.querySelector(this.progressSelector);
        if (this.progressEl) {
          const r = this.progressEl.getBoundingClientRect();
          const span = Math.max(1, r.height - window.innerHeight);
          const raw = Math.min(1, Math.max(0, -r.top / span));
          let p;
          if (!this.ready) {
            this._p0 = raw;          // where the reveal will hand over
            p = 0;                   // hold on the first screen
          } else {
            if (this.releaseP == null) this.releaseP = this._p0 || 0;
            const room = Math.max(0.08, 1 - this.releaseP);
            p = Math.min(1, Math.max(0, (raw - this.releaseP) / room));
          }
          this.scroll.target = this.dragOffset + (p - 0.5) * this.scrollRange;
          this.step(this.ready ? 0.34 : 1);
          return;
        }
      }
      const rect = this.container.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const progress = (window.innerHeight - rect.top) / travel;
      this.scroll.target = this.dragOffset + (progress - 0.5) * this.scrollRange;
      this.step(0.34);
    }
    onDown(e) {
      this.isDown = true;
      this.startY = e.touches ? e.touches[0].clientY : e.clientY;
      this.dragStart = this.dragOffset;
    }
    onMove(e) {
      if (!this.isDown) return;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      this.dragOffset = this.dragStart + (this.startY - y) * 0.06;
      this.onPageScroll();
    }
    onUp() { this.isDown = false; }
    step(ease) {
      if (!this.renderer || this.dormant) return;
      const e = ease == null ? this.scroll.ease : ease;
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, e);
      if (this.medias) this.medias.forEach(m => m.update(this.scroll));
      this.renderer.render({ scene: this.scene, camera: this.camera });
      this.syncSteps();
      this.scroll.last = this.scroll.current;
    }
    /* Two drivers on purpose. requestAnimationFrame gives the eased motion, but
       it is suspended whenever the frame is backgrounded or not being painted —
       so the scroll handler advances the simulation too. Either alone is enough
       for the section to work; together they stay smooth and never freeze. */
    raf(t) {
      this.step();
      this.frame = requestAnimationFrame(this.raf);
    }
    /* One caption pair exists; the host swaps its text when the active step
       changes. Only transform and opacity are written here, so nothing this
       loop does can affect layout. */
    syncSteps() {
      if (!this.stepSync || !this.medias) return;
      if (!this.nodeL) this.nodeL = document.querySelector('[data-step-left]');
      if (!this.nodeR) this.nodeR = document.querySelector('[data-step-right]');
      if (!this.nodeL && !this.nodeR) return;
      if (!this.ready) {
        if (this.nodeL) this.nodeL.style.opacity = '0';
        if (this.nodeR) this.nodeR.style.opacity = '0';
        return;
      }
      let best = 0, bestA = Infinity, bestD = 0;
      for (let i = 0; i < this.medias.length; i++) {
        const half = (this.medias[i].height || this.viewport.height) / 2;
        const d = this.medias[i].plane.position.y / half;
        const a = Math.abs(d);
        if (a < bestA) { bestA = a; best = i; bestD = d; }
      }
      const narrow = window.innerWidth <= 820;
      const lx = narrow ? 24 : 120, ly = narrow ? 0 : 78, rx = narrow ? 15 : 74, ry = narrow ? 0 : 44;
      const a = Math.min(1, bestA), d = Math.max(-1, Math.min(1, bestD));
      const o = (0.34 + 0.66 * (1 - a)).toFixed(3);
      if (this.nodeL) {
        this.nodeL.style.opacity = o;
        this.nodeL.style.transform = 'translate3d(' + (-a * lx).toFixed(1) + 'px,' + (-d * ly).toFixed(1) + 'px,0)';
      }
      if (this.nodeR) {
        this.nodeR.style.opacity = o;
        this.nodeR.style.transform = 'translate3d(' + (a * rx).toFixed(1) + 'px,' + (-d * ry).toFixed(1) + 'px,0)';
      }
      if (best !== this._active) {
        this._active = best;
        const s = this.steps && this.steps[best];
        if (s && this.nodeL && this.nodeR) {
          const set = (root, sel, val) => { const n = root.querySelector(sel); if (n && n.textContent !== val) n.textContent = val; };
          set(this.nodeL, '[data-cap="tag"]', s.tag);
          set(this.nodeL, '[data-cap="num"]', s.num);
          set(this.nodeL, '[data-cap="title"]', s.title);
          set(this.nodeR, '[data-cap="body"]', s.body);
        }
      }
    }
    addEventListeners() {
      window.addEventListener('resize', this.onResize);
      window.addEventListener('scroll', this.onPageScroll, { passive: true });
      this.canvas.addEventListener('mousedown', this.onDown);
      window.addEventListener('mousemove', this.onMove);
      window.addEventListener('mouseup', this.onUp);
      this.canvas.addEventListener('touchstart', this.onDown, { passive: true });
      this.canvas.addEventListener('touchmove', this.onMove, { passive: true });
      this.canvas.addEventListener('touchend', this.onUp);
    }
    destroy() {
      if (this.entryIO) this.entryIO.disconnect();
      cancelAnimationFrame(this.frame);
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('scroll', this.onPageScroll);
      this.canvas.removeEventListener('mousedown', this.onDown);
      window.removeEventListener('mousemove', this.onMove);
      window.removeEventListener('mouseup', this.onUp);
      this.canvas.removeEventListener('touchstart', this.onDown);
      this.canvas.removeEventListener('touchmove', this.onMove);
      this.canvas.removeEventListener('touchend', this.onUp);
    }
  }
  Canvas.prototype.dragOffset = 0;
  return Canvas;
}

function FlyingPosters({
  items = [],
  planeWidth = 300,
  planeHeight = 640,
  distortion = 3,
  scrollEase = 0.06,
  cameraFov = 45,
  cameraZ = 20,
  scrollRange = 34,
  stepSync = true,
  progressSelector = '[data-manual-track]',
  entryDelay = 3000,
  steps,
  className = '',
  style
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const itemsKey = items.join('|');
  if (instanceRef.current && steps) { instanceRef.current.steps = steps; instanceRef.current._active = -1; }

  useEffect(() => {
    if (!containerRef.current || !items.length) return;
    let disposed = false;
    (async () => {
      try {
        const ogl = await loadOgl();
        if (disposed || instanceRef.current) return;
        const Canvas = makeClasses(ogl);
        const inst = new Canvas({
          container: containerRef.current, canvas: canvasRef.current,
          items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ, scrollRange, stepSync, progressSelector, steps, entryDelay
        });
        inst.dragOffset = 0;
        if (!inst.frame) inst.frame = requestAnimationFrame(inst.raf);
        instanceRef.current = inst;
      } catch (err) {
        console.warn('FlyingPosters init failed: ' + (err && (err.stack || err.message) || err));
      }
    })();
    return () => { disposed = true; };
  }, [itemsKey, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ, scrollRange, stepSync, progressSelector]);

  useEffect(() => () => {
    if (instanceRef.current) { instanceRef.current.destroy(); instanceRef.current = null; }
  }, []);

  return (
    <div ref={containerRef} className={`posters-container ${className}`.trim()} style={style}>
      <canvas ref={canvasRef} className="posters-canvas" />
    </div>
  );
}

window.FlyingPosters = FlyingPosters;
module.exports = { FlyingPosters };
