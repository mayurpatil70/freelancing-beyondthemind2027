// Simple text formatting used by admin long-text fields (blog articles, session descriptions).
// Marks, one per line: "## Heading", "### Subheading", "- list item", "> quote", **bold** inline.
// An empty line starts a new paragraph. Text is always rendered as React text nodes, never as HTML.

export type RichBlock =
  | { kind: 'h2' | 'h3' | 'quote' | 'p'; text: string }
  | { kind: 'ul'; items: string[] };

export function parseRichText(content: string | undefined | null): RichBlock[] {
  const blocks: RichBlock[] = [];
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

/** Plain text without formatting marks, for meta descriptions and JSON-LD. */
export function stripRichText(content: string | undefined | null): string {
  return parseRichText(content)
    .map((b) => {
      const text = b.kind === 'ul' ? b.items.join('. ') : b.text;
      const clean = text.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
      // Headings and list items rarely end with punctuation; add a full stop so sentences split cleanly.
      return /[.!?:]$/.test(clean) ? clean : `${clean}.`;
    })
    .join(' ');
}
