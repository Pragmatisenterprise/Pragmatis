import { whatsappUrl } from "@/config/site";
import type { Template } from "./types";

export const kindLabel = { web: "Portal web", app: "App" };

// CTA "La quiero": WhatsApp con el nombre de la plantilla, o el formulario si aún no hay número.
export const wantUrl = (t: Template) =>
  whatsappUrl(`¡Hola! Me interesa la plantilla ${t.name} de Pragmatis para mi negocio.`) ?? "/#contacto";
