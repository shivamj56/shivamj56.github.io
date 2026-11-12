/*
 * Night turns to morning as you scroll: the sun climbs out of the hero's
 * horizon line, the sky goes saffron, then चंदन — and with the morning,
 * today's best rate rises into view. "हर सुबह, सबसे अच्छा भाव।"
 */
import { Fragment, useRef } from 'react';
import { Sunrise } from 'lucide-react';
import { Example, useScrollFrame, useSite } from '../site';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => x * x * (3 - 2 * x);

export function Dawn() {
  const { t } = useSite();
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const c = t.rate.card;

  useScrollFrame(() => {
    const w = wrap.current, s = stage.current;
    if (!w || !s) return;
    const r = w.getBoundingClientRect();
    const p = clamp01(-r.top / Math.max(1, r.height - window.innerHeight));
    const rise = ease(clamp01((p - 0.04) / 0.62));
    const night = 1 - ease(clamp01((p - 0.02) / 0.42));
    const day = ease(clamp01((p - 0.5) / 0.34));
    const glow = Math.sin(Math.PI * clamp01((p - 0.04) / 0.8)) * (1 - day * 0.6);
    s.style.setProperty('--rise', rise.toFixed(4));
    s.style.setProperty('--night', night.toFixed(4));
    s.style.setProperty('--glow', glow.toFixed(4));
    s.style.setProperty('--day', day.toFixed(4));
    s.dataset.day = day > 0.5 ? '1' : '0';
  });

  const words = t.dawn.title.split(' ');
  return (
    <section id="dawn" ref={wrap} className="dawn" aria-labelledby="dawn-title">
      <div ref={stage} className="dawn__stage grain">
        <div className="dawn__sky n" />
        <div className="dawn__stars" aria-hidden="true" style={STARS} />
        <div className="dawn__sky g" />
        <div className="rays" aria-hidden="true" />
        <div className="sun" aria-hidden="true" />
        <div className="dawn__sky d" style={{ mixBlendMode: 'normal', opacity: 'calc(var(--day) * 0.55)' }} />
        <div className="dawn__line" aria-hidden="true" />
        <div className="dawn__copy">
          <p className="inline-flex justify-center items-center gap-2 text-[15px] font-semibold mb-5" style={{ opacity: 'calc(0.4 + var(--rise) * 0.6)' }}>
            <Sunrise size={18} aria-hidden="true" /> {t.rate.kicker}
          </p>
          <h2 id="dawn-title" className="display dawn__title">
            {words.map((wd, i) => (
              <Fragment key={i}>
                <span className="w" style={{ ['--i' as string]: i }}>
                  {wd}
                </span>
                {i < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h2>
          <p className="dawn__sub" style={{ opacity: 'calc(var(--rise) * 0.9)' }}>
            {t.dawn.sub}
          </p>

          <div
            className="glass mx-auto mt-10 w-[min(440px,100%)] p-5 text-left"
            style={{
              opacity: 'var(--day)',
              transform: 'translateY(calc((1 - var(--day)) * 60px)) scale(calc(0.94 + var(--day) * 0.06))',
              color: 'var(--color-ink)'
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-[var(--color-saffron-hi)]">{t.hero.chipBest}</span>
              <Example />
            </div>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <div className="font-semibold text-[17px]">Gandak Bio-Energy</div>
                <div className="text-[13px] text-[var(--color-muted)]">
                  44 {c.km} · {c.payDays.replace('{n}', '30')}
                </div>
              </div>
              <div className="text-right">
                <div className="num font-bold text-[34px] leading-none text-[var(--color-tulsi)]">₹2,474</div>
                <div className="text-[12.5px] text-[var(--color-muted)] mt-1">{c.perQtl} · {c.inHand}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// A sky of fixed stars drawn by the stylesheet alone — no canvas needed this far down.
const dots = [
  [7, 12], [18, 30], [27, 8], [36, 22], [44, 6], [52, 28], [61, 14], [70, 34], [79, 9], [88, 24], [94, 40],
  [12, 46], [23, 58], [40, 44], [57, 50], [66, 60], [83, 52], [5, 62], [31, 36], [48, 16], [75, 20], [91, 12]
];
const STARS = {
  backgroundImage: dots
    .map(([x, y], i) => `radial-gradient(${i % 5 === 0 ? 1.6 : 1}px ${i % 5 === 0 ? 1.6 : 1}px at ${x}% ${y}%, #fff3e4 60%, transparent 62%)`)
    .join(',')
};
