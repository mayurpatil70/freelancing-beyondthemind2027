import React from 'react';

// Renders an article written in the admin panel. Supported marks (one per line):
//   "## Heading", "### Subheading", "- list item", "> quote", **bold**. An empty line starts a new paragraph.
// Text is rendered as React text nodes, never as HTML.

function inline(text: string, keyPrefix: string): React.ReactNode[] {
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

type Block =
  | { kind: 'h2' | 'h3' | 'quote' | 'p'; text: string }
  | { kind: 'ul'; items: string[] };

function parse(content: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ') });
    para = [];
  };
  for (const raw of (content || '').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith('### ')) {
      flush();
      blocks.push({ kind: 'h3', text: line.slice(4) });
    } else if (line.startsWith('## ')) {
      flush();
      blocks.push({ kind: 'h2', text: line.slice(3) });
    } else if (line.startsWith('> ')) {
      flush();
      blocks.push({ kind: 'quote', text: line.slice(2) });
    } else if (/^[-*]\s+/.test(line)) {
      flush();
      const item = line.replace(/^[-*]\s+/, '');
      const last = blocks[blocks.length - 1];
      if (last && last.kind === 'ul') last.items.push(item);
      else blocks.push({ kind: 'ul', items: [item] });
    } else {
      para.push(line);
    }
  }
  flush();
  return blocks;
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
