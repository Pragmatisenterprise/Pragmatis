import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatCop, slugify } from "@/lib/format";
import { kindLabel } from "@/lib/templates";
import type { Template } from "@/lib/types";
import { adminApi, errorMessage } from "./api";
import { Badge, Check, ErrorBox, Field, ImageUpload, PageTitle, TextArea, TextInput, inputCls } from "./ui";

// `features` se edita como texto (una por línea) y se convierte en arreglo al guardar.
type Draft = Pick<Template, "slug" | "name" | "business" | "kind" | "summary" | "thumb_url" | "demo_url"> & {
  id?: number; features: string; price_from: string; published: boolean;
};
const empty: Draft = { slug: "", name: "", business: "", kind: "web", summary: "", features: "", price_from: "", thumb_url: "", demo_url: "", published: true };

export function Templates() {
  const [items, setItems] = useState<Template[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminApi<Template[]>("/api/admin/templates").then(setItems).catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(load, [load]);

  const edit = (d: Draft, existing: boolean) => {
    setError("");
    setSlugTouched(existing);
    setDraft(d);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError("");
    const body = {
      ...draft,
      features: draft.features.split("\n").map((f) => f.trim()).filter(Boolean),
      price_from: Number(draft.price_from.replace(/\D/g, "") || 0),
    };
    try {
      await adminApi(draft.id ? `/api/admin/templates/${draft.id}` : "/api/admin/templates", { method: draft.id ? "PUT" : "POST", body });
      setDraft(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (t: Template) => {
    if (!window.confirm(`¿Eliminar la plantilla "${t.name}"? No se puede deshacer.`)) return;
    try {
      await adminApi(`/api/admin/templates/${t.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    if (!items) return;
    const next = [...items];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    setItems(next);
    try {
      await adminApi("/api/admin/templates/reorder", { method: "POST", body: { ids: next.map((t) => t.id) } });
    } catch (err) {
      setError(errorMessage(err));
      load();
    }
  };

  const set = (k: keyof Draft) => (e: { target: { value: string } }) => setDraft({ ...draft!, [k]: e.target.value });
  const setName = (e: { target: { value: string } }) =>
    setDraft({ ...draft!, name: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) });

  return (
    <>
      <PageTitle title="Plantillas">
        {!draft && <button className="btn-dark" onClick={() => edit(empty, false)}><Plus size={16} />Nueva plantilla</button>}
      </PageTitle>
      <div className="space-y-4">
        <ErrorBox message={error} />
        {draft && (
          <form onSubmit={save} className="space-y-4 rounded-2xl bg-white p-6">
            <h2 className="font-medium">{draft.id ? "Editar plantilla" : "Nueva plantilla"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" hint="Ej. Barbería Clásica"><TextInput required maxLength={80} value={draft.name} onChange={setName} /></Field>
              <Field label="Identificador" hint={`Enlace para compartir: /plantillas/${draft.slug || "…"}`}>
                <TextInput required maxLength={80} value={draft.slug} onChange={(e) => { setSlugTouched(true); set("slug")(e); }} />
              </Field>
              <Field label="Rubro" hint="Ej. Barbería, Restaurante, Droguería"><TextInput required maxLength={40} value={draft.business} onChange={set("business")} /></Field>
              <Field label="Tipo">
                <select className={inputCls} value={draft.kind} onChange={set("kind")}>
                  <option value="web">Portal web</option>
                  <option value="app">App (instalable en el celular)</option>
                </select>
              </Field>
            </div>
            <Field label="Descripción" hint="Una o dos frases: qué resuelve para el negocio (máx. 300)"><TextArea rows={2} maxLength={300} value={draft.summary} onChange={set("summary")} /></Field>
            <Field label="Características" hint="Una por línea, máx. 12. Ej. Reservas en línea"><TextArea rows={4} value={draft.features} onChange={set("features")} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Precio desde (COP)" hint="Solo números. Vacío o 0 = no se muestra precio.">
                <TextInput inputMode="numeric" value={draft.price_from} onChange={set("price_from")} placeholder="450000" />
              </Field>
              <Field label="URL de la demo" hint="https://… La página debe permitir mostrarse dentro de un iframe.">
                <TextInput type="url" value={draft.demo_url} onChange={set("demo_url")} placeholder="https://" />
              </Field>
            </div>
            <ImageUpload label="Miniatura" hint="Captura de la plantilla, idealmente 4:3. Vacío = fondo degradado." value={draft.thumb_url} onChange={(thumb_url) => setDraft({ ...draft, thumb_url })} />
            <Check label="Visible en la web" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button>
              <button type="button" className="btn bg-arena" onClick={() => setDraft(null)}>Cancelar</button>
              {draft.demo_url.startsWith("https://") && (
                <a href={draft.demo_url} target="_blank" rel="noopener noreferrer" className="btn ml-auto text-paramo"><ExternalLink size={16} />Probar la demo</a>
              )}
            </div>
          </form>
        )}
        {items?.length === 0 && !draft && <p className="rounded-2xl bg-white p-6 text-sm text-tinta/60">Aún no hay plantillas. Crea la primera para que aparezca en la sección Plantillas de la web.</p>}
        <ul className="space-y-2">
          {items?.map((t, i) => (
            <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-white p-4">
              <div className="flex flex-col">
                <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Subir ${t.name}`}><ArrowUp size={16} /></button>
                <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Bajar ${t.name}`}><ArrowDown size={16} /></button>
              </div>
              {t.thumb_url ? <img src={t.thumb_url} alt="" className="hidden h-12 w-16 rounded-lg object-cover sm:block" /> : <div className="hidden h-12 w-16 rounded-lg bg-gradient-to-br from-paramo to-paramo-luz/50 sm:block" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{t.name}</p>
                <p className="truncate text-sm text-tinta/50">
                  {t.business || "Sin rubro"} · {kindLabel[t.kind]}{t.price_from > 0 && <> · <span className="font-mono">{formatCop(t.price_from)}</span></>}
                </p>
              </div>
              <Badge on={!!t.published} yes="Visible" no="Oculta" />
              <button
                className="p-2 text-tinta/50 hover:text-tinta"
                onClick={() => edit({ ...t, features: t.features.join("\n"), price_from: t.price_from ? String(t.price_from) : "", published: !!t.published }, true)}
                aria-label={`Editar ${t.name}`}
              ><Pencil size={16} /></button>
              <button className="p-2 text-tinta/50 hover:text-error" onClick={() => remove(t)} aria-label={`Eliminar ${t.name}`}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
