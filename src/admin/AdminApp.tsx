import { BarChart3, ExternalLink, FolderKanban, LayoutTemplate, LogOut, MessageSquareQuote, Newspaper } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink, Route, Routes } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Login } from "./Login";
import { PostEditor } from "./PostEditor";
import { Posts } from "./Posts";
import { Projects } from "./Projects";
import { Stats } from "./Stats";
import { Templates } from "./Templates";
import { Testimonials } from "./Testimonials";

const sections = [
  { to: "/admin", label: "Estadísticas", icon: BarChart3, end: true },
  { to: "/admin/plantillas", label: "Plantillas", icon: LayoutTemplate },
  { to: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
  { to: "/admin/testimonios", label: "Testimonios", icon: MessageSquareQuote },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
];

export default function AdminApp() {
  const [auth, setAuth] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    api("/api/admin/me").then(() => setAuth("in")).catch(() => setAuth("out"));
    const expire = () => setAuth("out");
    window.addEventListener("admin:unauthorized", expire);
    return () => window.removeEventListener("admin:unauthorized", expire);
  }, []);

  const logout = useCallback(async () => {
    await api("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAuth("out");
  }, []);

  return (
    <>
      <Helmet><title>Admin | Pragmatis</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      {auth === "loading" ? null : auth === "out" ? (
        <Login onLogin={() => setAuth("in")} />
      ) : (
        <div className="min-h-screen bg-arena md:grid md:grid-cols-[240px_1fr]">
          <aside className="bg-tinta text-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:p-5">
            <div className="flex items-center justify-between px-4 py-3 md:px-2 md:py-0">
              <Logo />
              <button onClick={logout} className="p-2 text-white/60 hover:text-white md:hidden" aria-label="Cerrar sesión"><LogOut size={18} /></button>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:mt-8 md:flex-col md:overflow-visible md:p-0" aria-label="Secciones">
              {sections.map((s) => (
                <NavLink
                  key={s.to} to={s.to} end={s.end}
                  className={({ isActive }) => cn("flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white")}
                ><s.icon size={18} />{s.label}</NavLink>
              ))}
            </nav>
            <div className="mt-auto hidden space-y-1 md:block">
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white"><ExternalLink size={18} />Ver sitio</a>
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white"><LogOut size={18} />Cerrar sesión</button>
            </div>
          </aside>
          <main className="min-w-0 p-5 md:p-10">
            <Routes>
              <Route index element={<Stats />} />
              <Route path="plantillas" element={<Templates />} />
              <Route path="proyectos" element={<Projects />} />
              <Route path="testimonios" element={<Testimonials />} />
              <Route path="blog" element={<Posts />} />
              <Route path="blog/nuevo" element={<PostEditor />} />
              <Route path="blog/:id" element={<PostEditor />} />
              <Route path="*" element={<p className="text-tinta/60">Sección no encontrada.</p>} />
            </Routes>
          </main>
        </div>
      )}
    </>
  );
}
