/*
 * The page's small parts: the language context, scroll hooks, the phone frame,
 * store buttons and count-ups. Everything renders the same on the server
 * (prerender) and in the browser; motion starts only after hydration.
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from 'react';
import { COPY, LINKS, type Copy, type Lang } from './content';

type Site = { lang: Lang; t: Copy; base: string };
const SiteCtx = createContext<Site>({ lang: 'hi', t: COPY.hi, base: './' });

export function SiteProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  // Hindi lives at the root, English at /en/ — assets are always one folder up from English.
  const value: Site = { lang, t: COPY[lang], base: lang === 'en' ? '../' : './' };
  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}
export const useSite = () => useContext(SiteCtx);

export const inr = (n: number) => '₹' + new Intl.NumberFormat('en-IN').format(n);
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True once the element has come into view (stays true). False on the server. */
export function useInView<T extends Element>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return setSeen(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, seen] as const;
}

/** Runs `frame` on scroll and resize, at most once per animation frame. */
export function useScrollFrame(frame: () => void) {
  const cb = useRef(frame);
  cb.current = frame;
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      cb.current();
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
}

/**
 * A block that rises in as it scrolls into view. The motion is pure CSS tied to
 * the scroll position (styles.css, `.reveal`), so it cannot get stuck half-way:
 * no observer, no hidden state, and browsers without scroll timelines just show it.
 */
export function Reveal({
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}: {
  as?: 'div' | 'li' | 'section' | 'p' | 'span' | 'figure' | 'header';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [k: string]: unknown;
}) {
  const El = Tag as 'div';
  return (
    <El className={`reveal ${className}`} style={style} {...rest}>
      {children}
    </El>
  );
}

/** Counts up to `value` when first seen; the server and no-JS show the value itself. */
export function CountUp({ value, format = inr, ms = 1700 }: { value: number; format?: (n: number) => string; ms?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>('0px');
  const [shown, setShown] = useState(value);
  const done = useRef(false);
  useEffect(() => {
    if (!seen || done.current || reducedMotion()) return;
    done.current = true;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setShown(Math.round(value * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, ms]);
  return (
    <span ref={ref} className="num" aria-label={format(value)}>
      <span aria-hidden="true">{format(shown)}</span>
    </span>
  );
}

export type ScreenName =
  | 'home' | 'rates' | 'money' | 'lorry' | 'papers' | 'repeat' | 'madam' | 'level'
  | 'ask' | 'review' | 'login' | 'updates' | 'home-night' | 'money-night';

/**
 * An app screenshot. Only the 720 and 1080 px files are offered: with a 400 px
 * choice, Chrome on a 2× phone picked it for a ~230 px phone and the text went soft.
 */
export function ScreenImg({ name, alt, priority }: { name: ScreenName; alt: string; priority?: boolean }) {
  const { base } = useSite();
  const src = (w: number) => `${base}media/screens/${name}-${w}.webp`;
  return (
    <img
      src={src(720)}
      srcSet={`${src(720)} 720w, ${src(1080)} 1080w`}
      sizes="(max-width: 700px) 72vw, 360px"
      width={1080}
      height={2341}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
    />
  );
}

export function Phone({
  screen,
  alt,
  width = 'clamp(240px, 26vw, 330px)',
  priority,
  className = '',
  style,
  children
}: {
  screen: ScreenName;
  alt: string;
  width?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className={`phone ${className}`} style={{ ['--pw' as string]: width, ...style }}>
      <span className="phone__btn a" aria-hidden="true" />
      <span className="phone__btn b" aria-hidden="true" />
      <span className="phone__btn c" aria-hidden="true" />
      <div className="phone__screen">
        <ScreenImg name={screen} alt={alt} priority={priority} />
        {children}
        <span className="phone__island" aria-hidden="true" />
      </div>
    </div>
  );
}

/* The stores' own marks, monochrome (shapes after Simple Icons, CC0). */
function PlayGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff4dc" aria-hidden="true">
      <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
    </svg>
  );
}
function AppleGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff4dc" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function StoreButtons({ className = '' }: { className?: string }) {
  const { t } = useSite();
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a className="store" href={LINKS.play} target="_blank" rel="noopener">
        <PlayGlyph />
        <span>
          <small>{t.store.playSmall}</small>
          <b>{t.store.playBig}</b>
        </span>
      </a>
      <a className="store" href={LINKS.ios} target="_blank" rel="noopener">
        <AppleGlyph />
        <span>
          <small>{t.store.iosSmall}</small>
          <b>{t.store.iosBig}</b>
        </span>
      </a>
    </div>
  );
}

export function Example({ children }: { children?: ReactNode }) {
  const { t } = useSite();
  return <span className="example">{children ?? t.common.example}</span>;
}

/** An endless strip; the second copy is hidden from screen readers. */
export function Ticker({ items, label, className = '' }: { items: string[]; label?: string; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="ticker__row" aria-hidden={hidden || undefined} style={{ listStyle: 'none', margin: 0 }}>
      {items.map((x, i) => (
        <li className="ticker__item" key={i}>
          {x}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`ticker ${className}`} role="group" aria-label={label}>
      {row(false)}
      {row(true)}
    </div>
  );
}
