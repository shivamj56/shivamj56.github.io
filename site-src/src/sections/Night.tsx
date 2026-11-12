/*
 * Evening: Madam, the voice that answers, and the levels — gold on कत्था,
 * the way the app's own level plate is drawn.
 */
import { Crown, Languages, Mic, ShieldCheck, Star, Sparkles, Trophy } from 'lucide-react';
import { Example, Reveal, Ticker, useSite } from '../site';
import { Points, SectionHead } from './Features';

export function Madam() {
  const { t } = useSite();
  const m = t.madam;
  return (
    <section id="madam" className="section madam on-night" data-tone="dark" aria-labelledby="madam-h">
      <div className="wrap relative z-[2] grid lg:grid-cols-2 items-center gap-x-14 gap-y-16">
        <div>
          <SectionHead kicker={m.kicker} title={m.title} id="madam-h" body={m.body} />
          <Points items={m.points} icons={[<ShieldCheck size={20} />, <Sparkles size={20} />, <Languages size={20} />]} />
        </div>
        <Reveal className="relative flex flex-col items-center text-center">
          <div className="orb" aria-hidden="true" />
          <p className="mt-10 text-[15px] text-[#cdb7e6]">{m.hello}</p>
          <p className="display mt-1 text-[clamp(26px,3vw,36px)] leading-tight text-white">{m.help}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 max-w-[30rem]">
            {m.questions.map((q, i) => (
              <span key={q} className="qchip">
                {q}
              </span>
            ))}
          </div>
          <div className="mt-9 flex flex-col items-center gap-3">
            <span className="mic" aria-hidden="true">
              <Mic size={28} />
            </span>
            <span className="text-[14px] font-semibold text-[#e7d4ff]">{m.press}</span>
          </div>
        </Reveal>
      </div>
      <Reveal className="relative z-[2] mt-20">
        <Ticker items={m.chips} label={m.ask} />
      </Reveal>
    </section>
  );
}

export function Levels() {
  const { t } = useSite();
  const L = t.levels;
  const c = L.card;
  const icons = [<Star size={18} key="s" />, <Crown size={18} key="c" />, <Trophy size={18} key="t" />];
  return (
    <section id="levels" className="section levels on-night" data-tone="dark" aria-labelledby="levels-h">
      <div className="wrap relative z-[2]">
        <SectionHead kicker={L.kicker} title={L.title} id="levels-h" body={L.body} />
        <div className="mt-14 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <Reveal>
            <div className="supplier-card">
              <div className="flex items-center justify-between">
                <span className="brand-word text-[12px] tracking-[0.18em] text-[#e7b65c]">{c.brand}</span>
                <Star size={18} className="text-[#e7b65c]" fill="#e7b65c" aria-hidden="true" />
              </div>
              <div className="mt-5 flex items-center gap-5">
                <div className="ring" style={{ ['--v' as string]: 28 / 60 }}>
                  <span className="text-center leading-none">
                    <span className="num block text-[30px] font-bold text-[#fbe3a6]">28</span>
                    <span className="block text-[11px] text-[#d9c3ae] mt-1">{c.of}</span>
                  </span>
                </div>
                <div>
                  <div className="display gold text-[44px] leading-none">{c.tier}</div>
                  <div className="mt-2 text-[14px] text-[#e6d2bf] leading-snug">
                    {c.next}
                    <br />
                    {c.next2}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {c.stats.map((s) => (
                  <div key={s.l} className="rounded-[16px] bg-[rgba(255,255,255,.06)] border border-[rgba(255,222,186,.1)] px-3 py-3">
                    <div className="num text-[20px] font-bold text-[#fff3e4]">{s.v}</div>
                    <div className="text-[12.5px] text-[#d9c3ae] leading-tight mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-[13px] text-[#cdb7a6]">
                <span>{c.window}</span>
                <Example>{L.example}</Example>
              </div>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4">
            {L.tiers.map((tier, i) => (
              <Reveal key={tier.key} className={`tier ${tier.key}`}>
                <span className="grid place-items-center w-10 h-10 rounded-[12px] bg-[rgba(255,255,255,.55)]" aria-hidden="true">
                  {icons[i]}
                </span>
                <h3 className="mt-4">{tier.name}</h3>
                <div className="need">{tier.need}</div>
                <div className="mt-4 text-[13px] font-semibold opacity-70">{tier.plus || L.perksTitle}</div>
                <ul>
                  {tier.perks.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
