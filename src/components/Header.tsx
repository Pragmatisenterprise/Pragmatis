import { Menu, X } from "lucide-react";
import { useState } from "react";
import { nav } from "@/config/site";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 text-white backdrop-blur">
      <div className="container flex h-[72px] items-center justify-between">
        <a href="#" aria-label="Inicio"><Logo /></a>
        <nav className="hidden gap-8 text-sm md:flex" aria-label="Principal">
          {nav.map((i) => (
            <a key={i.href} href={i.href} className="text-white/80 transition-colors hover:text-white">{i.label}</a>
          ))}
        </nav>
        <a href="#contacto" className="btn-dark hidden bg-white/10 md:inline-flex">Empezar</a>
        <button className="-mr-2 p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menú" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="container flex flex-col gap-4 pb-6 md:hidden" aria-label="Móvil">
          {nav.map((i) => (
            <a key={i.href} href={i.href} onClick={() => setOpen(false)} className="text-white/80">{i.label}</a>
          ))}
          <a href="#contacto" className="btn-primary" onClick={() => setOpen(false)}>Empezar</a>
        </nav>
      )}
    </header>
  );
}
