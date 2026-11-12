/*
 * Night again, in gold: the सुनहरी रात icon, the download, the office.
 */
import { Clock3, MessageCircle, PhoneCall } from 'lucide-react';
import { LINKS } from '../content';
import { Reveal, StoreButtons, useSite } from '../site';

export function Closing() {
  const { t, base } = useSite();
  const c = t.contact;
  return (
    <section id="get" className="section closing on-night" data-tone="dark" aria-labelledby="get-h">
      <div className="wrap relative z-[2] grid lg:grid-cols-[auto_1fr] items-center gap-x-16 gap-y-12">
        <Reveal className="justify-self-center">
          <div className="closing__icon">
            <img src={`${base}media/brand/icon-night-640.webp`} alt="OSHT" width={640} height={640} loading="lazy" decoding="async" />
          </div>
        </Reveal>
        <div className="text-center lg:text-left">
          <Reveal as="p" className="kicker">{c.kicker}</Reveal>
          <Reveal>
            <h2 id="get-h" className="h2">
              <span className="gold">{t.cta.title}</span>
            </h2>
          </Reveal>
          <Reveal as="p" className="lead mx-auto lg:mx-0">
            {t.cta.body}
          </Reveal>
          <Reveal>
            <StoreButtons className="mt-9 justify-center lg:justify-start" />
          </Reveal>
          <Reveal className="mt-10">
            <p className="font-semibold text-[18px] text-[#fbe3a6]">{c.title}</p>
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-3">
              <a className="contact-link" href={LINKS.tel}>
                <PhoneCall size={18} aria-hidden="true" /> {c.call} · <span className="num">{LINKS.telDisplay}</span>
              </a>
              <a className="contact-link" href={LINKS.whatsapp} target="_blank" rel="noopener">
                <MessageCircle size={18} aria-hidden="true" /> {c.whatsapp} · <span className="num">{LINKS.whatsappDisplay}</span>
              </a>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-[15px] text-[#d9c3ae]">
              <Clock3 size={16} aria-hidden="true" /> {c.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t, lang, base } = useSite();
  const f = t.footer;
  return (
    <footer className="footer on-night">
      <div className="wrap py-14 grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-3">
            <img src={`${base}media/brand/mark.webp`} alt="" width={192} height={360} style={{ height: 44, width: 'auto' }} loading="lazy" />
            <span>
              <span className="brand-word block text-[20px] text-[#fff3e4]">OSHT</span>
              <span className="block text-[13px]">Om Shri Hari Trading Pvt Ltd</span>
            </span>
          </div>
          <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed">{f.blurb}</p>
        </div>
        <div>
          <p className="font-semibold text-[#fff3e4]">{f.app}</p>
          <ul className="mt-3 grid gap-2 text-[15px]" style={{ listStyle: 'none', padding: 0 }}>
            <li><a href={LINKS.play} target="_blank" rel="noopener">Google Play</a></li>
            <li><a href={LINKS.ios} target="_blank" rel="noopener">App Store</a></li>
            <li><a href="https://shree-hari-console.netlify.app/privacy" target="_blank" rel="noopener">{t.privacy}</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-[#fff3e4]">{f.contact}</p>
          <ul className="mt-3 grid gap-2 text-[15px]" style={{ listStyle: 'none', padding: 0 }}>
            <li><a href={LINKS.tel} className="num">{LINKS.telDisplay}</a></li>
            <li><a href={LINKS.whatsapp} target="_blank" rel="noopener">WhatsApp · <span className="num">{LINKS.whatsappDisplay}</span></a></li>
            <li>
              <a href={lang === 'hi' ? `${base}en/` : base} hrefLang={lang === 'hi' ? 'en' : 'hi'} lang={lang === 'hi' ? 'en' : 'hi'}>
                {t.meta.switchTo}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap pb-10 text-[13px] opacity-70">{f.rights}</div>
    </footer>
  );
}
