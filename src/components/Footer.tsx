import { FormEvent, useState } from "react";
import { nav, site } from "@/config/site";
import { postJson } from "@/lib/api";
import { ContactForm } from "./ContactForm";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";

export function Footer() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    setState("sending");
    try {
      await postJson("/api/subscribe", { email });
      setState("sent");
    } catch {
      setState("error");
    }
  };
  return (
    <>
      <section id="contacto" className="bg-black py-16 text-white md:py-28">
        <Reveal className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">¿Listo para construir tu próximo software?</h2>
            <p className="mt-5 max-w-md text-white/60 max-lg:mx-auto">Desde startups que lanzan su primer producto hasta empresas que escalan globalmente. Cuéntanos qué necesitas y te respondemos con una propuesta.</p>
            <a href={`mailto:${site.email}`} className="mt-6 inline-block text-sm text-violet-glow hover:underline">{site.email}</a>
          </div>
          <ContactForm />
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
            {state === "sent" ? <p role="status" className="mt-4 text-sm text-emerald">¡Gracias por suscribirte!</p> : (
              <div className="mt-4 flex gap-2">
                <input name="email" required type="email" placeholder="Tu correo" aria-label="Correo electrónico" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-violet-glow" />
                <button className="btn-primary" disabled={state === "sending"}>Suscribir</button>
              </div>
            )}
            {state === "error" && <p role="alert" className="mt-2 text-sm text-red-400">No se pudo suscribir. Inténtalo de nuevo.</p>}
          </form>
        </div>
        <p className="container mt-14 text-xs text-white/30">© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
