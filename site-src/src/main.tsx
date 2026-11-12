import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// The prerender wrote <html lang="hi|en">; in `vite dev` it is still the placeholder, so Hindi.
const lang = document.documentElement.lang === 'en' ? 'en' : 'hi';
const root = document.getElementById('root')!;
if (root.firstElementChild) hydrateRoot(root, <App lang={lang} />);
else createRoot(root).render(<App lang={lang} />);
// The head's fallback un-hides everything if this line never runs (see index.html).
(window as unknown as { __osht?: boolean }).__osht = true;
