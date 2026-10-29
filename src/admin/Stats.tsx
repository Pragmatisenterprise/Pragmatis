import { useEffect, useState } from "react";
import type { Ranked, Stats as StatsData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { adminApi, errorMessage } from "./api";
import { ErrorBox, PageTitle } from "./ui";

const RANGES = [7, 30, 90];
const DEVICES: Record<string, string> = { desktop: "Escritorio", mobile: "Móvil", tablet: "Tablet" };
const regions = (() => {
  try { return new Intl.DisplayNames(["es"], { type: "region" }); } catch { return null; }
})();
const country = (code: string) => {
  try { return regions?.of(code) ?? code; } catch { return code; }
};

function Kpi({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-sm text-tinta/60">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums">{value.toLocaleString("es-CO")}</p>
      {hint && <p className="mt-1 text-xs text-tinta/40">{hint}</p>}
    </div>
  );
}

function Chart({ series }: { series: StatsData["series"] }) {
  const W = 800, H = 220, PAD = 4;
  const max = Math.max(1, ...series.map((d) => d.views));
  const bw = (W - PAD * 2) / series.length;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Visitas por día">
        {series.map((d, i) => {
          const h = (d.views / max) * (H - 20);
          return (
            <rect key={d.day} x={PAD + i * bw + bw * 0.12} y={H - h} width={bw * 0.76} height={Math.max(h, d.views ? 2 : 0)} rx={2} className="fill-paramo">
              <title>{`${d.day}: ${d.views} visitas, ${d.visitors} visitantes`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-tinta/50">
        <span>{series[0].day}</span><span>máx. {max}/día</span><span>{series[series.length - 1].day}</span>
      </div>
    </div>
  );
}

function Ranking({ title, rows, label = (s) => s }: { title: string; rows: Ranked[]; label?: (s: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  return (
    <section className="rounded-2xl bg-white p-5">
      <h2 className="font-medium">{title}</h2>
      {rows.length === 0 ? <p className="mt-4 text-sm text-tinta/40">Sin datos todavía</p> : (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.label} className="text-sm">
              <div className="flex justify-between gap-3"><span className="truncate">{label(r.label)}</span><span className="tabular-nums text-tinta/60">{r.views}</span></div>
              <div className="mt-1 h-1.5 rounded bg-arena"><div className="h-full rounded bg-paramo" style={{ width: `${(r.views / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Stats() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    adminApi<StatsData>(`/api/admin/stats?days=${days}`).then(setData).catch((e) => setError(errorMessage(e)));
  }, [days]);

  return (
    <>
      <PageTitle title="Estadísticas">
        <div className="flex gap-1 rounded-xl bg-white p-1" role="group" aria-label="Rango">
          {RANGES.map((r) => (
            <button key={r} onClick={() => setDays(r)} aria-pressed={r === days} className={cn("rounded-lg px-3 py-1.5 text-sm", r === days ? "bg-grafito text-white" : "text-tinta/60 hover:text-tinta")}>{r} días</button>
          ))}
        </div>
      </PageTitle>
      <ErrorBox message={error} />
      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi label="Visitas" value={data.totals.views} />
            <Kpi label="Visitantes" value={data.totals.visitors} hint="únicos por día, sumados" />
            <Kpi label="Mensajes de contacto" value={data.totals.contacts} />
            <Kpi label="Suscriptores nuevos" value={data.totals.subscribers} />
          </div>
          <section className="rounded-2xl bg-white p-5">
            <h2 className="mb-4 font-medium">Visitas por día</h2>
            <Chart series={data.series} />
          </section>
          <div className="grid gap-4 md:grid-cols-2">
            <Ranking title="Páginas más vistas" rows={data.pages} />
            <Ranking title="Origen del tráfico" rows={data.referrers} />
            <Ranking title="Países" rows={data.countries} label={country} />
            <Ranking title="Dispositivos" rows={data.devices} label={(s) => DEVICES[s] ?? s} />
          </div>
          <p className="text-sm text-tinta/50">
            Contenido publicado: {data.content.projects} proyectos · {data.content.posts} artículos. Datos sin cookies, día en hora de Colombia.
          </p>
        </div>
      )}
    </>
  );
}
