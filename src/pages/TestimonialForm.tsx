import { CheckCircle2, Star } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const input =
  "w-full rounded-xl border border-tinta/15 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-tinta/40 focus:border-paramo";

// Página a la que llega el cliente desde el enlace de un solo uso que genera el panel.
export default function TestimonialForm() {
  const { token = "" } = useParams();
  const [state, setState] = useState<"checking" | "ready" | "sending" | "sent" | "invalid">("checking");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    api(`/api/testimonials/invite/${encodeURIComponent(token)}`)
      .then(() => setState("ready"))
      .catch((e) => { setError(e.message); setState("invalid"); });
  }, [token]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    setError("");
    try {
      await api(`/api/testimonials/invite/${encodeURIComponent(token)}`, { method: "POST", body: { ...data, rating: rating || null } });
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal");
      setState("ready");
    }
  };

  return (
    <>
      <Helmet><title>Cuéntanos tu experiencia | Pragmatis</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="min-h-screen bg-papel">
        <header className="dark-section bg-tinta py-5 text-papel">
          <div className="container"><a href="/" aria-label="Pragmatis"><Logo /></a></div>
        </header>
        <main className="container max-w-xl py-12 md:py-20">
          {state === "checking" && <p className="text-center text-sm text-texto2">Cargando…</p>}

          {state === "invalid" && (
            <div className="rounded-3xl bg-arena p-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">{error || "Este enlace no está disponible"}</h1>
              <p className="mt-3 text-texto2">Si quieres dejarnos un comentario, escríbenos y te enviamos un enlace nuevo.</p>
              <a href="/#contacto" className="btn-dark mt-6">Ir a contacto</a>
            </div>
          )}

          {state === "sent" && (
            <div className="rounded-3xl bg-paramo-suave p-8 text-center">
              <CheckCircle2 className="mx-auto text-paramo" size={36} />
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">¡Gracias por tu tiempo!</h1>
              <p className="mt-3 text-texto2">Recibimos tu testimonio. Nos ayuda mucho a que otros negocios confíen en nosotros.</p>
              <a href="/" className="btn-dark mt-6">Ir a pragmatis.com.co</a>
            </div>
          )}

          {(state === "ready" || state === "sending") && (
            <>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">¿Cómo te ha ido con Pragmatis?</h1>
              <p className="mt-3 text-texto2">Tu opinión, en tus palabras. Lo que escribas puede aparecer en nuestra página con tu nombre y cargo.</p>
              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">Tu nombre</span>
                  <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={input} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium">Cargo</span>
                    <input name="role" maxLength={80} placeholder="Ej. Dueño, Gerente" autoComplete="organization-title" className={input} />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-medium">Negocio o empresa</span>
                    <input name="company" maxLength={80} autoComplete="organization" className={input} />
                  </label>
                </div>
                <fieldset className="text-sm">
                  <legend className="mb-1.5 font-medium">Calificación <span className="font-normal text-texto2">(opcional)</span></legend>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n} type="button" onClick={() => setRating(n === rating ? 0 : n)}
                        aria-label={`${n} de 5`} aria-pressed={n <= rating}
                        className={cn("rounded-lg p-1 transition-colors", n <= rating ? "text-maiz-ocre" : "text-tinta/20 hover:text-tinta/40")}
                      ><Star size={28} fill="currentColor" /></button>
                    ))}
                  </div>
                </fieldset>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium">Tu experiencia</span>
                  <textarea name="text" required minLength={10} maxLength={600} rows={5} placeholder="¿Qué problema te resolvimos? ¿Cómo ha cambiado tu negocio?" className={input} />
                </label>
                {error && <p role="alert" className="text-sm text-error">{error}</p>}
                <button className="btn-dark w-full sm:w-auto" disabled={state === "sending"}>{state === "sending" ? "Enviando…" : "Enviar testimonio"}</button>
              </form>
            </>
          )}
        </main>
      </div>
    </>
  );
}
