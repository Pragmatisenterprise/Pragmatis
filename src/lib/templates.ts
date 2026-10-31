import {
  BadgeDollarSign, BarChart3, Boxes, CalendarCheck, CreditCard, FileText, Gift, ListOrdered, Puzzle, ShoppingBag, Star, Store, Ticket,
  type LucideIcon,
} from "lucide-react";
import { whatsappUrl } from "@/config/site";
import type { Template } from "./types";

export const kindLabel = { web: "Portal web", app: "App" };

// Icono por slug de módulo; los módulos nuevos sin icono propio usan Puzzle.
const moduleIcons: Record<string, LucideIcon> = {
  catalogo: Store, reservas: CalendarCheck, pedidos: ShoppingBag, caja: BadgeDollarSign, facturacion: FileText, inventario: Boxes,
  fidelizacion: Gift, membresias: Ticket, "fila-virtual": ListOrdered, pagos: CreditCard, reportes: BarChart3, resenas: Star,
};
export const moduleIcon = (slug: string) => moduleIcons[slug] ?? Puzzle;

// CTA "La quiero": WhatsApp con el nombre de la plantilla (y los módulos extra elegidos), o el formulario si aún no hay número.
export const wantUrl = (t: Template, extras: string[] = []) =>
  whatsappUrl(
    `¡Hola! Me interesa la plantilla ${t.name} de Pragmatis para mi negocio${extras.length ? `, con ${extras.join(", ").toLowerCase()}` : ""}.`,
  ) ?? "/#contacto";
