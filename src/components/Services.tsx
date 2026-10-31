import { ArrowRight, Check, LayoutTemplate, Workflow } from "lucide-react";
import { Reveal } from "./Reveal";

const services = [
  {
    icon: LayoutTemplate,
    tint: "bg-paramo-suave",
    iconTint: "bg-paramo text-white",
    eyebrow: "Para negocios locales",
    title: "Plantillas listas para tu negocio",
    text: "Portales web y apps ya probadas para barberías, restaurantes, tiendas de barrio, droguerías y más. Las adaptamos a tu marca y las dejamos funcionando.",
    points: ["Pago único. Plan mensual de acompañamiento opcional", "Reservas, pedidos, catálogo o inventario según tu negocio", "Editable al 100 %: si algo no te sirve, lo cambiamos", "Dominio y hosting incluidos el primer año"],
    cta: { label: "Ver plantillas", href: "#plantillas" },
  },
  {
    icon: Workflow,
    tint: "bg-maiz-suave",
    iconTint: "bg-tinta text-papel",
    eyebrow: "Para empresas",
    title: "Software y automatización a la medida",
    text: "Cuando tu operación no cabe en una plantilla, diseñamos el sistema que necesitas: desde una herramienta interna hasta la automatización de un proceso completo.",
    points: ["Diagnóstico de tu operación antes de cotizar", "Sistemas internos, portales y apps propias", "Automatización de tareas repetitivas", "Acompañamiento después de la entrega"],
    cta: { label: "Agendar un diagnóstico", href: "#contacto" },
  },
];

export function Services() {
  return (
    <section id="servicios" className="relative py-16 md:py-28">
      <div className="container">
        <Reveal>
          <p className="text-center text-sm font-medium text-paramo">Servicios</p>
          <h2 className="mx-auto mt-3 max-w-xl text-center text-3xl font-semibold tracking-tight md:text-5xl">
            Dos caminos, <span className="text-tinta/60">según el tamaño de tu reto</span>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:mt-16 lg:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className={`flex h-full flex-col rounded-4xl p-6 md:p-10 ${s.tint}`}>
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconTint}`}><s.icon size={20} /></span>
                <p className="mt-8 text-sm font-medium text-paramo">{s.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{s.title}</h3>
                <p className="mt-3 text-texto2">{s.text}</p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {s.points.map((p) => <li key={p} className="flex gap-2.5"><Check size={18} className="shrink-0 text-paramo" />{p}</li>)}
                </ul>
                <a href={s.cta.href} className="btn-dark mt-8 self-start">{s.cta.label}<ArrowRight size={16} /></a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
