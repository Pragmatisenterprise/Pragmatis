import { Fingerprint, Cloud, ServerCog } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  { icon: Fingerprint, title: "Cumplimiento y buenas prácticas", text: "Trabajamos con estándares de seguridad y protección de datos desde el diseño." },
  { icon: Cloud, title: "100% digital", text: "Colaboración remota y herramientas modernas para entregar desde cualquier lugar." },
  { icon: ServerCog, title: "Independiente y confiable", text: "Código que es tuyo, documentado y sin dependencia de terceros innecesarios." },
];

export function Security() {
  return (
    <section id="nosotros" className="bg-mist py-16 md:py-28">
      <div className="container">
        <Reveal>
          <p className="text-sm font-medium text-violet">Seguridad</p>
          <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight md:text-4xl">Seguridad y confianza en cada entrega</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white p-8">
                <it.icon className="text-violet" />
                <h3 className="mt-8 text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-charcoal/60">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><p className="mt-10 text-lg font-medium">⚡ La solución completa para digitalizar y escalar tu operación.</p></Reveal>
      </div>
    </section>
  );
}
