import { FormEvent, useState } from "react";
import { Instagram, MessageCircle } from "lucide-react";
import { instagramUrl, nav, site, whatsappUrl } from "@/config/site";
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
      <section id="contacto" className="dark-section bg-tinta py-16 text-papel md:py-28">
        <Reveal className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">¿Hablamos de tu negocio?</h2>
            <p className="mt-5 max-w-md text-gris-oscuro max-lg:mx-auto">Cuéntanos qué hace tu negocio y qué te gustaría resolver. Te recomendamos la plantilla que mejor te sirve o, si necesitas algo a la medida, te proponemos un diagnóstico.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm max-lg:justify-center">
              <a href={`mailto:${site.email}`} className="text-paramo-luz hover:underline">{site.email}</a>
              {whatsappUrl("") && <a href={whatsappUrl("¡Hola! Quiero saber más sobre Pragmatis.")!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-paramo-luz hover:underline"><MessageCircle size={16} />WhatsApp</a>}
              {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-paramo-luz hover:underline"><Instagram size={16} />@{site.instagram}</a>}
            </div>
          </div>
          <ContactForm />
        </Reveal>
      </section>
      <footer className="dark-section border-t border-papel/10 bg-tinta pb-10 pt-16 text-papel">
        <div className="container grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-gris-oscuro">{site.tagline}. Plantillas para negocios locales y software a la medida para empresas.</p>
            {site.address && <p className="mt-6 text-xs text-gris-oscuro">{site.address}</p>}
            {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex text-gris-oscuro hover:text-papel" aria-label="Instagram"><Instagram size={20} /></a>}
          </div>
          <div>
            <h4 className="text-sm font-medium">Páginas</h4>
            <ul className="mt-4 space-y-2 text-sm text-gris-oscuro">
              {nav.map((n) => <li key={n.href}><a href={n.href} className="hover:text-papel">{n.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-gris-oscuro">
              <li>Política de privacidad</li><li>Términos y condiciones</li>
            </ul>
          </div>
          <form onSubmit={onSubmit}>
            <h4 className="text-sm font-medium">Mantente al día</h4>
            <p className="mt-2 text-sm text-gris-oscuro">Ideas prácticas para digitalizar tu negocio.</p>
            {state === "sent" ? <p role="status" className="mt-4 text-sm text-paramo-luz">¡Gracias por suscribirte!</p> : (
              <div className="mt-4 flex gap-2">
                <input name="email" required type="email" placeholder="Tu correo" aria-label="Correo electrónico" className="min-w-0 flex-1 rounded-xl border border-papel/10 bg-papel/5 px-4 py-3 text-sm outline-none placeholder:text-papel/40 focus:border-maiz" />
                <button className="btn-primary" disabled={state === "sending"}>Suscribir</button>
              </div>
            )}
            {state === "error" && <p role="alert" className="mt-2 text-sm text-error-oscuro">No se pudo suscribir. Inténtalo de nuevo.</p>}
          </form>
        </div>
        <p className="container mt-14 text-xs text-gris-oscuro">© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
