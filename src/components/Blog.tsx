import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { PostSummary } from "@/lib/types";
import { PostCard } from "./PostCard";
import { Reveal } from "./Reveal";

export function Blog() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  useEffect(() => {
    api<PostSummary[]>("/api/posts?limit=3").then(setPosts).catch(() => {});
  }, []);
  if (!posts.length) return null;

  return (
    <section id="blog" className="bg-arena py-16 md:py-28">
      <div className="container">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-paramo">Blog</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Artículos para equipos y emprendedores</h2>
          </div>
          <Link to="/blog" className="btn-dark">Ver todos</Link>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {posts.map((p, i) => <Reveal key={p.id} delay={i * 0.08}><PostCard post={p} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}
