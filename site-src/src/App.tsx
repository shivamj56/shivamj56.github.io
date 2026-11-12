import type { Lang } from './content';
import { SiteProvider, useSite } from './site';
import { Hero, Nav } from './sections/Hero';
import { Dawn } from './sections/Dawn';
import { Lorry, Money, Rates } from './sections/Features';
import { Levels, Madam } from './sections/Night';
import { Faq, Gallery, Join, More, WhatsApp } from './sections/More';
import { Closing, Footer } from './sections/Closing';

function Page() {
  const { t } = useSite();
  return (
    <>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Dawn />
        <Rates />
        <Money />
        <Lorry />
        <Madam />
        <Levels />
        <WhatsApp />
        <More />
        <Gallery />
        <Join />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}

export function App({ lang }: { lang: Lang }) {
  return (
    <SiteProvider lang={lang}>
      <Page />
    </SiteProvider>
  );
}
