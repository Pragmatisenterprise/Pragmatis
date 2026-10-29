import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Testimonial } from "@/lib/types";
import { Reveal } from "./Reveal";

// Solo testimonios reales aprobados en el panel. Sin ninguno, la sección no se muestra.
export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  useEffect(() => {
    api<Testimonial[]>("/api/testimonials").then(setItems).catch(() => {});
  }, []);
  if (!items.length) return null;

  return (
    <section id="testimonios" className="py-16 md:py-28">
      <div className="container">
        <Reveal>
          <p className="text-center text-sm font-medium text-paramo">Testimonios</p>
          <h2 className="mx-auto mt-3 max-w-lg text-center text-3xl font-semibold tracking-tight md:text-4xl">Lo que dicen los negocios que ya trabajan con nosotros</h2>
        </Reveal>
        <div className="mt-14 columns-1 gap-4 md:columns-2 lg:columns-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid">
              <figure className={i % 4 === 1 ? "rounded-3xl bg-paramo p-6 text-white" : "rounded-3xl bg-arena p-6"}>
                {t.rating && (
                  <p className="mb-4 flex gap-0.5" aria-label={`${t.rating} de 5 estrellas`}>
                    {Array.from({ length: 5 }, (_, k) => (
                      <Star key={k} size={16} className={k < t.rating! ? (i % 4 === 1 ? "text-maiz" : "text-maiz-ocre") : "opacity-20"} fill={k < t.rating! ? "currentColor" : "none"} />
                    ))}
                  </p>
                )}
                <blockquote className="text-lg font-medium leading-snug">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm">
                  <span className={i % 4 === 1 ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-papel text-xs font-semibold text-paramo" : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tinta text-xs font-semibold text-papel"}>{t.name[0]}</span>
                  <span>
                    <b className="block">{t.name}</b>
                    {(t.role || t.company) && <span className="opacity-80">{[t.role, t.company].filter(Boolean).join(", ")}</span>}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
