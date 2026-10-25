import { Gauge, Plug, ShieldCheck, Globe } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  { icon: Gauge, tint: "bg-orchid", title: "Rápido y confiable", text: "Entregas iterativas y sistemas con disponibilidad casi total." },
  { icon: Plug, tint: "bg-zinc-400", title: "Integraciones flexibles", text: "Conectamos tus plataformas favoritas o APIs propias." },
  { icon: ShieldCheck, tint: "bg-emerald", title: "Precios transparentes", text: "Alcance y costos claros desde el inicio, sin sorpresas." },
  { icon: Globe, tint: "bg-violet-glow", title: "Alcance global", text: "Arquitecturas listas para escalar a nuevos mercados." },
];

export function Benefits() {
  return (
    <section id="servicios" className="relative py-28">
      <div className="container">
        <Reveal>
          <h2 className="mx-auto max-w-lg text-center text-4xl font-semibold tracking-tight md:text-5xl">
            Soluciones rápidas, seguras <span className="text-charcoal/50">y flexibles</span>
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-mist p-6">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${it.tint}`}><it.icon size={18} /></span>
                <h3 className="mt-10 text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-charcoal/60">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
