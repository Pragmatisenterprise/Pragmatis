import { ArrowDown, ArrowUp, Check as CheckIcon, Copy, EyeOff, MessageCircle, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import type { AdminTestimonial, TestimonialStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { adminApi, errorMessage } from "./api";
import { ErrorBox, Field, PageTitle, TextArea, TextInput, inputCls } from "./ui";

const groups: { status: TestimonialStatus; title: string; empty: string }[] = [
  { status: "pending", title: "Por revisar", empty: "Nada por revisar." },
  { status: "approved", title: "Publicados", empty: "Aún no hay testimonios publicados: la sección no se muestra en la web." },
  { status: "invited", title: "Enlaces enviados", empty: "No hay enlaces esperando respuesta." },
  { status: "hidden", title: "Ocultos", empty: "" },
];

const inviteUrl = (t: AdminTestimonial) => `${window.location.origin}/testimonio/${t.token}`;

type Draft = Pick<AdminTestimonial, "id" | "client_label" | "name" | "role" | "company" | "text" | "status"> & { rating: string };

export function Testimonials() {
  const [items, setItems] = useState<AdminTestimonial[] | null>(null);
  const [label, setLabel] = useState("");
  const [created, setCreated] = useState<AdminTestimonial | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminApi<AdminTestimonial[]>("/api/admin/testimonials").then(setItems).catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(load, [load]);

  const invite = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      setCreated(await adminApi<AdminTestimonial>("/api/admin/testimonials/invite", { method: "POST", body: { client_label: label } }));
      setLabel("");
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const copy = async (t: AdminTestimonial) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(t));
      setCopied(t.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Copia el enlace:", inviteUrl(t));
    }
  };

  const whatsapp = (t: AdminTestimonial) =>
    `https://wa.me/?text=${encodeURIComponent(`¡Hola! Nos ayudarías mucho contándonos cómo te ha ido con Pragmatis. Toma un minuto: ${inviteUrl(t)}`)}`;

  const put = async (t: AdminTestimonial | Draft, patch: Partial<Draft> = {}) => {
    setError("");
    try {
      await adminApi(`/api/admin/testimonials/${t.id}`, { method: "PUT", body: { ...t, ...patch } });
      setDraft(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (t: AdminTestimonial) => {
    const what = t.status === "invited" ? "Este enlace dejará de funcionar." : "No se puede deshacer.";
    if (!window.confirm(`¿Eliminar el testimonio de "${t.name || t.client_label || "sin nombre"}"? ${what}`)) return;
    try {
      await adminApi(`/api/admin/testimonials/${t.id}`, { method: "DELETE" });
      if (created?.id === t.id) setCreated(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  // Solo se reordenan los publicados, que son los que se ven en la web.
  const approved = items?.filter((t) => t.status === "approved") ?? [];
  const move = async (index: number, dir: -1 | 1) => {
    const next = [...approved];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    setItems([...next, ...(items ?? []).filter((t) => t.status !== "approved")]);
    try {
      await adminApi("/api/admin/testimonials/reorder", { method: "POST", body: { ids: next.map((t) => t.id) } });
    } catch (err) {
      setError(errorMessage(err));
      load();
    }
  };

  const set = (k: keyof Draft) => (e: { target: { value: string } }) => setDraft({ ...draft!, [k]: e.target.value });

  return (
    <>
      <PageTitle title="Testimonios" />
      <div className="space-y-6">
        <ErrorBox message={error} />

        <form onSubmit={invite} className="space-y-4 rounded-2xl bg-white p-6">
          <div>
            <h2 className="font-medium">Pedir un testimonio</h2>
            <p className="mt-1 text-sm text-tinta/60">Genera un enlace de un solo uso y envíaselo a tu cliente. Lo que escriba llega aquí para que lo revises antes de publicarlo.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <TextInput className="min-w-0 flex-1" maxLength={80} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="¿Para quién es? Ej. Barbería El Bigote (solo lo ves tú)" aria-label="Cliente" />
            <button className="btn-dark" disabled={busy}><Plus size={16} />{busy ? "Generando…" : "Generar enlace"}</button>
          </div>
          {created && (
            <div className="rounded-xl bg-paramo-suave p-4 text-sm">
              <p className="font-medium text-paramo-hondo">Enlace listo{created.client_label && ` para ${created.client_label}`}:</p>
              <p className="mt-1 break-all font-mono text-xs">{inviteUrl(created)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn bg-white px-3 py-2" onClick={() => copy(created)}>{copied === created.id ? <><CheckIcon size={16} />Copiado</> : <><Copy size={16} />Copiar</>}</button>
                <a href={whatsapp(created)} target="_blank" rel="noopener noreferrer" className="btn bg-white px-3 py-2"><MessageCircle size={16} />Enviar por WhatsApp</a>
              </div>
            </div>
          )}
        </form>

        {draft && (
          <form onSubmit={(e) => { e.preventDefault(); put(draft); }} className="space-y-4 rounded-2xl bg-white p-6">
            <h2 className="font-medium">Editar testimonio</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre"><TextInput required maxLength={80} value={draft.name} onChange={set("name")} /></Field>
              <Field label="Cargo"><TextInput maxLength={80} value={draft.role} onChange={set("role")} /></Field>
              <Field label="Empresa"><TextInput maxLength={80} value={draft.company} onChange={set("company")} /></Field>
              <Field label="Calificación">
                <select className={inputCls} value={draft.rating} onChange={set("rating")}>
                  <option value="">Sin calificación</option>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} de 5</option>)}
                </select>
              </Field>
            </div>
            <Field label="Testimonio" hint="Puedes corregir ortografía, pero no cambies lo que dijo el cliente."><TextArea required rows={4} maxLength={600} value={draft.text} onChange={set("text")} /></Field>
            <Field label="Etiqueta interna"><TextInput maxLength={80} value={draft.client_label} onChange={set("client_label")} /></Field>
            <div className="flex gap-2">
              <button className="btn-primary">Guardar</button>
              <button type="button" className="btn bg-arena" onClick={() => setDraft(null)}>Cancelar</button>
            </div>
          </form>
        )}

        {items && groups.map((g) => {
          const list = g.status === "approved" ? approved : items.filter((t) => t.status === g.status);
          if (!list.length && !g.empty) return null;
          return (
            <section key={g.status}>
              <h2 className="mb-3 text-sm font-medium text-tinta/60">{g.title} {list.length > 0 && `(${list.length})`}</h2>
              {!list.length && <p className="rounded-2xl bg-white p-5 text-sm text-tinta/50">{g.empty}</p>}
              <ul className="space-y-2">
                {list.map((t, i) => (
                  <li key={t.id} className={cn("flex gap-3 rounded-2xl bg-white p-4", t.status === "hidden" && "opacity-60")}>
                    {g.status === "approved" && (
                      <div className="flex flex-col">
                        <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Subir ${t.name}`}><ArrowUp size={16} /></button>
                        <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label={`Bajar ${t.name}`}><ArrowDown size={16} /></button>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {t.status === "invited" ? (
                        <>
                          <p className="font-medium">{t.client_label || "Sin etiqueta"}</p>
                          <p className="text-sm text-tinta/50">Enviado el {formatDate(t.created_at)} · esperando respuesta</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm">“{t.text}”</p>
                          <p className="mt-2 text-sm text-tinta/60">
                            <b className="text-tinta">{t.name}</b>{[t.role, t.company].filter(Boolean).length > 0 && ` · ${[t.role, t.company].filter(Boolean).join(", ")}`}
                            {t.rating && <span className="ml-2 inline-flex items-center gap-0.5 text-maiz-texto"><Star size={12} fill="currentColor" />{t.rating}</span>}
                          </p>
                          <p className="mt-1 text-xs text-tinta/40">{t.client_label && `${t.client_label} · `}Recibido el {formatDate(t.submitted_at)}</p>
                        </>
                      )}
                    </div>
                    <div className="flex shrink-0 items-start gap-1">
                      {t.status === "invited" && (
                        <button className="p-2 text-tinta/50 hover:text-tinta" onClick={() => copy(t)} aria-label="Copiar enlace">{copied === t.id ? <CheckIcon size={16} /> : <Copy size={16} />}</button>
                      )}
                      {(t.status === "pending" || t.status === "hidden") && (
                        <button className="btn bg-paramo px-3 py-1.5 text-white hover:bg-paramo-hondo" onClick={() => put(t, { status: "approved" })}>Publicar</button>
                      )}
                      {(t.status === "pending" || t.status === "approved") && (
                        <button className="p-2 text-tinta/50 hover:text-tinta" onClick={() => put(t, { status: "hidden" })} aria-label="Ocultar" title="Ocultar"><EyeOff size={16} /></button>
                      )}
                      {t.status !== "invited" && (
                        <button className="p-2 text-tinta/50 hover:text-tinta" onClick={() => { setError(""); setDraft({ ...t, rating: t.rating ? String(t.rating) : "" }); }} aria-label="Editar"><Pencil size={16} /></button>
                      )}
                      <button className="p-2 text-tinta/50 hover:text-error" onClick={() => remove(t)} aria-label="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
