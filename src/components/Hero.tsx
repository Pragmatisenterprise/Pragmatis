import { Activity, Code2, GitBranch } from "lucide-react";
import { site } from "@/config/site";

function CodeCard() {
  return (
    <div className="w-[290px] max-w-full -rotate-6 -mb-6 md:mb-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#2a2a2e] to-[#0e0e10] p-5 text-left shadow-2xl">
      <div className="mb-4 flex items-center justify-between text-xs text-white/50">
        <Code2 size={18} /> <span>{site.name}</span>
      </div>
      <pre className="font-mono text-[11px] leading-5 text-white/70">
{`const app = await deploy({
  stack: "cloud",
  env: "production",
  tests: "passing",
});`}
      </pre>
      <div className="mt-5 flex justify-between text-[10px] uppercase tracking-wide text-white/40">
        <span>build 214</span><span className="text-emerald">● online</span>
      </div>
    </div>
  );
}

function Orb() {
  return (
    <div className="relative h-[170px] w-[170px] md:h-[210px] md:w-[210px] animate-float" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#5b3df5,#2fb98a,#8b74ff,#1a1a2e,#5b3df5)] shadow-[0_0_80px_rgba(91,61,245,.55)]" />
      <div className="absolute inset-5 rounded-full bg-gradient-to-br from-black/70 to-transparent ring-1 ring-white/20" />
      <div className="absolute inset-0 flex items-center justify-center text-white"><GitBranch size={64} strokeWidth={1.4} /></div>
    </div>
  );
}

function StatCard() {
  return (
    <div className="w-[270px] max-w-full rotate-3 -mt-8 md:mt-0 rounded-2xl bg-white p-5 md:pl-9 text-left text-charcoal shadow-2xl">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blush"><Activity size={16} /></span>
        {site.name}
        <span className="ml-auto text-xs text-charcoal/40">Rendimiento</span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">99,98%</p>
      <p className="text-xs text-emerald">+0,4% uptime este mes</p>
      <svg viewBox="0 0 200 40" className="mt-3 w-full" aria-hidden>
        <path d="M0 32 C20 30 30 12 55 18 S95 34 120 20 S165 4 200 8" fill="none" stroke="#2fb98a" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-black pb-16 pt-28 md:pb-24 md:pt-36 text-center text-white">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-violet-glow" />{site.tagline}</span>
          <span className="eyebrow">Más de <b className="text-white">+50</b> proyectos entregados</span>
        </div>
        <h1 className="mx-auto mt-8 max-w-3xl text-[2.75rem] font-semibold leading-[1.05] tracking-tight md:text-7xl">
          Software que mueve tu negocio
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-white/60 md:mt-6 md:text-lg">
          Diseñamos, construimos y operamos plataformas web, automatizaciones e integraciones a la medida de tu empresa.
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
