/*
 * Day again: WhatsApp, the small things, the app screen by screen, joining,
 * and the common questions.
 */
import { useRef } from 'react';
import {
  Bell, CheckCheck, FileCheck2, ListChecks, MessageCircle, Moon, PhoneCall, Repeat2, ScrollText, Send, ShieldCheck, UserRound
} from 'lucide-react';
import { LINKS } from '../content';
import { Phone, Reveal, useInView, useScrollFrame, useSite, type ScreenName } from '../site';
import { Points, SectionHead } from './Features';

export function WhatsApp() {
  const { t, base } = useSite();
  const w = t.whatsapp;
  const [chatRef, seen] = useInView<HTMLDivElement>();
  return (
    <section id="whatsapp" className="section day" data-tone="light" aria-labelledby="wa-h">
      <div className="wrap grid lg:grid-cols-[1fr_0.9fr] items-center gap-x-14 gap-y-14">
        <div>
          <SectionHead kicker={w.kicker} title={w.title} id="wa-h" body={w.body} />
          <Points items={w.items} icons={[<ScrollText size={20} />, <FileCheck2 size={20} />, <Bell size={20} />]} />
          <Reveal delay={420} className="mt-9">
            <a
              href={LINKS.whatsapp}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-3 rounded-[16px] px-5 py-3.5 font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)', boxShadow: '0 16px 34px -14px rgba(18,140,126,.8)' }}
            >
              <MessageCircle size={20} aria-hidden="true" /> {w.save}
            </a>
            <p className="mt-3 text-[15px] text-[var(--color-muted)]">{w.saveHint}</p>
          </Reveal>
        </div>
        <Reveal className="flex justify-center" blur>
          <div ref={chatRef} className={`wa${seen ? ' is-in' : ''}`}>
            <div className="wa__head">
              <img src={`${base}media/brand/icon-day.webp`} alt="" width={40} height={40} className="rounded-full" />
              <div className="leading-tight">
                <div className="font-semibold text-[16px]">{w.chatName}</div>
                <div className="text-[12.5px] opacity-80">{w.chatStatus}</div>
              </div>
            </div>
            <div className="wa__body">
              <div className="bubble me" style={{ ['--d' as string]: '200ms' }}>
                <span className="num">{w.me}</span>
                <small>
                  10:41 <CheckCheck size={13} className="inline text-[#53bdeb]" aria-hidden="true" />
                </small>
              </div>
              <div className="typing" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className="bubble them" style={{ ['--d' as string]: '2300ms' }}>
                {w.them}
                <small>10:41</small>
              </div>
              <p className="mt-auto text-center text-[12px] text-[#6b5a4e]">{w.chatNote}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function More() {
  const { t } = useSite();
  const m = t.more;
  const icons = [<Repeat2 size={22} />, <ListChecks size={22} />, <ShieldCheck size={22} />, <Send size={22} />, <Moon size={22} />, <Bell size={22} />];
  return (
    <section className="section day-2" data-tone="light" aria-labelledby="more-h">
      <div className="wrap">
        <SectionHead kicker={m.kicker} title={m.title} id="more-h" />
        <div className="bento mt-12">
          {m.cards.map((c, i) => (
            <Reveal key={c.t} className="card" delay={i * 80}>
              <div className="flex items-center justify-between">
                <span className="grid place-items-center w-12 h-12 rounded-[15px] text-white" style={{ background: 'linear-gradient(135deg,#ff9933,#f26b1d)' }} aria-hidden="true">
                  {icons[i]}
                </span>
                <span className="tag">{c.label}</span>
              </div>
              <h3 className="mt-5 text-[21px] font-semibold leading-snug">{c.t}</h3>
              <p className="mt-2 text-[16px] text-[var(--color-muted)]">{c.b}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const GALLERY: ScreenName[] = ['home', 'rates', 'money', 'lorry', 'papers', 'repeat', 'ask', 'review', 'madam', 'level', 'updates', 'login', 'home-night'];

export function Gallery() {
  const { t } = useSite();
  const g = t.gallery;
  const strip = useRef<HTMLDivElement>(null);

  // A gentle coverflow: phones turn and shrink the further they sit from the middle.
  const frame = () => {
    const el = strip.current;
    if (!el) return;
    const mid = el.getBoundingClientRect().left + el.clientWidth / 2;
    el.querySelectorAll<HTMLElement>('figure').forEach((f) => {
      const r = f.getBoundingClientRect();
      const d = Math.max(-1.6, Math.min(1.6, (r.left + r.width / 2 - mid) / (r.width * 1.6)));
      f.style.setProperty('--ry', `${(-d * 16).toFixed(2)}deg`);
      f.style.setProperty('--sc', (1 - Math.min(1, Math.abs(d)) * 0.12).toFixed(3));
      f.style.setProperty('--op', (1 - Math.min(1, Math.abs(d)) * 0.35).toFixed(3));
    });
  };
  useScrollFrame(frame);

  return (
    <section className="section day overflow-hidden" data-tone="light" aria-labelledby="gal-h">
      <div className="wrap">
        <SectionHead kicker={g.kicker} title={g.title} id="gal-h" body={g.body} center />
      </div>
      <div
        ref={strip}
        className="gallery mt-6"
        tabIndex={0}
        role="region"
        aria-label={g.title}
        onScroll={() => requestAnimationFrame(frame)}
      >
        {GALLERY.map((name) => (
          <figure key={name}>
            <Phone screen={name} alt={g.items[name as keyof typeof g.items]} width="clamp(200px, 58vw, 280px)" sizes="(max-width: 700px) 58vw, 280px" />
            <figcaption>{g.items[name as keyof typeof g.items]}</figcaption>
          </figure>
        ))}
      </div>
      <p className="text-center text-[14px] font-semibold text-[var(--color-faint)]">{g.hint} →</p>
    </section>
  );
}

export function Join() {
  const { t } = useSite();
  const j = t.join;
  return (
    <section id="join" className="section day-2" data-tone="light" aria-labelledby="join-h">
      <div className="wrap">
        <SectionHead kicker={j.kicker} title={j.title} id="join-h" />
        <ol className="steps mt-12">
          {j.steps.map((s, i) => (
            <Reveal as="li" key={s.t} className="card" delay={i * 110}>
              <h3 className="text-[20px] font-semibold leading-snug">{s.t}</h3>
              <p className="mt-2 text-[16px] text-[var(--color-muted)]">{s.b}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-8 flex flex-wrap items-center gap-4" delay={300}>
          <UserRound size={20} className="text-[var(--color-saffron)]" aria-hidden="true" />
          <span className="font-semibold">{j.help}</span>
          <a href={LINKS.tel} className="inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 font-semibold text-white" style={{ background: 'linear-gradient(135deg,#ff9933,#f26b1d)' }}>
            <PhoneCall size={17} aria-hidden="true" /> <span className="num">{LINKS.telDisplay}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  const { t } = useSite();
  const f = t.faq;
  return (
    <section className="section day" data-tone="light" aria-labelledby="faq-h">
      <div className="wrap grid lg:grid-cols-[0.8fr_1.2fr] gap-x-14 gap-y-10">
        <SectionHead kicker={f.kicker} title={f.title} id="faq-h" />
        <Reveal className="faq" blur>
          {f.items.map((it) => (
            <details key={it.q}>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
