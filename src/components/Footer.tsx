import { FormEvent, useState } from "react";
import { nav, site } from "@/config/site";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";

export function Footer() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <>
      <section id="contacto" className="bg-black py-28 text-center text-white">
        <Reveal className="container">
          <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">¿Listo para construir tu próximo software?</h2>
          <p className="mx-auto mt-5 max-w-md text-white/60">Desde startups que lanzan su primer producto hasta empresas que escalan globalmente.</p>
          <a href={`mailto:${site.email}`} className="btn-primary mt-8">Hablemos de tu proyecto</a>
        </Reveal>
      </section>
      <footer className="border-t border-white/10 bg-black pb-10 pt-16 text-white">
        <div className="container grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-white/50">{site.tagline}. Desde la idea hasta producción.</p>
            <p className="mt-6 text-xs text-white/40">{site.address}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Páginas</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/50">
              {nav.map((n) => <li key={n.href}><a href={n.href} className="hover:text-white">{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/50">
              <li>Política de privacidad</li><li>Términos y condiciones</li>
            </ul>
          </div>
          <form onSubmit={onSubmit}>
            <h4 className="text-sm font-medium">Mantente al día</h4>
            <p className="mt-2 text-sm text-white/50">Novedades sobre desarrollo y tecnología.</p>
            {sent ? <p className="mt-4 text-sm text-emerald">¡Gracias por suscribirte!</p> : (
              <div className="mt-4 flex gap-2">
                <input required type="email" placeholder="Tu correo" aria-label="Correo electrónico" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-violet-glow" />
                <button className="btn-primary">Suscribir</button>
              </div>
            )}
          </form>
        </div>
        <p className="container mt-14 text-xs text-white/30">© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
