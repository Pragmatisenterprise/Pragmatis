import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { formatCop, slugify } from "@/lib/format";
import { moduleIcon } from "@/lib/templates";
import type { Module } from "@/lib/types";
import { adminApi, errorMessage } from "./api";
import { Badge, Check, ErrorBox, Field, PageTitle, TextArea, TextInput } from "./ui";

type Draft = Pick<Module, "slug" | "name" | "summary"> & { id?: number; price: string; published: boolean };
const empty: Draft = { slug: "", name: "", summary: "", price: "", published: true };

export function Modules() {
  const [items, setItems] = useState<Module[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminApi<Module[]>("/api/admin/modules").then(setItems).catch((e) => setError(errorMessage(e)));
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
    const body = { ...draft, price: Number(draft.price.replace(/\D/g, "") || 0) };
    try {
      await adminApi(draft.id ? `/api/admin/modules/${draft.id}` : "/api/admin/modules", { method: draft.id ? "PUT" : "POST", body });
      setDraft(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (m: Module) => {
    if (!window.confirm(`¿Eliminar el módulo "${m.name}"? Se quitará de todas las plantillas. No se puede deshacer.`)) return;
    try {
      await adminApi(`/api/admin/modules/${m.id}`, { method: "DELETE" });
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
      await adminApi("/api/admin/modules/reorder", { method: "POST", body: { ids: next.map((m) => m.id) } });
    } catch (err) {
      setError(errorMessage(err));
      load();
    }
  };

  const set = (k: keyof Draft) => (e: { target: { value: string } }) => setDraft({ ...draft!, [k]: e.target.value });
  const setName = (e: { target: { value: string } }) =>
    setDraft({ ...draft!, name: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value).slice(0, 40) }) });

  return (
    <>
      <PageTitle title="Módulos">
        {!draft && <button className="btn-dark" onClick={() => edit(empty, false)}><Plus size={16} />Nuevo módulo</button>}
      </PageTitle>
      <div className="space-y-4">
        <ErrorBox message={error} />
        <p className="text-sm text-tinta/60">Funciones que se activan en las plantillas (reservas, pedidos, caja…). En cada plantilla marcas cuáles vienen incluidos y cuáles se pueden agregar.</p>
        {draft && (
          <form onSubmit={save} className="space-y-4 rounded-2xl bg-white p-6">
            <h2 className="font-medium">{draft.id ? "Editar módulo" : "Nuevo módulo"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" hint="Ej. Reservas"><TextInput required maxLength={40} value={draft.name} onChange={setName} /></Field>
              <Field label="Identificador" hint="Define el icono; usa el mismo slug que en la plataforma.">
                <TextInput required maxLength={40} value={draft.slug} onChange={(e) => { setSlugTouched(true); set("slug")(e); }} />
              </Field>
            </div>
            <Field label="Descripción" hint="Una frase: qué resuelve (máx. 200)"><TextArea rows={2} maxLength={200} value={draft.summary} onChange={set("summary")} /></Field>
            <Field label="Precio como adicional (COP)" hint="Pago único. Vacío o 0 = no se muestra precio.">
              <TextInput inputMode="numeric" value={draft.price} onChange={set("price")} placeholder="150000" />
            </Field>
            <Check label="Visible en la web" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button>
              <button type="button" className="btn bg-arena" onClick={() => setDraft(null)}>Cancelar</button>
            </div>
          </form>
        )}
        {items?.length === 0 && !draft && <p className="rounded-2xl bg-white p-6 text-sm text-tinta/60">Aún no hay módulos.</p>}
        <ul className="space-y-2">
          {items?.map((m, i) => {
            const Icon = moduleIcon(m.slug);
            return (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-white p-4">
                <div className="flex flex-col">
                  <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Subir ${m.name}`}><ArrowUp size={16} /></button>
                  <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Bajar ${m.name}`}><ArrowDown size={16} /></button>
                </div>
                <Icon size={20} className="hidden shrink-0 text-paramo sm:block" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.name}</p>
                  <p className="truncate text-sm text-tinta/50">{m.summary || m.slug}{m.price > 0 && <> · <span className="font-mono">{formatCop(m.price)}</span></>}</p>
                </div>
                <Badge on={!!m.published} yes="Visible" no="Oculto" />
                <button
                  className="p-2 text-tinta/50 hover:text-tinta"
                  onClick={() => edit({ ...m, price: m.price ? String(m.price) : "", published: !!m.published }, true)}
                  aria-label={`Editar ${m.name}`}
                ><Pencil size={16} /></button>
                <button className="p-2 text-tinta/50 hover:text-error" onClick={() => remove(m)} aria-label={`Eliminar ${m.name}`}><Trash2 size={16} /></button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
