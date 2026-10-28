import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/format";
import type { PostSummary } from "@/lib/types";
import { adminApi, errorMessage } from "./api";
import { Badge, ErrorBox, PageTitle } from "./ui";

export function Posts() {
  const [items, setItems] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminApi<PostSummary[]>("/api/admin/posts").then(setItems).catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(load, [load]);

  const remove = async (p: PostSummary) => {
    if (!window.confirm(`¿Eliminar el artículo "${p.title}"? No se puede deshacer.`)) return;
    try {
      await adminApi(`/api/admin/posts/${p.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <PageTitle title="Blog">
        <Link to="/admin/blog/nuevo" className="btn-dark"><Plus size={16} />Nuevo artículo</Link>
      </PageTitle>
      <div className="space-y-4">
        <ErrorBox message={error} />
        {items?.length === 0 && <p className="rounded-2xl bg-white p-6 text-sm text-charcoal/60">Aún no hay artículos.</p>}
        <ul className="space-y-2">
          {items?.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-4">
              <div className="min-w-0 flex-1">
                <Link to={`/admin/blog/${p.id}`} className="block truncate font-medium hover:text-violet">{p.title}</Link>
                <p className="truncate text-sm text-charcoal/50">/blog/{p.slug}{p.published_at ? ` · ${formatDate(p.published_at)}` : ""}</p>
              </div>
              <Badge on={!!p.published} yes="Publicado" no="Borrador" />
              {!!p.published && <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-charcoal/50 hover:text-charcoal" aria-label={`Ver ${p.title}`}><ExternalLink size={16} /></a>}
              <Link to={`/admin/blog/${p.id}`} className="p-2 text-charcoal/50 hover:text-charcoal" aria-label={`Editar ${p.title}`}><Pencil size={16} /></Link>
              <button className="p-2 text-charcoal/50 hover:text-red-600" onClick={() => remove(p)} aria-label={`Eliminar ${p.title}`}><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
