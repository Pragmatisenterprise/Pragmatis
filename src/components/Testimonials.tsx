import { Play } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  { name: "Sofía Martínez", role: "Cofundadora y CEO", text: "Transformaron cómo operamos: un software simple, rápido y confiable.", video: false },
  { name: "Andrés Gómez", role: "Director de Tecnología", text: "Entregaron a tiempo y la integración con nuestros sistemas fue impecable.", video: true },
  { name: "Laura Pérez", role: "Gerente de Operaciones", text: "Automatizamos procesos que nos tomaban días. Ahora son minutos.", video: false },
  { name: "Camilo Rojas", role: "Fundador", text: "Un equipo cercano que entiende el negocio, no solo el código.", video: true },
  { name: "Valentina Díaz", role: "Directora de Producto", text: "Escalamos sin dolores de cabeza gracias a su arquitectura.", video: false },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-28">
      <div className="container">
        <Reveal>
          <p className="text-center text-sm font-medium text-paramo">Testimonios</p>
          <h2 className="mx-auto mt-3 max-w-lg text-center text-3xl font-semibold tracking-tight md:text-4xl">Pensado para empresas que valoran software seguro y bien hecho</h2>
        </Reveal>
        <div className="mt-14 columns-1 gap-4 md:columns-3">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06} className="mb-4 break-inside-avoid">
              <figure className={t.video ? "relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-paramo to-tinta p-6 text-papel" : "rounded-3xl bg-arena p-6"}>
                {t.video && <span className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-tinta/40 px-3 py-1 text-xs"><Play size={12} />Ver</span>}
                <blockquote className="text-lg font-medium leading-snug">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tinta text-xs font-semibold text-papel">{t.name[0]}</span>
                  <span><b className="block">{t.name}</b><span className="opacity-75">{t.role}</span></span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
