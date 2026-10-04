import type { ReactNode } from 'react';

// A small, safe Markdown renderer for editor analyses: paragraphs, "## " headings, "- " lists,
// **bold**, *italic* and [links](https://…). Everything is escaped by React; no raw HTML is allowed.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(<strong key={i++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('*')) out.push(<em key={i++}>{tok.slice(1, -1)}</em>);
    else {
      const [, label, href] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)!;
      const external = href.startsWith('http');
      out.push(
        <a key={i++} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-primary underline underline-offset-2">
          {label}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function MiniMarkdown({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, '\n').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-lg leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) return <h3 key={i} className="pt-2 text-xl font-bold">{inline(block.slice(3))}</h3>;
        const lines = block.split('\n');
        if (lines.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-6">
              {lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}
            </ul>
          );
        }
        return <p key={i}>{inline(block.replace(/\n/g, ' '))}</p>;
      })}
    </div>
  );
}
