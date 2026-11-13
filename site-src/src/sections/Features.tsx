/*
 * Morning: the three things a seller opens the app for — today's rate after
 * freight, the money, and where each lorry and its papers are.
 * Every figure is the app's own demo data, and labelled as an example.
 * Phones stand straight and nothing is laid over a screenshot.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  BellRing, Camera, CheckCircle2, CircleDashed, FileStack, MapPin, PhoneCall, SlidersHorizontal, Wheat, WifiOff
} from 'lucide-react';
import {
  CountUp, Example, Phone, Reveal, Ticker, fill, inr, reducedMotion, useInView, useScrollFrame, useSite
} from '../site';

/** Splits a title after its first phrase, so that phrase can carry the accent colour. */
export function splitLead(s: string): [string, string] {
  const m = s.match(/^(.+?[,.?:।])\s+(.+)$/);
  return m ? [m[1], m[2]] : ['', s];
}

export function SectionHead({ kicker, title, id, body, center = false }: { kicker: string; title: string; id?: string; body?: string; center?: boolean }) {
  const [lead, rest] = splitLead(title);
  return (
    <Reveal className={center ? 'text-center mx-auto max-w-[46rem]' : ''}>
      <p className="kicker">{kicker}</p>
      <h2 className="h2" id={id}>
        {lead ? <span className="accent">{lead}</span> : null}
        {lead ? ' ' : ''}
        {rest}
      </h2>
      {body ? <p className={`lead${center ? ' mx-auto' : ''}`}>{body}</p> : null}
    </Reveal>
  );
}

export function Points({ items, icons }: { items: { t: string; b: string }[]; icons: ReactNode[] }) {
  return (
    <ul className="points">
      {items.map((p, i) => (
        <Reveal as="li" key={p.t}>
          <span className="ic" aria-hidden="true">{icons[i]}</span>
          <span>
            <b>{p.t}</b>
            <p>{p.b}</p>
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

/* ---------- आज का भाव ---------- */
/** The grains' own colours, as the app draws their chips' dots and tags: maize gold, Sortex violet, Non-Sortex neel. */
const GRAIN_DOTS = ['#d4a017', '#7b61d1', '#3b7dd8'];

function RateCard() {
  const { t } = useSite();
  const c = t.rate.card;
  const [ref, seen] = useInView<HTMLDivElement>();
  const [mill, setMill] = useState(false); // false = in hand (after freight)
  // The tag swings once and the headline's marker is drawn once as the card comes into view; until
  // then — and for good under reduced motion — both simply stand at their end state.
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (!seen || reducedMotion()) return;
    setMoved(true);
    const id = window.setInterval(() => setMill((m) => !m), 3400);
    return () => window.clearInterval(id);
  }, [seen]);
  const big = mill ? 2490 : 2474;
  return (
    <div ref={ref} className="panel p-4 sm:p-5 w-[min(440px,100%)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[14px] font-semibold">
          <MapPin size={16} className="text-[var(--color-saffron)]" aria-hidden="true" /> {c.from}
        </div>
        <Example />
      </div>
      {/* सब first and on, as the app opens (13 Nov 2026). */}
      <div className="mt-3 flex flex-wrap gap-2" aria-hidden="true">
        <span className="grain-chip on">{c.all}</span>
        {c.grains.map((g, i) => (
          <span key={g} className="grain-chip">
            <i style={{ background: GRAIN_DOTS[i] }} />
            {g}
          </span>
        ))}
      </div>
      <div className="toggle mt-3" data-on={mill ? '1' : '0'} aria-hidden="true">
        <span className={mill ? '' : 'on'}>{c.tabInHand}</span>
        <span className={mill ? 'on' : ''}>{c.tabMill}</span>
      </div>
      <div className="card mt-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="num grid place-items-center w-9 h-9 shrink-0 rounded-[11px] text-white font-bold" style={{ background: 'linear-gradient(135deg,#ff9933,#f26b1d)' }}>
              1
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-[16px] sm:text-[17px] leading-tight">Gandak Bio-Energy</span>
              <span className="block text-[13px] text-[var(--color-muted)]">
                44 {c.km} · {fill(c.payDays, { n: 30 })}
              </span>
            </span>
          </div>
          <span className="shrink-0 flex flex-col items-end gap-1.5">
            <span className="rounded-full px-2.5 py-1 text-[12.5px] font-bold text-[var(--color-saffron-hi)] bg-[rgba(242,107,29,.1)]">{c.rank1}</span>
            {/* What this mill wants, under "#1", as on every card of the app. */}
            <span className={`grain-tag${moved ? ' swing' : ''}`}>
              <Wheat size={14} aria-hidden="true" />
              {c.grains[0]}
            </span>
          </span>
        </div>
        {/* The card's headline: the grain and the mill's rate for it. */}
        <div className={`offer-line mt-3${moved ? ' wipe' : ''}`}>
          <span>
            <b className="g">{c.grains[0]}</b>
            <span className="dot"> · </span>
            {c.millRate}
          </span>
          <span className="r num">
            ₹2,490<small>{c.perQtl.replace(/\s+/g, '')}</small>
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-muted)]">{mill ? c.millRate : c.inHand}</div>
            <div className="num font-bold leading-none text-[34px] sm:text-[40px] whitespace-nowrap transition-colors duration-500" style={{ color: mill ? 'var(--color-ink)' : 'var(--color-tulsi)' }}>
              {inr(big)}
              <span className="text-[13px] font-medium text-[var(--color-muted)] ml-1">{c.perQtl}</span>
            </div>
          </div>
          <div className="rounded-[14px] px-2.5 py-2 text-right bg-[rgba(46,125,79,.09)] max-w-[44%]">
            <div className="text-[11.5px] sm:text-[12px] font-semibold leading-tight text-[var(--color-tulsi)]">{c.perLorry}</div>
            <div className="num font-bold text-[16px] sm:text-[18px] whitespace-nowrap text-[var(--color-tulsi)]">₹7.42 {c.lakh}</div>
          </div>
        </div>
        <div className="sum mt-4">
          <div className="sum__box bg-[#fff1e3]">
            <b className="num">₹2,490</b>
            <span>{c.millRate}</span>
          </div>
          <span className="sum__op" aria-hidden="true">−</span>
          <div className="sum__box bg-[rgba(192,57,43,.08)] text-[var(--color-sindoor)]">
            <b className="num">₹16</b>
            <span>{c.freight}</span>
          </div>
          <span className="sum__op" aria-hidden="true">=</span>
          <div className="sum__box bg-[rgba(46,125,79,.09)] text-[var(--color-tulsi)]">
            <b className="num">₹2,474</b>
            <span>{c.inHand}</span>
          </div>
        </div>
      </div>
      <div className="card mt-3 px-4 py-3 flex items-center justify-between gap-3">
        <span className="min-w-0">
          <span className="block font-semibold text-[15px]">Saryu Agro Distillery</span>
          <span className="block text-[12.5px] text-[var(--color-sindoor)]">{fill(c.behind, { d: '36', l: '10,800' })}</span>
        </span>
        <span className="num font-bold text-[20px] shrink-0">₹2,438</span>
      </div>
      <p className="mt-3 text-[12.5px] text-[var(--color-muted)]">{c.note}</p>
    </div>
  );
}

export function Rates() {
  const { t } = useSite();
  const r = t.rate;
  return (
    <section id="rate" className="section day" data-tone="light" aria-labelledby="rate-h">
      <div className="wrap grid lg:grid-cols-[1fr_1fr] items-center gap-x-16 gap-y-12">
        <div>
          <SectionHead kicker={r.kicker} title={r.title} id="rate-h" body={r.body} />
          <Points items={r.points} icons={[<Wheat size={20} />, <MapPin size={20} />, <SlidersHorizontal size={20} />, <BellRing size={20} />]} />
        </div>
        <Reveal className="flex justify-center lg:justify-end">
          <RateCard />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- पैसा ---------- */
const WEEK = [7.01, 7.33, 7.77, 7.59, 7.33, 7.62, 7.67];

export function Money() {
  const { t } = useSite();
  const m = t.money;
  const c = m.card;
  return (
    <section id="money" className="section day-2" data-tone="light" aria-labelledby="money-h">
      <div className="wrap grid lg:grid-cols-[1fr_1fr] items-center gap-x-16 gap-y-12">
        <Reveal className="order-2 lg:order-1 card p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] font-semibold text-[var(--color-muted)]">{c.due}</span>
            <Example />
          </div>
          <div className="bigmoney mt-2">
            <CountUp value={2151100} />
          </div>
          <div className="mt-2 text-[16px] font-semibold text-[var(--color-muted)]">{c.dueSub}</div>
          <div className="mt-5 rounded-[18px] bg-[#fff3e6] px-4 py-3 flex items-center justify-between gap-3">
            <span className="text-[14px] font-semibold text-[var(--color-muted)]">{c.month}</span>
            <span className="num font-bold text-[22px]">₹14,23,450</span>
          </div>
          <div className="mt-6 text-[14px] font-semibold text-[var(--color-muted)]">{c.next7}</div>
          <div className="week mt-3" aria-hidden="true">
            {WEEK.map((v, i) => (
              <div key={i} className={`week__bar${i === 0 ? ' today' : ''}`} style={{ height: `${46 + ((v - 6.9) / 0.9) * 54}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-[5px] sm:gap-2">
            {WEEK.map((v, i) => (
              <div key={i} className="week__lbl">
                {c.days[i]}
                <span className="num">{v.toFixed(2)} L</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {c.filters.map((f, i) => (
              <span key={f} className={`pill${i === 0 ? ' on' : ''}`}>
                {f}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-[20px] border border-[rgba(122,63,20,.12)] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className="num block font-bold text-[18px]">BR06H3300</span>
                <span className="block text-[13.5px] text-[var(--color-muted)]">Saryu Agro Distillery · PO-2026-000018</span>
              </span>
              <span className="late">{c.late}</span>
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <span className="num font-bold text-[26px]">₹7,08,050</span>
              <span className="text-[13.5px] text-[var(--color-muted)]">{c.dueOn}</span>
            </div>
            <div className="mt-3 rounded-[14px] bg-[#fff1e3] py-2.5 text-center font-semibold text-[15px] inline-flex w-full justify-center items-center gap-2">
              <PhoneCall size={16} aria-hidden="true" /> {c.ask}
            </div>
          </div>
          <p className="mt-4 text-[12.5px] text-[var(--color-muted)]">{m.note}</p>
        </Reveal>
        <div className="order-1 lg:order-2">
          <SectionHead kicker={m.kicker} title={m.title} id="money-h" body={m.body} />
          <Points items={m.points} icons={[<CheckCircle2 size={20} />, <SlidersHorizontal size={20} />, <PhoneCall size={20} />]} />
        </div>
      </div>
    </section>
  );
}

/* ---------- गाड़ी और कागज़ ---------- */
function Truck({ style }: { style?: CSSProperties }) {
  return (
    <svg className="truck" viewBox="0 0 124 66" style={style} aria-hidden="true">
      <path d="M6 16 l6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6" fill="none" stroke="#2e7d4f" strokeWidth="1.6" />
      <rect x="4" y="14" width="74" height="32" rx="4" fill="#ffb238" />
      <rect x="4" y="14" width="74" height="7" rx="3" fill="#d6402b" />
      <path d="M9 27h64" stroke="#2e7d4f" strokeWidth="3" />
      <circle cx="41" cy="36" r="5" fill="#d6402b" />
      <circle cx="41" cy="36" r="2" fill="#ffe08a" />
      <path d="M80 20h20l13 14v12H80z" fill="#f26b1d" />
      <path d="M86 24h12l9 10H86z" fill="#cfeef7" />
      <rect x="2" y="46" width="114" height="4" rx="2" fill="#2a1408" />
      <rect x="112" y="38" width="8" height="8" rx="1.5" fill="#ffd27a" />
      {[22, 60, 100].map((x) => (
        <g key={x}>
          <circle cx={x} cy="52" r="8" fill="#1a0f0a" />
          <circle cx={x} cy="52" r="3.2" fill="#e7b65c" />
        </g>
      ))}
    </svg>
  );
}

function Road() {
  const { t } = useSite();
  const L = t.lorry;
  const box = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(-1);
  const n = L.stages.length;

  useScrollFrame(() => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.78 - r.top) / (r.height + vh * 0.25)));
    el.style.setProperty('--p', p.toFixed(4));
    const k = Math.floor(p * (n - 1) + 0.15);
    setLit((cur) => (cur === k ? cur : k));
  });

  return (
    <div ref={box} className="road mt-14" style={{ ['--p' as string]: 0 }}>
      {/* wide screens: the road runs left to right */}
      <div className="hidden md:block relative h-[300px]">
        <div className="road__track left-0 right-0 top-[132px] h-[30px] rounded-full" />
        <div className="absolute left-0 right-0 top-[146px] h-[2px]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#ffd27a 0 22px,transparent 22px 44px)' }} />
        <div className="road__fill left-0 top-[132px] h-[30px] rounded-full" style={{ width: 'calc(var(--p) * 100%)', opacity: 0.35 }} />
        <div className="absolute top-[84px] left-0 right-0" style={{ transform: 'translateX(calc(var(--p) * (100% - 96px)))' }}>
          <Truck />
        </div>
        <ol className="absolute inset-x-0 top-0 grid grid-cols-6" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {L.stages.map((s, i) => (
            <li key={s.t} className={`flex flex-col items-center text-center ${i <= lit ? 'stage-on' : ''}`}>
              <div className={`stone mt-[40px] ${i <= lit ? 'lit' : ''}`} style={{ zIndex: 1 }}>
                <span className="relative">{i + 1}</span>
              </div>
              <div className="mt-[92px] font-semibold text-[16px] leading-tight px-1">{s.t}</div>
              <div className="mt-2">
                <span className="paper-chip">
                  {i <= lit ? <CheckCircle2 size={13} aria-hidden="true" /> : <CircleDashed size={13} aria-hidden="true" />} {s.p}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* phones: the road runs top to bottom */}
      <div className="md:hidden relative pl-[86px]">
        <div className="road__track left-[22px] top-0 bottom-0 w-[26px] rounded-full" />
        <div className="absolute left-[34px] top-0 bottom-0 w-[2px]" style={{ backgroundImage: 'repeating-linear-gradient(180deg,#ffd27a 0 18px,transparent 18px 36px)' }} />
        <div className="road__fill left-[22px] top-0 w-[26px] rounded-full" style={{ height: 'calc(var(--p) * 100%)', opacity: 0.35 }} />
        <div className="absolute left-0 top-0 bottom-0 w-[70px] pointer-events-none z-[3]">
          <div className="absolute left-[-1px]" style={{ top: 'calc(var(--p) * (100% - 72px))', transform: 'rotate(90deg)', width: 72 }}>
            <Truck style={{ width: 72 }} />
          </div>
        </div>
        <ol className="grid gap-7" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {L.stages.map((s, i) => (
            <li key={s.t} className={`flex items-center gap-4 ${i <= lit ? 'stage-on' : ''}`}>
              <div className={`stone shrink-0 ${i <= lit ? 'lit' : ''}`} style={{ width: 46, height: 56, fontSize: 15 }}>
                <span className="relative">{i + 1}</span>
              </div>
              <div>
                <div className="font-semibold text-[17px] leading-tight">{s.t}</div>
                <div className="mt-1.5">
                  <span className="paper-chip">
                    {i <= lit ? <CheckCircle2 size={13} aria-hidden="true" /> : <CircleDashed size={13} aria-hidden="true" />} {s.p}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Lorry() {
  const { t } = useSite();
  const L = t.lorry;
  return (
    <section id="lorry" className="section day" data-tone="light" aria-labelledby="lorry-h">
      <div className="wrap">
        <SectionHead kicker={L.kicker} title={L.title} id="lorry-h" body={L.body} />
        <Road />
        <Reveal className="mt-12 md:mt-6 rounded-[24px] px-6 py-5 text-center font-semibold text-[clamp(18px,2vw,23px)] text-white" style={{ background: 'linear-gradient(135deg,#2a1408,#4a2410)' }}>
          {L.statement}
        </Reveal>
        <div className="mt-20 grid lg:grid-cols-[1fr_1fr] items-center gap-x-14 gap-y-14">
          <Reveal className="flex justify-center items-start gap-4 sm:gap-8">
            <Phone screen="lorry" alt={L.where} width="clamp(150px, 21vw, 280px)" />
            <Phone screen="papers" alt={L.papersTitle} width="clamp(150px, 21vw, 280px)" className="mt-12" />
          </Reveal>
          <div>
            <Points items={L.points} icons={[<Camera size={20} />, <WifiOff size={20} />, <FileStack size={20} />]} />
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Ticker items={t.ticker.items} label={t.ticker.label} />
      </div>
    </section>
  );
}
