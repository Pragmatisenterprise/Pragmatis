import { Reveal } from "./Reveal";

// Los tres escalones del símbolo Ascenso: diagnóstico, construcción y crecimiento.
const steps = [
  { title: "Diagnóstico", text: "Nos cuentas cómo funciona tu negocio y qué te quita tiempo. Te decimos si te sirve una plantilla o si necesitas algo a la medida, y cuánto cuesta." },
  { title: "Construcción", text: "Adaptamos la plantilla a tu marca o construimos tu sistema. Te mostramos avances y ajustamos con tus comentarios." },
  { title: "Crecimiento", text: "Lo publicamos, te enseñamos a usarlo y seguimos contigo. Cuando tu negocio crezca, la solución crece con él." },
];

export function Process() {
  return (
    <section className="pb-16 md:pb-28">
      <div className="container">
        <Reveal>
          <p className="text-center text-sm font-medium text-paramo">Cómo trabajamos</p>
          <h2 className="mx-auto mt-3 max-w-xl text-center text-3xl font-semibold tracking-tight md:text-4xl">
            Tres pasos, sin tecnicismos
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:items-end">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              {/* Cada paso sube un escalón, como el símbolo. */}
              <div className={`rounded-3xl bg-arena p-6 md:p-8 ${["", "md:mb-6", "md:mb-12"][i]}`}>
                <span className="font-mono text-sm text-maiz-texto">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-texto2">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
