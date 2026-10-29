import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Loader2, Monitor, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { kindLabel, wantUrl } from "@/lib/templates";
import type { Template } from "@/lib/types";
import { cn } from "@/lib/utils";

// Vista previa a pantalla completa de la demo en un iframe, con marco de escritorio o de celular.
export function TemplatePreview({ t, onClose }: { t: Template; onClose: () => void }) {
  const [device, setDevice] = useState<"desktop" | "mobile">(() =>
    t.kind === "app" || window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
  );
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const want = wantUrl(t);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const toggle = (on: boolean) => cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors", on ? "bg-papel text-tinta" : "text-papel/70 hover:text-papel");

  return (
    <motion.div
      role="dialog" aria-modal="true" aria-label={`Vista previa de ${t.name}`}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="dark-section fixed inset-0 z-[60] flex flex-col bg-tinta text-papel"
    >
      <Helmet><title>{`${t.name} · Plantillas | Pragmatis`}</title></Helmet>
      <div className="flex flex-wrap items-center gap-3 border-b border-papel/10 px-4 py-3">
        <button ref={closeRef} onClick={onClose} className="flex items-center gap-2 rounded-lg p-1.5 text-sm text-papel/80 hover:text-papel">
          <ArrowLeft size={18} /><span className="hidden sm:inline">Volver</span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold">{t.name}</p>
          <p className="truncate text-xs text-gris-oscuro">{kindLabel[t.kind]}{t.business && ` · ${t.business}`} · Demo con datos de ejemplo</p>
        </div>
        <div className="hidden rounded-xl bg-papel/10 p-1 md:flex" role="group" aria-label="Dispositivo">
          <button className={toggle(device === "desktop")} aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}><Monitor size={14} />Escritorio</button>
          <button className={toggle(device === "mobile")} aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}><Smartphone size={14} />Celular</button>
        </div>
        <a href={t.demo_url} target="_blank" rel="noopener noreferrer" className="p-2 text-papel/70 hover:text-papel" aria-label="Abrir la demo en una pestaña nueva" title="Abrir en pestaña nueva"><ExternalLink size={18} /></a>
        <a href={want} target={want.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" onClick={want.startsWith("http") ? undefined : onClose} className="btn-primary px-4 py-2">La quiero</a>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-grafito p-0 md:p-6">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-gris-oscuro">
            <Loader2 className="animate-spin text-paramo-luz" />
            Cargando la demo…
            <a href={t.demo_url} target="_blank" rel="noopener noreferrer" className="text-paramo-luz hover:underline">¿No carga? Ábrela en una pestaña nueva</a>
          </div>
        )}
        <div
          className={cn(
            "relative h-full w-full overflow-hidden bg-white transition-[max-width,max-height,border-radius] duration-300",
            device === "mobile" ? "md:max-h-[844px] md:max-w-[390px] md:rounded-[2.5rem] md:border-[10px] md:border-tinta md:shadow-2xl" : "md:rounded-xl md:shadow-2xl",
            !loaded && "opacity-0",
          )}
        >
          <iframe
            key={t.demo_url}
            src={t.demo_url}
            title={`Demo de ${t.name}`}
            onLoad={() => setLoaded(true)}
            className="h-full w-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </motion.div>
  );
}
