import { FormEvent, useState } from "react";
import { postJson } from "@/lib/api";
import { site } from "@/config/site";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-papel/10 bg-papel/5 px-4 py-3 text-sm text-papel outline-none placeholder:text-papel/40 focus:border-maiz";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      await postJson("/api/contact", data);
      setStatus("sent");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-3xl border border-papel/10 bg-papel/5 p-8 text-left">
        <p className="text-xl font-semibold">¡Mensaje enviado!</p>
        <p className="mt-2 text-sm text-gris-oscuro">Te responderemos en menos de 24 horas hábiles.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-papel/10 bg-papel/[0.03] p-5 text-left md:p-8">
      <label className="block text-sm">
        <span className="mb-1.5 block text-papel/75">Nombre</span>
        <input name="name" required minLength={2} maxLength={100} autoComplete="name" className={field} placeholder="Tu nombre" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-papel/75">Correo</span>
        <input name="email" type="email" required autoComplete="email" className={field} placeholder="tu@empresa.com" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-papel/75">Cuéntanos tu proyecto</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} className={field} placeholder="¿Qué necesitas construir o mejorar?" />
      </label>
      {/* Campo trampa anti-bots */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <button className="btn-primary w-full disabled:opacity-60" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-error-oscuro">
          {error}. Puedes escribirnos a <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      )}
    </form>
  );
}
