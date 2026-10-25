import { CheckCircle2, Clock, Layers, Workflow } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

function Mock({ children, tint }: { children: ReactNode; tint: string }) {
  return <div className={cn("flex min-h-[240px] items-center justify-center rounded-3xl p-5 md:min-h-[320px] md:rounded-4xl md:p-8", tint)}>{children}</div>;
}

const rows = [
  { icon: Clock, title: "Entregas planificadas", text: "Roadmap claro, hitos semanales y seguimiento transparente de cada avance.", cta: "Ver metodología", tint: "bg-violet-soft" },
  { icon: Layers, title: "Producto bajo control", text: "Gestiona requerimientos, versiones y despliegues desde un solo lugar, con visibilidad en tiempo real.", tint: "bg-blush" },
  { icon: Workflow, title: "Despliegues continuos", text: "CI/CD automatizado, monitoreo y soporte para que tu software siempre esté al día.", tint: "bg-emerald-soft" },
];

export function CoreFeatures() {
  return (
    <section className="pb-16 md:pb-28">
      <div className="container">
        <Reveal>
          <p className="text-center text-sm font-medium text-violet">Servicios clave</p>
          <h2 className="mx-auto mt-3 max-w-xl text-center text-3xl font-semibold tracking-tight md:text-4xl">
            Toma el control de tu desarrollo, de la idea al despliegue
          </h2>
          <div className="mt-6 text-center"><a href="#contacto" className="btn-dark">Empezar ahora</a></div>
        </Reveal>
        <div className="mt-12 space-y-14 md:mt-20 md:space-y-24">
          {rows.map((r, i) => (
            <div key={r.title} className="grid items-center gap-10 md:grid-cols-2">
              <Reveal className={cn(i % 2 && "md:order-2")}>
                <h3 className="text-3xl font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-4 max-w-md text-charcoal/60">{r.text}</p>
                {r.cta && <a href="#contacto" className="btn-dark mt-6">{r.cta}</a>}
              </Reveal>
              <Reveal delay={0.1}>
                <Mock tint={r.tint}>
                  <div className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5 shadow-xl">
                    <div className="flex items-center gap-2 text-sm font-medium"><r.icon size={16} className="text-violet" />{r.title}</div>
                    {["Análisis", "Desarrollo", "Pruebas", "Despliegue"].map((s, k) => (
                      <div key={s} className="flex items-center gap-2 text-sm text-charcoal/70">
                        <CheckCircle2 size={16} className={k < 3 ? "text-emerald" : "text-charcoal/20"} />{s}
                        <span className="ml-auto h-1.5 w-20 overflow-hidden rounded bg-mist"><span className="block h-full bg-violet" style={{ width: `${100 - k * 22}%` }} /></span>
                      </div>
                    ))}
                  </div>
                </Mock>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
