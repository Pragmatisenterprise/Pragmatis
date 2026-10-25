import { Smartphone, ShieldCheck, BarChart3, Lock } from "lucide-react";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

const points = [
  { icon: Smartphone, title: "Gestiona desde cualquier lugar", text: "Aprueba cambios, revisa métricas y consulta reportes desde el móvil." },
  { icon: Lock, title: "Control de accesos", text: "Roles, permisos y auditoría directamente desde tu panel." },
  { icon: BarChart3, title: "Métricas en vivo", text: "Indicadores de uso y rendimiento para decidir con datos." },
  { icon: ShieldCheck, title: "Seguridad por defecto", text: "Buenas prácticas y revisiones en cada entrega." },
];

const tabs = [
  { id: "auto", label: "Automatización", title: "Automatiza procesos repetitivos", text: "Reemplaza tareas manuales por flujos confiables que ahorran horas cada semana." },
  { id: "grow", label: "Hecho para crecer", title: "Arquitectura que escala contigo", text: "Diseños modulares que soportan más usuarios y nuevas funciones sin reescribir." },
  { id: "world", label: "Cloud global", title: "Despliegue en la nube, sin fronteras", text: "Infraestructura cloud con alta disponibilidad y baja latencia donde estén tus clientes." },
  { id: "api", label: "Integraciones", title: "Conecta todo tu ecosistema", text: "APIs, webhooks y conectores con las herramientas que ya usas." },
];

const logos = ["Stripe", "Slack", "AWS", "Google Cloud", "GitHub", "Notion", "Zapier", "Azure", "Figma", "Jira"];

export function Platform() {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active)!;
  return (
    <>
      <section id="plataforma" className="bg-black py-28 text-white">
        <div className="container grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-medium text-violet-glow">Plataforma</p>
            <h2 className="mt-3 max-w-md text-4xl font-semibold tracking-tight">Todo en un solo panel seguro.</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {points.map((p) => (
                <div key={p.title}>
                  <p.icon size={20} className="text-violet-glow" />
                  <h3 className="mt-3 font-medium">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/50">{p.text}</p>
                </div>
              ))}
            </div>
            <a href="#contacto" className="btn-primary mt-10">Solicitar demo</a>
          </Reveal>
          <Reveal delay={0.1} className="flex justify-center">
            <div className="w-[260px] rounded-[2.5rem] border border-white/15 bg-gradient-to-b from-[#222] to-[#0a0a0a] p-3 shadow-[0_0_80px_rgba(91,61,245,.3)]">
              <div className="space-y-3 rounded-[2rem] bg-black p-5">
                <div className="h-2 w-16 rounded bg-white/20" />
                <div className="rounded-2xl bg-violet p-4"><p className="text-xs text-white/70">Proyectos activos</p><p className="text-3xl font-semibold">12</p></div>
                {[78, 54, 91].map((w, i) => (
                  <div key={i} className="rounded-xl bg-white/5 p-3"><div className="h-1.5 rounded bg-white/10"><div className="h-full rounded bg-emerald" style={{ width: `${w}%` }} /></div></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-28">
        <div className="container">
          <Reveal>
            <div role="tablist" aria-label="Capacidades" className="mx-auto flex max-w-fit flex-wrap justify-center gap-2 rounded-2xl bg-mist p-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id} role="tab" aria-selected={t.id === active} onClick={() => setActive(t.id)}
                  className={cn("rounded-xl px-4 py-2 text-sm font-medium transition-colors", t.id === active ? "bg-white shadow-sm" : "text-charcoal/50 hover:text-charcoal")}
                >{t.label}</button>
              ))}
            </div>
            <div role="tabpanel" className="mx-auto mt-12 max-w-2xl text-center">
              <h2 className="text-4xl font-semibold tracking-tight">{tab.title}</h2>
              <p className="mt-4 text-charcoal/60">{tab.text}</p>
              <a href="#contacto" className="btn-dark mt-6">Hablemos</a>
            </div>
          </Reveal>
          <div className="mt-20 overflow-hidden" aria-label="Integraciones">
            <p className="mb-8 text-center text-sm text-charcoal/50">Conectamos con tus plataformas favoritas</p>
            <div className="flex w-max animate-marquee gap-12 text-2xl font-semibold text-charcoal/30">
              {[...logos, ...logos].map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
