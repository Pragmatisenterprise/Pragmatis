import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { AppWindow, ArrowRight, Check, ChevronLeft, ChevronRight, Globe, Play, Plus, Smartphone } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { carePlan, renewalYearly, templateIncludes } from "@/config/site";
import { api } from "@/lib/api";
import { formatCop } from "@/lib/format";
import { kindLabel, moduleIcon, wantUrl } from "@/lib/templates";
import type { Template } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LogoSymbol } from "./Logo";
import { Reveal } from "./Reveal";
import { TemplatePreview } from "./TemplatePreview";

const kinds = [
  { id: "all", label: "Todas" },
  { id: "web", label: "Portales web" },
  { id: "app", label: "Apps" },
] as const;

type Kind = (typeof kinds)[number]["id"];

// Distancia circular de `i` a `active`: con 6 tarjetas, la 5 está a -1 de la 0, no a +5.
function offsetOf(i: number, active: number, n: number) {
  let d = (i - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function Thumb({ t, className }: { t: Template; className?: string }) {
  return t.thumb_url ? (
    <img src={t.thumb_url} alt="" loading="lazy" draggable={false} className={cn("w-full object-cover", className)} />
  ) : (
    <div className={cn("flex w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-paramo via-paramo-puente/60 to-grafito", className)}>
      <LogoSymbol className="h-10 w-auto" />
      <span className="font-display text-lg font-semibold text-papel">{t.business || t.name}</span>
    </div>
  );
}

function Carousel({ items, active, setActive, onOpen }: { items: Template[]; active: number; setActive: (i: number) => void; onOpen: (t: Template) => void }) {
  const n = items.length;
  const [paused, setPaused] = useState(false);
  // Un arrastre termina con un click sobre la tarjeta: este flag evita que ese click la abra.
  const panned = useRef(false);
  const go = (dir: number) => setActive((active + dir + n) % n);

  // Gira solo cada 5 s mientras nadie lo esté usando.
  useEffect(() => {
    if (paused || n < 2) return;
    const id = setInterval(() => setActive((active + 1) % n), 5000);
    return () => clearInterval(id);
  }, [paused, active, n, setActive]);

  const onPanEnd = (_e: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 40) go(info.offset.x < 0 ? 1 : -1);
    setTimeout(() => (panned.current = false));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  return (
    <div
      role="region" aria-roledescription="carrusel" aria-label="Plantillas" tabIndex={0} onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="relative mx-auto max-w-5xl rounded-3xl"
    >
      <motion.div onPanStart={() => { panned.current = true; setPaused(true); }} onPanEnd={onPanEnd} style={{ touchAction: "pan-y" }} className="relative h-[300px] select-none [perspective:1400px] md:h-[360px]">
        {items.map((t, i) => {
          const o = n === 1 ? 0 : offsetOf(i, active, n);
          const abs = Math.abs(o);
          const visible = abs <= 2;
          return (
            <motion.button
              key={t.id}
              type="button"
              tabIndex={o === 0 ? 0 : -1}
              aria-hidden={o !== 0}
              aria-label={o === 0 ? `Ver la plantilla ${t.name}` : undefined}
              onClick={() => {
                if (panned.current) return;
                if (o === 0) onOpen(t);
                else setActive(i);
              }}
              initial={false}
              animate={{
                x: `${o * 62}%`,
                rotateY: o * -32,
                scale: 1 - abs * 0.14,
                opacity: visible ? 1 - abs * 0.3 : 0,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ zIndex: 10 - abs, pointerEvents: visible ? "auto" : "none" }}
              className={cn(
                "absolute left-1/2 top-0 -ml-[115px] w-[230px] overflow-hidden md:-ml-[150px] rounded-3xl border bg-grafito text-left shadow-2xl md:w-[300px]",
                o === 0 ? "border-paramo-luz/50 shadow-[0_0_60px_rgba(108,193,154,.25)]" : "border-papel/10",
              )}
            >
              <Thumb t={t} className="pointer-events-none aspect-[4/3]" />
              <div className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <p className="truncate text-xs text-paramo-luz">{t.business}</p>
                  <p className="truncate font-display font-semibold text-papel">{t.name}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-papel/10 px-2 py-0.5 text-[11px] text-papel/80">
                  {t.kind === "app" ? <Smartphone size={12} /> : <Globe size={12} />}{kindLabel[t.kind]}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
      {n > 1 && (
        <div className="mt-2 flex items-center justify-center gap-4">
          <button type="button" onClick={() => go(-1)} className="rounded-full border border-papel/15 p-2.5 text-papel/80 transition-colors hover:border-paramo-luz hover:text-papel" aria-label="Plantilla anterior"><ChevronLeft size={18} /></button>
          <div className="flex gap-1.5" aria-hidden>
            {items.map((t, i) => <span key={t.id} className={cn("h-1.5 rounded-full transition-all", i === active ? "w-6 bg-maiz" : "w-1.5 bg-papel/25")} />)}
          </div>
          <button type="button" onClick={() => go(1)} className="rounded-full border border-papel/15 p-2.5 text-papel/80 transition-colors hover:border-paramo-luz hover:text-papel" aria-label="Plantilla siguiente"><ChevronRight size={18} /></button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">{items[active] && `${items[active].name}, ${active + 1} de ${n}`}</p>
    </div>
  );
}

// Con movimiento reducido: lista horizontal con scroll, sin giros.
function StaticList({ items, active, setActive }: { items: Template[]; active: number; setActive: (i: number) => void }) {
  return (
    <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4" aria-label="Plantillas">
      {items.map((t, i) => (
        <li key={t.id} className="w-[240px] shrink-0 snap-start">
          <button
            type="button" onClick={() => setActive(i)} aria-pressed={i === active}
            className={cn("w-full overflow-hidden rounded-3xl border bg-grafito text-left", i === active ? "border-paramo-luz/60" : "border-papel/10")}
          >
            <Thumb t={t} className="aspect-[4/3]" />
            <div className="p-4">
              <p className="text-xs text-paramo-luz">{t.business}</p>
              <p className="font-display font-semibold text-papel">{t.name}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Details({ t, onOpen }: { t: Template; onOpen: (t: Template) => void }) {
  // Módulos adicionales que el visitante marca; viajan en el mensaje de WhatsApp.
  const [extras, setExtras] = useState<string[]>([]);
  const included = t.modules.filter((m) => m.included);
  const addons = t.modules.filter((m) => !m.included);
  const want = wantUrl(t, t.modules.filter((m) => extras.includes(m.slug)).map((m) => m.name));
  const toggle = (slug: string) => setExtras((xs) => (xs.includes(slug) ? xs.filter((x) => x !== slug) : [...xs, slug]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
      className="mx-auto mt-10 grid max-w-4xl gap-8 rounded-3xl border border-papel/10 bg-grafito/60 p-6 md:grid-cols-[1.3fr_1fr] md:p-8"
    >
      <div>
        <p className="flex items-center gap-2 text-sm text-paramo-luz">
          {t.kind === "app" ? <AppWindow size={16} /> : <Globe size={16} />}
          {kindLabel[t.kind]}{t.business && ` · ${t.business}`}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-papel">{t.name}</h3>
        {t.summary && <p className="mt-3 text-gris-oscuro">{t.summary}</p>}
        {t.kind === "app" && <p className="mt-3 text-sm text-gris-oscuro">Se instala en el celular desde el navegador, sin pasar por tiendas de apps.</p>}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {t.demo_url && <button type="button" onClick={() => onOpen(t)} className="btn-primary"><Play size={16} />Ver demo en vivo</button>}
          <a href={want} target={want.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="btn border border-papel/15 text-papel hover:border-paramo-luz">
            La quiero para mi negocio <ArrowRight size={16} />
          </a>
        </div>
        {included.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-medium text-papel">Incluye</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {included.map((m) => {
                const Icon = moduleIcon(m.slug);
                return <li key={m.id} title={m.summary} className="flex items-center gap-1.5 rounded-full bg-paramo/25 px-3 py-1 text-xs text-papel"><Icon size={14} className="text-paramo-luz" />{m.name}</li>;
              })}
            </ul>
          </div>
        )}
        {addons.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-papel">Puedes agregar</p>
            <p className="text-xs text-gris-oscuro">Marca los que te interesan y te los cotizamos juntos.</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {addons.map((m) => {
                const Icon = moduleIcon(m.slug);
                const on = extras.includes(m.slug);
                return (
                  <li key={m.id}>
                    <button
                      type="button" aria-pressed={on} onClick={() => toggle(m.slug)}
                      className={cn("flex h-full w-full gap-3 rounded-2xl border p-3 text-left transition-colors", on ? "border-paramo-luz bg-paramo/15" : "border-papel/10 hover:border-papel/30")}
                    >
                      <Icon size={18} className="mt-0.5 shrink-0 text-paramo-luz" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-papel">{m.name}</span>
                        {m.summary && <span className="block text-xs text-gris-oscuro">{m.summary}</span>}
                        {m.price > 0 && <span className="mt-1 block font-mono text-xs text-maiz">+ {formatCop(m.price)}</span>}
                      </span>
                      {on ? <Check size={16} className="shrink-0 text-paramo-luz" /> : <Plus size={16} className="shrink-0 text-papel/50" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div>
        {t.price_from > 0 && (
          <p className="text-sm text-gris-oscuro">Desde <span className="block font-mono text-3xl text-maiz">{formatCop(t.price_from)}</span><span className="text-xs">Pago único · COP</span></p>
        )}
        {t.features.length > 0 && (
          <ul className={cn("space-y-2 text-sm text-papel/85", t.price_from > 0 && "mt-6")}>
            {t.features.map((f) => <li key={f} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-paramo-luz" />{f}</li>)}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export function Templates() {
  const [items, setItems] = useState<Template[] | null>(null);
  const [kind, setKind] = useState<Kind>("all");
  const [business, setBusiness] = useState("");
  const [active, setActive] = useState(0);
  const [openedHere, setOpenedHere] = useState(false);
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const match = useMatch("/plantillas/:slug");

  useEffect(() => {
    api<Template[]>("/api/templates").then(setItems).catch(() => setItems([]));
  }, []);

  const businesses = useMemo(() => [...new Set((items ?? []).map((t) => t.business).filter(Boolean))].sort(), [items]);
  const shown = useMemo(
    () => (items ?? []).filter((t) => (kind === "all" || t.kind === kind) && (!business || t.business === business)),
    [items, kind, business],
  );
  useEffect(() => setActive(0), [kind, business]);

  const previewing = match && items?.find((t) => t.slug === match.params.slug && t.demo_url);

  const open = (t: Template) => {
    setOpenedHere(true);
    navigate(`/plantillas/${t.slug}`);
  };
  const close = () => {
    if (openedHere) navigate(-1);
    else {
      navigate("/#plantillas", { replace: true });
      document.getElementById("plantillas")?.scrollIntoView();
    }
    setOpenedHere(false);
  };

  // Al llegar directo a /plantillas/:slug sin demo (o con un slug que ya no existe) se vuelve a la sección.
  useEffect(() => {
    if (match && items && !previewing) navigate("/#plantillas", { replace: true });
  }, [match, items, previewing, navigate]);

  const chip = (on: boolean) =>
    cn("rounded-full px-4 py-1.5 text-sm transition-colors", on ? "bg-papel font-medium text-tinta" : "border border-papel/15 text-papel/75 hover:text-papel");

  return (
    <section id="plantillas" className="dark-section overflow-hidden bg-tinta py-16 text-papel md:py-28">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-paramo-luz">Plantillas</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Tu negocio en línea, con tu marca.</h2>
          <p className="mt-4 text-gris-oscuro">
            Portales web y apps ya probadas para negocios como el tuyo. Elige una, mírala funcionando y la adaptamos a tu marca: logo, colores, productos y todo lo que necesites cambiar.
          </p>
        </Reveal>

        {items === null ? (
          <div className="mx-auto mt-12 h-[300px] max-w-[300px] animate-pulse rounded-3xl bg-grafito md:h-[360px]" aria-hidden />
        ) : items.length === 0 ? (
          <Reveal className="mx-auto mt-12 max-w-xl rounded-3xl border border-papel/10 bg-grafito/60 p-8 text-center">
            <p className="text-papel">Estamos actualizando el catálogo.</p>
            <p className="mt-2 text-sm text-gris-oscuro">Escríbenos y te mostramos las plantillas disponibles para tu tipo de negocio.</p>
            <a href="#contacto" className="btn-primary mt-6">Quiero verlas</a>
          </Reveal>
        ) : (
          <>
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Tipo">
                {kinds.map((k) => <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)} className={chip(kind === k.id)}>{k.label}</button>)}
              </div>
              {businesses.length > 1 && (
                <div className="flex max-w-full flex-wrap justify-center gap-2" role="group" aria-label="Tipo de negocio">
                  <button type="button" aria-pressed={!business} onClick={() => setBusiness("")} className={cn(chip(!business), "px-3 py-1 text-xs")}>Todos los negocios</button>
                  {businesses.map((b) => <button key={b} type="button" aria-pressed={business === b} onClick={() => setBusiness(b)} className={cn(chip(business === b), "px-3 py-1 text-xs")}>{b}</button>)}
                </div>
              )}
            </div>

            {shown.length === 0 ? (
              <p className="mt-12 text-center text-gris-oscuro">No hay plantillas con ese filtro todavía. <a href="#contacto" className="text-paramo-luz hover:underline">Cuéntanos qué necesitas</a>.</p>
            ) : (
              <div className="mt-10 md:mt-14">
                {reduced
                  ? <StaticList items={shown} active={active} setActive={setActive} />
                  : <Carousel items={shown} active={active} setActive={setActive} onOpen={(t) => (t.demo_url ? open(t) : undefined)} />}
                <AnimatePresence mode="wait">{shown[active] && <Details key={shown[active].id} t={shown[active]} onOpen={open} />}</AnimatePresence>
              </div>
            )}
          </>
        )}

        <div className="mt-16 md:mt-24">
          <Reveal><h3 className="text-center text-xl font-semibold">Todas incluyen, con un solo pago</h3></Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {templateIncludes.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.06}>
                <span className="font-mono text-sm text-maiz">0{i + 1}</span>
                <h4 className="mt-2 font-medium">{it.title}</h4>
                <p className="mt-1 text-sm text-gris-oscuro">{it.text}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mx-auto mt-16 grid max-w-4xl gap-8 rounded-3xl border border-maiz/30 bg-grafito/60 p-6 md:mt-20 md:grid-cols-[1fr_1.3fr] md:p-8">
          <div>
            <p className="text-sm font-medium text-maiz">Opcional</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{carePlan.name}</h3>
            <p className="mt-3 text-sm text-gris-oscuro">Para que no tengas que pensar en tu plataforma: nosotros la cuidamos y la seguimos mejorando cada mes.</p>
            {carePlan.priceMonthly > 0 && (
              <p className="mt-6 text-sm text-gris-oscuro"><span className="block font-mono text-3xl text-maiz">{formatCop(carePlan.priceMonthly)}</span><span className="text-xs">Al mes · COP</span></p>
            )}
          </div>
          <div>
            <ul className="space-y-2.5 text-sm text-papel/85">
              {carePlan.includes.map((it) => (
                <li key={it} className="flex gap-2.5"><Check size={18} className="shrink-0 text-paramo-luz" />{it}</li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-gris-oscuro">
              Soporte es cuando algo falla; un cambio es algo nuevo que nos pides. Sin el plan, desde el segundo año el hosting y el dominio se renuevan cada año
              {renewalYearly > 0 && <> por <span className="font-mono text-papel/80">{formatCop(renewalYearly)}</span></>}.
            </p>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>{previewing && <TemplatePreview t={previewing} onClose={close} />}</AnimatePresence>
    </section>
  );
}
