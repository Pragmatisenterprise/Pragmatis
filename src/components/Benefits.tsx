import { Gauge, Plug, ShieldCheck, Globe } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  { icon: Gauge, tint: "bg-paramo text-white", title: "Rápido y confiable", text: "Entregas iterativas y sistemas con disponibilidad casi total." },
  { icon: Plug, tint: "bg-tinta text-papel", title: "Integraciones flexibles", text: "Conectamos tus plataformas favoritas o APIs propias." },
  { icon: ShieldCheck, tint: "bg-maiz text-tinta", title: "Precios transparentes", text: "Alcance y costos claros desde el inicio, sin sorpresas." },
  { icon: Globe, tint: "bg-paramo-luz text-tinta", title: "Alcance global", text: "Arquitecturas listas para escalar a nuevos mercados." },
];

export function Benefits() {
  return (
    <section id="servicios" className="relative py-16 md:py-28">
      <div className="container">
        <Reveal>
          <h2 className="mx-auto max-w-lg text-center text-3xl font-semibold tracking-tight md:text-4xl md:text-5xl">
            Soluciones rápidas, seguras <span className="text-tinta/60">y flexibles</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-3 md:mt-16 md:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-arena p-5 md:p-6">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${it.tint}`}><it.icon size={18} /></span>
                <h3 className="mt-6 text-lg font-semibold md:mt-10">{it.title}</h3>
                <p className="mt-2 text-sm text-texto2">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
