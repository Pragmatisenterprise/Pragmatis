import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";
import { Reveal } from "./Reveal";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    api<Project[]>("/api/projects").then(setProjects).catch(() => {});
  }, []);
  if (!projects.length) return null;

  return (
    <section id="proyectos" className="bg-black py-16 text-white md:py-28">
      <div className="container">
        <Reveal>
          <p className="text-sm font-medium text-violet-glow">Proyectos</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">Software que ya está funcionando.</h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => {
            const body = (
              <>
                {p.image_url ? (
                  <img src={p.image_url} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                ) : (
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-violet via-violet-glow/40 to-emerald/40" />
                )}
                <div className="p-4">
                  {p.category && <p className="text-xs uppercase text-white/50">{p.category}</p>}
                  <h3 className="mt-2 flex items-start justify-between gap-3 text-lg font-semibold">
                    {p.title}
                    {p.link_url && <ArrowUpRight className="mt-1 shrink-0 text-white/30 transition-colors group-hover:text-violet-glow" size={18} />}
                  </h3>
                  {p.summary && <p className="mt-2 text-sm text-white/60">{p.summary}</p>}
                </div>
              </>
            );
            const cls = "group block h-full rounded-3xl border border-white/10 bg-white/5 p-3";
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                {p.link_url ? (
                  <a href={p.link_url} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
