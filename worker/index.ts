import { contact } from "./contact";
import { subscribe } from "./subscribe";
import { json, type Env } from "./utils";

const routes: Record<string, (request: Request, env: Env) => Promise<Response>> = {
  "/api/contact": contact,
  "/api/subscribe": subscribe,
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const handler = routes[pathname];
    if (handler) {
      if (request.method !== "POST") return json({ error: "Método no permitido" }, 405);
      return handler(request, env);
    }
    if (pathname.startsWith("/api/")) return json({ error: "No encontrado" }, 404);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
