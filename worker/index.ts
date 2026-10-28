import { admin, login, logout, me } from "./auth";
import { contact } from "./contact";
import * as posts from "./posts";
import * as projects from "./projects";
import { stats, track } from "./stats";
import { subscribe } from "./subscribe";
import { json, type Env, type Handler } from "./utils";

type Route = [method: string, path: string, handler: Handler];

const routes: Route[] = [
  ["POST", "/api/contact", contact],
  ["POST", "/api/subscribe", subscribe],
  ["POST", "/api/track", track],
  ["GET", "/api/projects", projects.listPublic],
  ["GET", "/api/posts", posts.listPublic],
  ["GET", "/api/posts/:slug", posts.getPublic],

  ["POST", "/api/admin/login", login],
  ["POST", "/api/admin/logout", logout],
  ["GET", "/api/admin/me", me],
  ["GET", "/api/admin/stats", admin(stats)],
  ["GET", "/api/admin/projects", admin(projects.listAdmin)],
  ["POST", "/api/admin/projects", admin(projects.create)],
  ["POST", "/api/admin/projects/reorder", admin(projects.reorder)],
  ["PUT", "/api/admin/projects/:id", admin(projects.update)],
  ["DELETE", "/api/admin/projects/:id", admin(projects.remove)],
  ["GET", "/api/admin/posts", admin(posts.listAdmin)],
  ["GET", "/api/admin/posts/:id", admin(posts.getAdmin)],
  ["POST", "/api/admin/posts", admin(posts.create)],
  ["PUT", "/api/admin/posts/:id", admin(posts.update)],
  ["DELETE", "/api/admin/posts/:id", admin(posts.remove)],
];

function match(pattern: string, pathname: string): Record<string, string> | null {
  const a = pattern.split("/");
  const b = pathname.split("/");
  if (a.length !== b.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    let pathMatched = false;
    for (const [method, pattern, handler] of routes) {
      const params = match(pattern, pathname);
      if (!params) continue;
      if (method !== request.method) {
        pathMatched = true;
        continue;
      }
      try {
        return await handler(request, env, params);
      } catch (e) {
        console.error(e);
        return json({ error: "Error interno" }, 500);
      }
    }
    return pathMatched ? json({ error: "Método no permitido" }, 405) : json({ error: "No encontrado" }, 404);
  },
} satisfies ExportedHandler<Env>;
