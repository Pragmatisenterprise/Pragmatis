import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const posts = [
  { tag: "TECNOLOGÍA", read: "5 MIN", title: "El futuro del desarrollo de software con IA", date: "15 ene 2026", author: "Equipo editorial" },
  { tag: "NEGOCIOS", read: "7 MIN", title: "Cómo elegir el stack correcto para tu producto", date: "12 ene 2026", author: "Equipo editorial" },
  { tag: "SEGURIDAD", read: "4 MIN", title: "10 prácticas de seguridad para aplicaciones web", date: "8 ene 2026", author: "Equipo editorial" },
];

export function Blog() {
  return (
    <section id="blog" className="bg-arena py-16 md:py-28">
      <div className="container">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-paramo">Blog</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Artículos para equipos y emprendedores</h2>
          </div>
          <a href="#blog" className="btn-dark">Ver todos</a>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="group h-full rounded-3xl bg-white p-3">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-paramo-suave via-papel to-maiz-suave" />
                <div className="p-4">
                  <p className="text-xs text-texto2">{p.tag} · {p.read} DE LECTURA</p>
                  <h3 className="mt-3 flex items-start justify-between gap-3 text-lg font-semibold leading-snug">
                    {p.title}<ArrowUpRight className="mt-1 shrink-0 text-tinta/30 transition-colors group-hover:text-paramo" size={18} />
                  </h3>
                  <p className="mt-4 text-xs text-texto2">{p.date} · {p.author}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
