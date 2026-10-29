import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { site } from "@/config/site";
import { api } from "@/lib/api";
import type { PostSummary } from "@/lib/types";

export default function BlogIndex() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    api<PostSummary[]>("/api/posts").then(setPosts).catch(() => setFailed(true));
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Blog | ${site.name}`}</title>
        <meta name="description" content="Artículos sobre desarrollo de software, automatización y negocio digital." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-arena pb-16 pt-32 md:pb-28 md:pt-40">
        <div className="container">
          <p className="text-sm font-medium text-paramo">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Artículos para equipos y emprendedores</h1>
          {failed && <p role="alert" className="mt-12 text-tinta/60">No se pudieron cargar los artículos. Inténtalo de nuevo más tarde.</p>}
          {posts?.length === 0 && <p className="mt-12 text-tinta/60">Pronto publicaremos nuestros primeros artículos.</p>}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
