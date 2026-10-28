import { json, readJson, sha256Hex, today, type Handler } from "./utils";

const BOT = /bot|crawl|spider|slurp|headless|preview|monitor|lighthouse/i;
const PATH = /^\/[\w\-./%]{0,199}$/;

export const track: Handler = async (request, env) => {
  const ua = request.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return new Response(null, { status: 204 });

  const body = await readJson(request);
  const path = typeof body?.path === "string" ? body.path.split(/[?#]/)[0] : "";
  if (!PATH.test(path) || path.startsWith("/admin")) return new Response(null, { status: 204 });

  let referrer = "";
  try {
    const host = new URL(String(body?.referrer ?? "")).host.replace(/^www\./, "");
    if (host !== new URL(request.url).host.replace(/^www\./, "")) referrer = host.slice(0, 100);
  } catch {
    // sin referrer válido: tráfico directo
  }

  const day = today();
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const visitor = (await sha256Hex(`${day}|${ip}|${ua}|${env.SESSION_SECRET ?? ""}`)).slice(0, 16);
  const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";

  await env.DB.prepare("INSERT INTO pageviews (day, path, referrer, country, device, visitor) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(day, path, referrer, request.cf?.country ?? "", device, visitor).run();
  return new Response(null, { status: 204 });
};

export const stats: Handler = async (request, env) => {
  const requested = Number(new URL(request.url).searchParams.get("days"));
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  const since = today(days - 1);

  const top = (col: string, empty: string) =>
    env.DB.prepare(
      `SELECT CASE WHEN ${col} = '' THEN ? ELSE ${col} END AS label, COUNT(*) AS views
       FROM pageviews WHERE day >= ? GROUP BY label ORDER BY views DESC LIMIT 10`,
    ).bind(empty, since);

  const [daily, pages, referrers, countries, devices, events, content] = await env.DB.batch<Record<string, unknown>>([
    env.DB.prepare("SELECT day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors FROM pageviews WHERE day >= ? GROUP BY day").bind(since),
    top("path", "/"),
    top("referrer", "Directo"),
    top("country", "Desconocido"),
    top("device", "Desconocido"),
    env.DB.prepare("SELECT type, COUNT(*) AS total FROM events WHERE day >= ? GROUP BY type").bind(since),
    env.DB.prepare(
      "SELECT (SELECT COUNT(*) FROM projects WHERE published = 1) AS projects, (SELECT COUNT(*) FROM posts WHERE published = 1) AS posts",
    ),
  ]);

  // Rellena los días sin visitas para que la gráfica sea continua.
  const byDay = new Map((daily.results as { day: string; views: number; visitors: number }[]).map((r) => [r.day, r]));
  const series = Array.from({ length: days }, (_, i) => {
    const day = today(days - 1 - i);
    return { day, views: byDay.get(day)?.views ?? 0, visitors: byDay.get(day)?.visitors ?? 0 };
  });
  const eventTotals = Object.fromEntries((events.results as { type: string; total: number }[]).map((r) => [r.type, r.total]));

  return json({
    days,
    series,
    totals: {
      views: series.reduce((n, d) => n + d.views, 0),
      visitors: series.reduce((n, d) => n + d.visitors, 0), // únicos por día, sumados
      contacts: eventTotals.contact ?? 0,
      subscribers: eventTotals.subscribe ?? 0,
    },
    pages: pages.results,
    referrers: referrers.results,
    countries: countries.results,
    devices: devices.results,
    content: content.results[0],
  });
};
