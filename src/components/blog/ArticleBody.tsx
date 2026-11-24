import React from 'react';
import { parseRichText as parse } from '@/lib/richText';

// Renders an article written in the admin panel. Supported marks (one per line):
//   "## Heading", "### Subheading", "- list item", "> quote", **bold**. An empty line starts a new paragraph.
// Text is rendered as React text nodes, never as HTML.

export function inline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-gold-200">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
    )
  );
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/\*\*/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="space-y-5 text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
      {parse(content).map((b, i) => {
        const key = `b-${i}`;
        switch (b.kind) {
          case 'h2':
            return (
              <h2 key={key} id={headingId(b.text)} className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light pt-4 scroll-mt-32">
                {inline(b.text, key)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={key} className="font-serif text-xl sm:text-2xl text-gold-200 font-light pt-2">
                {inline(b.text, key)}
              </h3>
            );
          case 'quote':
            return (
              <blockquote
                key={key}
                className="my-6 pl-5 border-l-2 border-gold-400/70 font-serif text-xl sm:text-2xl italic text-gold-200 leading-snug"
              >
                {inline(b.text, key)}
              </blockquote>
            );
          case 'ul':
            return (
              <ul key={key} className="space-y-2 pl-1">
                {b.items.map((item, j) => (
                  <li key={`${key}-${j}`} className="flex gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 shrink-0 rotate-45 border border-gold-400/80 bg-gold-500/30" />
                    <span>{inline(item, `${key}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            );
          default:
            return <p key={key}>{inline(b.text, key)}</p>;
        }
      })}
    </div>
  );
}
