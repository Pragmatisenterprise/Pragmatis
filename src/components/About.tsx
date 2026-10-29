import { HeartHandshake, Layers, ShieldCheck, Target } from "lucide-react";
import { LogoSymbol } from "./Logo";
import { Reveal } from "./Reveal";

// Valores de la guía de marca.
const values = [
  { icon: Target, title: "Pragmatismo", text: "Resolvemos el problema real, sin humo. Si una plantilla te sirve, no te vendemos un desarrollo a la medida." },
  { icon: ShieldCheck, title: "Seguridad", text: "Datos protegidos, código mantenible y acompañamiento después de la entrega." },
  { icon: Layers, title: "Adaptabilidad", text: "Empiezas con lo que necesitas hoy y la solución crece con tu negocio." },
  { icon: HeartHandshake, title: "Cercanía", text: "Equipo colombiano, en español y con respuesta humana. Hablas directo con quien construye tu software." },
];

export function About() {
  return (
    <section id="nosotros" className="bg-arena py-16 md:py-28">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="text-sm font-medium text-paramo">Nosotros</p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold tracking-tight md:text-4xl">Una consultora independiente, hecha en Colombia</h2>
            <div className="mt-6 space-y-4 text-texto2">
              <p>
                Pragmatis nació para que la tecnología deje de ser un lujo de las grandes empresas. Vimos barberías, tiendas y restaurantes manejando su negocio entre cuadernos, chats y hojas de cálculo, y decidimos darles herramientas serias a un precio que tenga sentido.
              </p>
              <p>
                Por eso creamos plantillas probadas que adaptamos a cada marca, y para las empresas que necesitan algo propio, diseñamos software y automatizaciones a la medida. Tecnología seria, explicada en simple.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl bg-white p-6 md:p-8">
                  <it.icon className="text-paramo" />
                  <h3 className="mt-6 text-lg font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm text-texto2">{it.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal><p className="mt-12 flex items-center gap-3 text-lg font-medium"><LogoSymbol variant="claro" className="h-5 w-auto shrink-0" />Software que trabaja por tu negocio.</p></Reveal>
      </div>
    </section>
  );
}
