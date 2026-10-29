import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/format";
import type { PostSummary } from "@/lib/types";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full rounded-3xl bg-white p-3">
      <article className="h-full">
        {post.cover_url ? (
          <img src={post.cover_url} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        ) : (
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-paramo-suave via-papel to-maiz-suave" />
        )}
        <div className="p-4">
          <p className="text-xs uppercase text-tinta/50">{[post.tag, `${post.read_min} min de lectura`].filter(Boolean).join(" · ")}</p>
          <h3 className="mt-3 flex items-start justify-between gap-3 text-lg font-semibold leading-snug">
            {post.title}<ArrowUpRight className="mt-1 shrink-0 text-tinta/30 transition-colors group-hover:text-paramo" size={18} />
          </h3>
          {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-tinta/60">{post.excerpt}</p>}
          <p className="mt-4 text-xs text-tinta/50">{[formatDate(post.published_at), post.author].filter(Boolean).join(" · ")}</p>
        </div>
      </article>
    </Link>
  );
}
