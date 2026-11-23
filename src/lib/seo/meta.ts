// Helpers that keep page titles and meta descriptions inside the lengths search engines show
// (titles about 50–60 characters, descriptions about 120–155), for pages built from CMS content.

export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 155;

const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);

// "STRESS BUSTER SESSION" -> "Stress Buster Session". Mixed-case text is left as written.
export function titleCase(text: string): string {
  const trimmed = (text || '').trim();
  if (trimmed !== trimmed.toUpperCase()) return trimmed;
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => (i > 0 && SMALL_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

// Appends the first suffix that keeps the title within TITLE_MAX; with none that fits, the main part stands alone.
export function fitTitle(main: string, suffixes: string[]): string {
  const base = main.trim();
  for (const suffix of suffixes) {
    if (base.length + suffix.length <= TITLE_MAX) return base + suffix;
  }
  return base;
}

export function sentences(text: string | undefined | null): string[] {
  return (text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, '')}…`;
}

// Builds a description from parts in priority order. Each part is a sentence, or a list of
// alternatives (longest first) of which the first that still fits is used. Parts that would push
// the text past DESCRIPTION_MAX are skipped; a first part that is too long on its own is cut at a word.
export function composeDescription(parts: Array<string | string[] | undefined | null>): string {
  let out = '';
  for (const part of parts) {
    if (!part) continue;
    const options = (Array.isArray(part) ? part : [part]).map((p) => p.trim()).filter(Boolean);
    if (!out) {
      if (options.length) out = truncate(options[0], DESCRIPTION_MAX);
      continue;
    }
    if (out.length >= DESCRIPTION_MIN) break;
    const fit = options.find((p) => out.length + 1 + p.length <= DESCRIPTION_MAX);
    if (fit) out = `${out} ${fit}`;
  }
  return out;
}
