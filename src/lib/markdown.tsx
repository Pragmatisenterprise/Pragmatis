import { Fragment, type ReactNode } from "react";

// Markdown mínimo (títulos, listas, citas, código, negrita, cursiva, enlaces, imágenes).
// Genera nodos de React, nunca HTML crudo, así que el contenido no puede inyectar scripts.

const safeHref = (url: string) => (/^(https?:\/\/|\/(?!\/)|#|mailto:)/i.test(url) ? url : "#");

const INLINE = /(!\[([^\]]*)\]\(([^)\s]+)\)|\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;

function inline(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of src.matchAll(INLINE)) {
    if (m.index! > last) out.push(src.slice(last, m.index));
    if (m[2] !== undefined) out.push(<img key={key++} src={safeHref(m[3])} alt={m[2]} loading="lazy" className="my-6 rounded-2xl" />);
    else if (m[4] !== undefined) {
      const external = /^https?:/i.test(m[5]);
      out.push(
        <a key={key++} href={safeHref(m[5])} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-paramo underline underline-offset-2">{m[4]}</a>,
      );
    } else if (m[6] !== undefined) out.push(<code key={key++} className="rounded bg-arena px-1.5 py-0.5 text-[0.9em]">{m[6]}</code>);
    else if (m[7] !== undefined) out.push(<strong key={key++}>{m[7]}</strong>);
    else out.push(<em key={key++}>{m[8]}</em>);
    last = m.index! + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(<pre key={key++} className="my-6 overflow-x-auto rounded-2xl bg-grafito p-5 text-sm text-white"><code>{code.join("\n")}</code></pre>);
      continue;
    }

    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const cls = ["", "mt-10 text-3xl font-semibold tracking-tight", "mt-10 text-2xl font-semibold tracking-tight", "mt-8 text-xl font-semibold"][h[1].length];
      const Tag = (`h${h[1].length + 1}`) as "h2" | "h3" | "h4"; // el h1 es el título del artículo
      blocks.push(<Tag key={key++} className={cls}>{inline(h[2])}</Tag>);
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const re = ordered ? /^\s*\d+\.\s+(.*)$/ : /^\s*[-*]\s+(.*)$/;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push(re.exec(lines[i++])![1]);
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={key++} className={`my-5 space-y-2 pl-6 ${ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((t, n) => <li key={n}>{inline(t)}</li>)}
        </List>,
      );
      continue;
    }

    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={key++} className="my-6 border-l-4 border-paramo pl-5 italic text-tinta/70">{inline(quote.join(" "))}</blockquote>);
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|>|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
    if (!para.length) para.push(lines[i++]); // salvaguarda contra bucles
    blocks.push(
      <p key={key++} className="my-5 leading-relaxed">
        {para.map((t, n) => <Fragment key={n}>{n > 0 && <br />}{inline(t)}</Fragment>)}
      </p>,
    );
  }
  return <>{blocks}</>;
}
