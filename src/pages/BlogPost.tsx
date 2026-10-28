import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/site";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { Markdown } from "@/lib/markdown";
import type { Post } from "@/lib/types";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<"notfound" | "failed" | null>(null);

  useEffect(() => {
    setPost(null);
    setError(null);
    api<Post>(`/api/posts/${encodeURIComponent(slug ?? "")}`)
      .then(setPost)
      .catch((e) => setError(e instanceof ApiError && e.status === 404 ? "notfound" : "failed"));
  }, [slug]);

  return (
    <>
      <Helmet>
        <title>{`${post ? post.title : "Blog"} | ${site.name}`}</title>
        {post?.excerpt && <meta name="description" content={post.excerpt} />}
        {post && <meta property="og:title" content={post.title} />}
        {post?.cover_url && <meta property="og:image" content={post.cover_url} />}
        {error === "notfound" && <meta name="robots" content="noindex" />}
      </Helmet>
      <Header />
      <main className="min-h-screen pb-16 pt-32 md:pb-28 md:pt-40">
        <article className="container max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal"><ArrowLeft size={16} />Todos los artículos</Link>
          {error && <p role="alert" className="mt-10 text-charcoal/60">{error === "notfound" ? "Este artículo no existe o ya no está disponible." : "No se pudo cargar el artículo."}</p>}
          {post && (
            <>
              <p className="mt-8 text-xs uppercase text-charcoal/50">{[post.tag, `${post.read_min} min de lectura`].filter(Boolean).join(" · ")}</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{post.title}</h1>
              <p className="mt-4 text-sm text-charcoal/50">{[formatDate(post.published_at), post.author].filter(Boolean).join(" · ")}</p>
              {post.cover_url && <img src={post.cover_url} alt="" className="mt-8 w-full rounded-3xl object-cover" />}
              <div className="mt-8 text-lg text-charcoal/80"><Markdown source={post.content} /></div>
            </>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
