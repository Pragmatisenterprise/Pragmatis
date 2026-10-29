import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import { adminApi, errorMessage } from "./api";
import { Badge, Check, ErrorBox, Field, PageTitle, TextArea, TextInput } from "./ui";

type Draft = Pick<Project, "title" | "summary" | "category" | "image_url" | "link_url"> & { id?: number; published: boolean };
const empty: Draft = { title: "", summary: "", category: "", image_url: "", link_url: "", published: true };

export function Projects() {
  const [items, setItems] = useState<Project[] | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminApi<Project[]>("/api/admin/projects").then(setItems).catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(load, [load]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError("");
    try {
      await adminApi(draft.id ? `/api/admin/projects/${draft.id}` : "/api/admin/projects", { method: draft.id ? "PUT" : "POST", body: draft });
      setDraft(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: Project) => {
    if (!window.confirm(`¿Eliminar el proyecto "${p.title}"? No se puede deshacer.`)) return;
    try {
      await adminApi(`/api/admin/projects/${p.id}`, { method: "DELETE" });
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
      await adminApi("/api/admin/projects/reorder", { method: "POST", body: { ids: next.map((p) => p.id) } });
    } catch (err) {
      setError(errorMessage(err));
      load();
    }
  };

  const set = (k: keyof Draft) => (e: { target: { value: string } }) => setDraft({ ...draft!, [k]: e.target.value });

  return (
    <>
      <PageTitle title="Proyectos">
        {!draft && <button className="btn-dark" onClick={() => { setError(""); setDraft(empty); }}><Plus size={16} />Nuevo proyecto</button>}
      </PageTitle>
      <div className="space-y-4">
        <ErrorBox message={error} />
        {draft && (
          <form onSubmit={save} className="space-y-4 rounded-2xl bg-white p-6">
            <h2 className="font-medium">{draft.id ? "Editar proyecto" : "Nuevo proyecto"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título"><TextInput required maxLength={120} value={draft.title} onChange={set("title")} /></Field>
              <Field label="Categoría" hint="Ej. Plataforma web, Automatización"><TextInput maxLength={40} value={draft.category} onChange={set("category")} /></Field>
            </div>
            <Field label="Descripción"><TextArea rows={3} maxLength={400} value={draft.summary} onChange={set("summary")} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="URL de la imagen" hint="Enlace a una imagen (https://…). Vacío = fondo degradado."><TextInput value={draft.image_url} onChange={set("image_url")} placeholder="https://" /></Field>
              <Field label="Enlace del proyecto" hint="Opcional. Si lo pones, la tarjeta es clicable."><TextInput value={draft.link_url} onChange={set("link_url")} placeholder="https://" /></Field>
            </div>
            <Check label="Visible en la web" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
            <div className="flex gap-2">
              <button className="btn-primary" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button>
              <button type="button" className="btn bg-arena" onClick={() => setDraft(null)}>Cancelar</button>
            </div>
          </form>
        )}
        {items?.length === 0 && !draft && <p className="rounded-2xl bg-white p-6 text-sm text-tinta/60">Aún no hay proyectos. Crea el primero para que aparezca la sección en la web.</p>}
        <ul className="space-y-2">
          {items?.map((p, i) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-4">
              <div className="flex flex-col">
                <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Subir ${p.title}`}><ArrowUp size={16} /></button>
                <button className="p-0.5 text-tinta/40 hover:text-tinta disabled:opacity-20" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Bajar ${p.title}`}><ArrowDown size={16} /></button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.title}</p>
                <p className="truncate text-sm text-tinta/50">{p.category || "Sin categoría"}</p>
              </div>
              <Badge on={!!p.published} yes="Visible" no="Oculto" />
              <button className="p-2 text-tinta/50 hover:text-tinta" onClick={() => { setError(""); setDraft({ ...p, published: !!p.published }); }} aria-label={`Editar ${p.title}`}><Pencil size={16} /></button>
              <button className="p-2 text-tinta/50 hover:text-error" onClick={() => remove(p)} aria-label={`Eliminar ${p.title}`}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
