import { escapeHtml, isEmail, json, readJson, type Env } from "./utils";

export async function contact(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return json({ error: "Solicitud inválida" }, 400);

  // Campo trampa: los bots lo rellenan, las personas no lo ven.
  if (body.website) return json({ ok: true });

  const name = String(body.name ?? "").trim();
  const message = String(body.message ?? "").trim();
  if (name.length < 2 || name.length > 100) return json({ error: "Nombre inválido" }, 400);
  if (!isEmail(body.email)) return json({ error: "Correo inválido" }, 400);
  if (message.length < 10 || message.length > 4000) return json({ error: "Mensaje inválido" }, 400);

  const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = env;
  if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) return json({ error: "Servicio no configurado" }, 500);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      reply_to: body.email,
      subject: `Nuevo contacto web: ${name}`,
      html: `<p><b>${escapeHtml(name)}</b> &lt;${escapeHtml(body.email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
  if (!res.ok) return json({ error: "No se pudo enviar el mensaje" }, 502);
  return json({ ok: true });
}
