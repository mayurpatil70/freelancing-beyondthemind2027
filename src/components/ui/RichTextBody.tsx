import React from 'react';
import { parseRichText } from '@/lib/richText';
import { inline } from '@/components/blog/ArticleBody';

// Renders a session description written in the admin panel (see src/lib/richText).
// The session title is already the page's H1/H2, so "##" becomes an H3 and "###" an H4.
export function RichTextBody({ content }: { content: string | undefined | null }) {
  return (
    <div className="space-y-3 text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
      {parseRichText(content).map((b, i) => {
        const key = `rt-${i}`;
        switch (b.kind) {
          case 'h2':
            return (
              <h3 key={key} className="font-serif text-xl sm:text-2xl text-ivory-50 font-light pt-3">
                {inline(b.text, key)}
              </h3>
            );
          case 'h3':
            return (
              <h4 key={key} className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gold-400 font-semibold pt-2">
                {inline(b.text, key)}
              </h4>
            );
          case 'quote':
            return (
              <blockquote key={key} className="pl-4 border-l-2 border-gold-400/70 font-serif text-lg sm:text-xl italic text-gold-200 leading-snug">
                {inline(b.text, key)}
              </blockquote>
            );
          case 'ul':
            return (
              <ul key={key} className="space-y-1.5 pl-1">
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
