import { CalendarCheck, ShoppingBag } from "lucide-react";
import { site } from "@/config/site";
import { LogoSymbol } from "./Logo";

// Maquetas ilustrativas de lo que hace una plantilla: reservas y pedidos.
function BookingCard() {
  return (
    <div className="w-[280px] max-w-full -rotate-6 -mb-6 md:mb-0 rounded-2xl border border-papel/10 bg-gradient-to-br from-grafito-2 to-tinta p-5 text-left shadow-2xl">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-paramo text-papel"><CalendarCheck size={16} /></span>
        Reservas
        <span className="ml-auto text-[10px] uppercase tracking-wide text-gris-oscuro">Barbería</span>
      </div>
      <div className="mt-4 space-y-2 text-xs">
        {[["9:00", "Corte clásico", "Confirmada"], ["10:30", "Barba + corte", "Confirmada"], ["11:15", "Disponible", ""]].map(([h, s, st]) => (
          <div key={h} className="flex items-center gap-3 rounded-lg bg-papel/5 px-3 py-2">
            <span className="font-mono text-papel/60">{h}</span>
            <span className={st ? "text-papel/85" : "text-gris-oscuro"}>{s}</span>
            {st && <span className="ml-auto text-paramo-luz">●</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Orb() {
  return (
    <div className="relative h-[170px] w-[170px] md:h-[210px] md:w-[210px] animate-float" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#1C5A43,#6CC19A,#E3B23C,#1A231E,#1C5A43)] shadow-[0_0_80px_rgba(108,193,154,.4)]" />
      <div className="absolute inset-5 rounded-full bg-gradient-to-br from-tinta/80 to-tinta/30 ring-1 ring-papel/20" />
      <div className="absolute inset-0 flex items-center justify-center"><LogoSymbol className="h-16 w-auto md:h-20" /></div>
    </div>
  );
}

function OrderCard() {
  return (
    <div className="w-[270px] max-w-full rotate-3 -mt-8 md:mt-0 rounded-2xl bg-white p-5 md:pl-9 text-left text-tinta shadow-2xl">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-maiz-suave"><ShoppingBag size={16} /></span>
        Nuevo pedido
        <span className="ml-auto text-xs text-texto2">Tienda</span>
      </div>
      <ul className="mt-4 space-y-1.5 text-xs text-texto2">
        <li className="flex justify-between"><span>2 × Café molido 500 g</span><span className="font-mono">$ 38.000</span></li>
        <li className="flex justify-between"><span>1 × Panela x 4</span><span className="font-mono">$ 9.500</span></li>
      </ul>
      <p className="mt-3 flex items-baseline justify-between border-t border-linea pt-3">
        <span className="text-xs text-texto2">Total</span>
        <span className="font-mono text-xl font-semibold">$ 47.500</span>
      </p>
      <p className="mt-1 text-xs text-paramo">Pago recibido · listo para entregar</p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="dark-section bg-tinta pb-16 pt-28 md:pb-24 md:pt-36 text-center text-papel">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-maiz" />{site.audience}</span>
          <span className="eyebrow">Negocios locales ya venden y agendan con <b className="text-papel">Pragmatis</b></span>
        </div>
        <h1 className="mx-auto mt-8 max-w-3xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.025em] md:text-7xl">
          {site.tagline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-gris-oscuro md:mt-6 md:text-lg">
          Portales web y apps listas para tu barbería, restaurante, tienda o droguería, con tu marca. Y si tu empresa necesita algo propio, lo construimos a la medida.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <a href="#plantillas" className="btn-primary">Ver plantillas</a>
          <a href="#contacto" className="btn-ghost">Hablemos de tu proyecto</a>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center md:mt-16 md:flex-row">
          <BookingCard />
          <div className="z-10 md:-mx-3"><Orb /></div>
          <OrderCard />
        </div>
      </div>
    </section>
  );
}
