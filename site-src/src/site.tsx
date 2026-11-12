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

export function Reveal({
  as: Tag = 'div',
  delay = 0,
  blur = false,
  className = '',
  style,
  children,
  ...rest
}: {
  as?: 'div' | 'li' | 'section' | 'p' | 'span' | 'figure' | 'header';
  delay?: number;
  blur?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [k: string]: unknown;
}) {
  const [ref, seen] = useInView<HTMLElement>();
  const El = Tag as 'div';
  return (
    <El
      ref={ref as never}
      className={`reveal${blur ? ' blur' : ''}${seen ? ' is-in' : ''} ${className}`}
      style={{ ['--d' as string]: `${delay}ms`, ...style }}
      {...rest}
    >
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

export function ScreenImg({ name, alt, priority, sizes }: { name: ScreenName; alt: string; priority?: boolean; sizes?: string }) {
  const { base } = useSite();
  const src = (w: number) => `${base}media/screens/${name}-${w}.webp`;
  return (
    <img
      src={src(720)}
      srcSet={`${src(400)} 400w, ${src(720)} 720w, ${src(1080)} 1080w`}
      sizes={sizes ?? '(max-width: 700px) 66vw, 330px'}
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
  sizes,
  className = '',
  style,
  children
}: {
  screen: ScreenName;
  alt: string;
  width?: string;
  priority?: boolean;
  sizes?: string;
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
        <ScreenImg name={screen} alt={alt} priority={priority} sizes={sizes} />
        {children}
        <span className="phone__island" aria-hidden="true" />
        <span className="phone__glare" aria-hidden="true" />
      </div>
    </div>
  );
}

function PlayGlyph() {
  return (
    <svg width="26" height="28" viewBox="0 0 26 28" aria-hidden="true">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#f26b1d" />
        </linearGradient>
      </defs>
      <path d="M3.2 1.6c-.7.4-1.2 1.2-1.2 2.2v20.4c0 1 .5 1.8 1.2 2.2l12.2-12.4L3.2 1.6z" fill="url(#pg)" />
      <path d="M19.6 9.8 15.4 14l4.2 4.2 4.6-2.6c1.5-.9 1.5-2.4 0-3.2l-4.6-2.6z" fill="#ffd27a" />
      <path d="M3.2 1.6 15.4 14l4.2-4.2L5.6 1.8c-.9-.5-1.7-.6-2.4-.2z" fill="#fff4dc" />
      <path d="M3.2 26.4c.7.4 1.5.3 2.4-.2l14-8L15.4 14 3.2 26.4z" fill="#e8590c" />
    </svg>
  );
}
function AppStoreGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#fff4dc" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M13.8 4.5 7 18.5" />
      <path d="M12.2 4.5 19 18.5" />
      <path d="M5 15.5h16" />
      <path d="M4 21.5h4.5M17.5 21.5H22" stroke="#ffd27a" />
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
        <AppStoreGlyph />
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
