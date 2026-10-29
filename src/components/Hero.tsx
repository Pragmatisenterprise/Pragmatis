import { Activity, Code2 } from "lucide-react";
import { site } from "@/config/site";
import { LogoSymbol } from "./Logo";

function CodeCard() {
  return (
    <div className="w-[290px] max-w-full -rotate-6 -mb-6 md:mb-0 rounded-2xl border border-papel/10 bg-gradient-to-br from-grafito-2 to-tinta p-5 text-left shadow-2xl">
      <div className="mb-4 flex items-center justify-between text-xs text-gris-oscuro">
        <Code2 size={18} /> <span>{site.name}</span>
      </div>
      <pre className="font-mono text-[11px] leading-5 text-papel/75">
{`const app = await deploy({
  stack: "cloud",
  env: "production",
  tests: "passing",
});`}
      </pre>
      <div className="mt-5 flex justify-between text-[10px] uppercase tracking-wide text-gris-oscuro">
        <span>build 214</span><span className="text-paramo-luz">● online</span>
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

function StatCard() {
  return (
    <div className="w-[270px] max-w-full rotate-3 -mt-8 md:mt-0 rounded-2xl bg-white p-5 md:pl-9 text-left text-tinta shadow-2xl">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-maiz-suave"><Activity size={16} /></span>
        {site.name}
        <span className="ml-auto text-xs text-texto2">Rendimiento</span>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-tight">99,98%</p>
      <p className="text-xs text-paramo">+0,4% uptime este mes</p>
      <svg viewBox="0 0 200 40" className="mt-3 w-full" aria-hidden>
        <path d="M0 32 C20 30 30 12 55 18 S95 34 120 20 S165 4 200 8" fill="none" stroke="#3C8C68" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="dark-section bg-tinta pb-16 pt-28 md:pb-24 md:pt-36 text-center text-papel">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-maiz" />{site.audience}</span>
          <span className="eyebrow">Más de <b className="text-papel">+50</b> proyectos entregados</span>
        </div>
        <h1 className="mx-auto mt-8 max-w-3xl text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.025em] md:text-7xl">
          {site.tagline}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-gris-oscuro md:mt-6 md:text-lg">
          Diseñamos, construimos y operamos páginas web, apps y automatizaciones a la medida de tu empresa.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <a href="#contacto" className="btn-primary">Solicitar una propuesta</a>
          <a href="#servicios" className="btn-ghost">Ver servicios</a>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center md:mt-16 md:flex-row">
          <CodeCard />
          <div className="z-10 md:-mx-3"><Orb /></div>
          <StatCard />
        </div>
      </div>
    </section>
  );
}
