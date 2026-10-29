import { ArrowLeft } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { slugify } from "@/lib/format";
import { Markdown } from "@/lib/markdown";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { adminApi, errorMessage } from "./api";
import { Check, ErrorBox, Field, ImageUpload, PageTitle, TextArea, TextInput } from "./ui";

interface Draft { title: string; slug: string; excerpt: string; content: string; tag: string; author: string; cover_url: string; published: boolean }
const empty: Draft = { title: "", slug: "", excerpt: "", content: "", tag: "", author: "", cover_url: "", published: false };

export function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft | null>(id ? null : empty);
  const [slugTouched, setSlugTouched] = useState(!!id);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminApi<Post & { published: number }>(`/api/admin/posts/${id}`)
      .then((p) => setDraft({ ...p, published: !!p.published }))
      .catch((e) => setError(errorMessage(e)));
  }, [id]);

  if (!draft) return <>{error ? <ErrorBox message={error} /> : null}</>;

  const set = (k: keyof Draft) => (e: { target: { value: string } }) => {
    setSaved(false);
    setDraft({ ...draft, [k]: e.target.value });
  };
  const setTitle = (e: { target: { value: string } }) => {
    setSaved(false);
    setDraft({ ...draft, title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await adminApi<{ id: number }>(id ? `/api/admin/posts/${id}` : "/api/admin/posts", { method: id ? "PUT" : "POST", body: draft });
      if (id) setSaved(true);
      else navigate(`/admin/blog/${res.id}`, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Link to="/admin/blog" className="mb-4 inline-flex items-center gap-2 text-sm text-tinta/60 hover:text-tinta"><ArrowLeft size={16} />Volver al blog</Link>
      <PageTitle title={id ? "Editar artículo" : "Nuevo artículo"} />
      <form onSubmit={save} className="space-y-4 rounded-2xl bg-white p-6">
        <Field label="Título"><TextInput required maxLength={160} value={draft.title} onChange={setTitle} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug (URL)" hint={`/blog/${draft.slug || "…"}`}>
            <TextInput required maxLength={80} value={draft.slug} onChange={(e) => { setSlugTouched(true); set("slug")(e); }} />
          </Field>
          <ImageUpload label="Portada" hint="Opcional. Vacío = fondo degradado." value={draft.cover_url} onChange={(url) => set("cover_url")({ target: { value: url } })} />
          <Field label="Etiqueta" hint="Ej. Tecnología, Negocios"><TextInput maxLength={30} value={draft.tag} onChange={set("tag")} /></Field>
          <Field label="Autor"><TextInput maxLength={60} value={draft.author} onChange={set("author")} /></Field>
        </div>
        <Field label="Resumen" hint="Se muestra en las tarjetas y en Google (máx. 300)"><TextArea rows={2} maxLength={300} value={draft.excerpt} onChange={set("excerpt")} /></Field>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Contenido</span>
            <div className="flex gap-1 rounded-lg bg-arena p-1 text-xs" role="group" aria-label="Modo">
              {[false, true].map((p) => (
                <button key={String(p)} type="button" aria-pressed={preview === p} onClick={() => setPreview(p)} className={cn("rounded-md px-3 py-1", preview === p ? "bg-white shadow-sm" : "text-tinta/60")}>{p ? "Vista previa" : "Editar"}</button>
              ))}
            </div>
          </div>
          {preview ? (
            <div className="min-h-[24rem] rounded-xl border border-tinta/15 px-5 py-2"><Markdown source={draft.content || "*Nada que mostrar todavía.*"} /></div>
          ) : (
            <TextArea rows={18} maxLength={50000} value={draft.content} onChange={set("content")} className="font-mono" aria-label="Contenido" />
          )}
          <p className="mt-1 text-xs text-tinta/50">Markdown: <code># Título</code>, <code>## Subtítulo</code>, <code>**negrita**</code>, <code>*cursiva*</code>, <code>- lista</code>, <code>[texto](https://…)</code>, <code>![alt](https://…)</code>, <code>&gt; cita</code>.</p>
        </div>
        <Check label="Publicado (visible en la web)" checked={draft.published} onChange={(e) => { setSaved(false); setDraft({ ...draft, published: e.target.checked }); }} />
        <ErrorBox message={error} />
        <div className="flex items-center gap-3">
          <button className="btn-primary" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button>
          {saved && <span role="status" className="text-sm text-paramo-puente">Guardado</span>}
        </div>
      </form>
    </>
  );
}
