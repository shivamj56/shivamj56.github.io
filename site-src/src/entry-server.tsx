import { renderToString } from 'react-dom/server';
import { App } from './App';
import { COPY, LINKS, type Lang } from './content';

export function render(lang: Lang) {
  return renderToString(<App lang={lang} />);
}
export { COPY, LINKS };
