/*
 * The opening: night, a line of light on the horizon, streaks that rush into
 * it — the app's own intro, told in the browser — and the phone playing the
 * real intro film before it settles on the night-mode Home.
 */
import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Crown, Phone as PhoneIcon, RotateCcw, TrendingUp } from 'lucide-react';
import { LINKS } from '../content';
import { Example, Phone, StoreButtons, reducedMotion, useSite } from '../site';

const HORIZON = 0.74; // same as .horizon's --hz

/* ---------- nav ---------- */
export function Nav() {
  const { t, lang, base } = useSite();
  const ref = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);
  const [tone, setTone] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // The bar takes the tone of whichever section sits under it.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setTone((e.target as HTMLElement).dataset.tone === 'light' ? 'light' : 'dark');
      },
      { rootMargin: '-36px 0px -92% 0px' }
    );
    document.querySelectorAll<HTMLElement>('[data-tone]').forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  const links: [string, string][] = [
    ['#rate', t.nav.rate],
    ['#money', t.nav.money],
    ['#lorry', t.nav.lorry],
    ['#madam', t.nav.madam],
    ['#levels', t.nav.levels],
    ['#whatsapp', t.nav.whatsapp],
    ['#join', t.nav.join]
  ];
  const other = lang === 'hi' ? 'en' : 'hi';
  return (
    <header ref={ref} className="nav" data-solid={solid ? '1' : '0'} data-tone={tone}>
      <div className="wrap nav__bar">
        <a href="#top" className="flex items-center gap-2.5 mr-auto" aria-label={t.nav.home}>
          <img src={`${base}media/brand/mark.webp`} width={192} height={360} alt="" style={{ height: 36, width: 'auto' }} />
          <span className="brand-word text-[19px] leading-none pt-0.5">OSHT</span>
        </a>
        <nav aria-label={t.nav.label} className="nav__links hidden lg:flex items-center">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="nav__lang" href={lang === 'hi' ? `${base}en/` : base} hrefLang={other} lang={other} title={t.meta.switchTo}>
          {t.meta.other}
        </a>
        <a className="nav__cta" href="#get">
          {t.nav.getApp}
        </a>
      </div>
    </header>
  );
}

/* ---------- the night sky: stars, the rush into the horizon, embers ---------- */
function Sky() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const still = reducedMotion();
    let w = 0, h = 0, dpr = 1, raf = 0, running = true, visible = true;
    type Star = { x: number; y: number; r: number; tw: number; ph: number };
    type Streak = { x: number; y: number; tx: number; ty: number; v: number; len: number; life: number; hue: number };
    type Ember = { x: number; y: number; vy: number; vx: number; life: number; max: number; r: number };
    let stars: Star[] = [];
    const streaks: Streak[] = [];
    const embers: Ember[] = [];
    const t0 = performance.now();

    const size = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(220, (w * h) / 6500));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * HORIZON * 0.98,
        r: Math.random() < 0.08 ? 1.5 : Math.random() * 0.9 + 0.3,
        tw: 0.6 + Math.random() * 1.8,
        ph: Math.random() * Math.PI * 2
      }));
    };
    size();

    // The opening rush: lines from the top and bottom edges, all aiming at the horizon's middle.
    if (!still) {
      for (let i = 0; i < Math.min(160, w / 6); i++) {
        const top = Math.random() < 0.55;
        const x = Math.random() * w;
        streaks.push({
          x, y: top ? -Math.random() * h * 0.4 : h + Math.random() * h * 0.4,
          tx: w / 2 + (x - w / 2) * 0.12, ty: h * HORIZON,
          v: 0.9 + Math.random() * 1.6, len: 40 + Math.random() * 140,
          life: -Math.random() * 900, hue: Math.random()
        });
      }
    }

    const draw = (now: number) => {
      raf = 0;
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = still ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.tw + s.ph));
        ctx.globalAlpha = a * Math.min(1, t * 0.8 + (still ? 1 : 0));
        ctx.fillStyle = s.r > 1.2 ? '#ffe2b0' : '#fff3e4';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineCap = 'round';
      for (const s of streaks) {
        s.life += 16;
        if (s.life < 0) continue;
        const dx = s.tx - s.x, dy = s.ty - s.y, d = Math.hypot(dx, dy);
        if (d < 4) continue;
        const step = Math.min(d, s.v * (6 + s.life / 30));
        s.x += (dx / d) * step; s.y += (dy / d) * step;
        const k = Math.max(0, Math.min(1, d / (h * 0.5)));
        const g = ctx.createLinearGradient(s.x, s.y, s.x - (dx / d) * s.len, s.y - (dy / d) * s.len);
        const c = s.hue < 0.5 ? '255,196,120' : '255,236,210';
        g.addColorStop(0, `rgba(${c},${0.85 * k})`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - (dx / d) * s.len * k, s.y - (dy / d) * s.len * k);
        ctx.stroke();
      }
      // Embers rise from the horizon once the rush has landed.
      if (!still && t > 1.6 && embers.length < 46 && Math.random() < 0.5) {
        embers.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.7, y: h * HORIZON,
          vy: -(0.15 + Math.random() * 0.45), vx: (Math.random() - 0.5) * 0.15,
          life: 0, max: 260 + Math.random() * 380, r: Math.random() * 1.4 + 0.4
        });
      }
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++; e.x += e.vx + Math.sin((e.life + i) / 40) * 0.12; e.y += e.vy;
        const a = Math.sin((e.life / e.max) * Math.PI);
        if (e.life > e.max) { embers.splice(i, 1); continue; }
        ctx.globalAlpha = a * 0.85;
        ctx.fillStyle = '#ffb35c';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running && visible && !still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !still) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    const onVis = () => {
      running = !document.hidden;
      if (running && visible && !raf && !still) raf = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', onVis);
    const onResize = () => { size(); if (still) requestAnimationFrame(draw); };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" />;
}

/* ---------- the phone: splash → the app's intro film → night Home ---------- */
function HeroPhone() {
  const { t, base } = useSite();
  const box = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLVideoElement | null>(null);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const screen = box.current?.querySelector('.phone__screen');
    const splash = box.current?.querySelector<HTMLElement>('.splash');
    if (!screen || !splash) return;
    if (reducedMotion()) {
      splash.classList.add('is-off');
      return;
    }
    const v = document.createElement('video');
    v.className = 'film';
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('aria-hidden', 'true');
    v.preload = 'auto';
    v.src = `${base}media/film/intro.mp4`;
    screen.insertBefore(v, splash);
    film.current = v;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      v.classList.add('is-off');
      splash.classList.add('is-off');
      setOver(true);
    };
    const backstop = window.setTimeout(finish, 9000); // never leave the phone black
    v.addEventListener('playing', () => {
      v.classList.add('is-on');
      splash.classList.add('is-off');
    });
    v.addEventListener('ended', finish);
    v.addEventListener('error', finish);
    const start = window.setTimeout(() => v.play().catch(finish), 700);
    return () => {
      window.clearTimeout(backstop);
      window.clearTimeout(start);
      v.remove();
    };
  }, [base]);

  const replay = () => {
    const v = film.current;
    if (!v) return;
    setOver(false);
    v.currentTime = 0;
    v.classList.remove('is-off');
    v.play().catch(() => setOver(true));
  };

  return (
    <div ref={box} className="relative">
      <Phone
        screen="home-night"
        alt={t.hero.phoneAlt}
        priority
        width="clamp(232px, 62vw, 330px)"
        sizes="(max-width: 700px) 62vw, 330px"
        className="float"
      >
        <div className="splash" aria-hidden="true">
          <img src={`${base}media/brand/mark.webp`} alt="" width={192} height={360} />
        </div>
      </Phone>
      <button
        type="button"
        onClick={replay}
        className="absolute -bottom-14 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold rounded-full px-4 py-2 glass-dark transition-opacity duration-500"
        style={{ opacity: over ? 1 : 0, pointerEvents: over ? 'auto' : 'none' }}
        tabIndex={over ? 0 : -1}
      >
        <RotateCcw size={15} aria-hidden="true" /> {t.intro}
      </button>
    </div>
  );
}

/* ---------- the hero itself ---------- */
export function Hero() {
  const { t, base } = useSite();
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    if (reducedMotion()) return;
    let i = 0;
    const first = window.setTimeout(() => setLit(0), 1500);
    const id = window.setInterval(() => setLit((i = (i + 1) % 4)), 1900);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  const h = t.headline;
  const word = (i: number) => (
    <span className={`hl-word${lit === i ? ' is-lit' : ''}`}>{h.words[i]}</span>
  );

  return (
    <section id="top" className="hero grain on-night" data-tone="dark" aria-labelledby="hero-title">
      <Sky />
      <div className="horizon" aria-hidden="true" />
      <div className="wrap relative z-[2] grid lg:grid-cols-[1.12fr_0.88fr] items-center gap-x-12 gap-y-16 pt-[118px] pb-[110px] min-h-[100svh]">
        <div>
          <p className="reveal is-in inline-flex items-center gap-3 rounded-full pl-1.5 pr-4 py-1.5 glass-dark text-[14px] font-semibold text-[#f3d7b5]">
            <img src={`${base}media/brand/icon-night.webp`} alt="" width={28} height={28} className="rounded-[9px]" />
            {t.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display mt-7 text-[clamp(42px,7.4vw,88px)] leading-[1.14] text-balance">
            {word(0)}, {word(1)}, {word(2)} {h.and} {word(3)} —{' '}
            <span className="gold">{h.tail}</span>
          </h1>
          <p className="lead mt-6" style={{ color: '#e6d2bf' }}>
            {t.hero.sub}
          </p>
          <StoreButtons className="mt-9" />
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] text-[#e6d2bf]">
            <a href={LINKS.tel} className="inline-flex items-center gap-2 font-semibold text-[#ffd9a8] hover:text-white">
              <PhoneIcon size={17} aria-hidden="true" /> {t.hero.call} · <span className="num">{LINKS.telDisplay}</span>
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px] text-[#d9c3ae]" style={{ listStyle: 'none', padding: 0 }}>
            {t.hero.points.map((p) => (
              <li key={p} className="inline-flex items-center gap-2">
                <BadgeCheck size={17} className="text-[#e7b65c]" aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative justify-self-center lg:justify-self-end lg:mr-6">
          <HeroPhone />
          <div className="chip glass-dark left-[-10%] top-[-6%] sm:left-[-30%] sm:top-[16%]" style={{ ['--d' as string]: '2.6s' }}>
            <i style={{ background: 'linear-gradient(135deg,#ff9933,#f26b1d)', color: '#fff' }}>
              <TrendingUp size={18} aria-hidden="true" />
            </i>
            <span className="leading-tight">
              <span className="block text-[12px] text-[#e6c9a8]">{t.hero.chipBest}</span>
              <span className="flex items-center gap-2 text-[#fff3e4] text-[19px] font-semibold">
                <span className="num">₹2,474</span>
                <span className="text-[13px] font-medium text-[#e6c9a8]">{t.hero.chipInHand}</span>
              </span>
              <span className="block mt-1.5">
                <Example>{t.hero.example}</Example>
              </span>
            </span>
          </div>
          <div className="chip glass-dark right-[-8%] bottom-[14%] sm:right-[-24%] sm:bottom-[22%]" style={{ ['--d' as string]: '3s' }}>
            <i style={{ background: 'linear-gradient(135deg,#fbe3a6,#e7b65c 55%,#b8862b)', color: '#2a1408' }}>
              <Crown size={18} aria-hidden="true" />
            </i>
            <span className="text-[16px] font-semibold text-[#fbe3a6]">{t.hero.chipGold}</span>
          </div>
        </div>
      </div>
      <a href="#dawn" className="scroll-cue hidden lg:inline-flex absolute z-[3] bottom-5 left-1/2 -translate-x-1/2 text-[#f3d7b5]" aria-label={t.dawn.scroll}>
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
