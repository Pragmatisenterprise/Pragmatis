export const site = {
  name: "Pragmatis",
  email: "contacto@pragmatis.com.co",
  url: "https://pragmatis.com.co",
  // TODO: dirección o ciudad real. Vacía = no se muestra.
  address: "",
  tagline: "Software que trabaja por tu negocio",
  audience: "Hecho en Colombia",
  // TODO: número con indicativo y sin signos (ej. "573001234567"). Vacío = se ocultan los botones de WhatsApp.
  whatsapp: "",
  // TODO: usuario sin @ (ej. "pragmatis.co"). Vacío = no se muestra.
  instagram: "",
};

export const nav = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Plantillas", href: "/#plantillas" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/#contacto" },
];

export const whatsappUrl = (message: string) =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}` : null;

export const instagramUrl = site.instagram ? `https://instagram.com/${site.instagram}` : null;

// Lo que trae cualquier plantilla con el pago único.
export const templateIncludes = [
  { title: "Tu marca, al 100 %", text: "Logo, colores, textos, fotos y catálogo de tu negocio. Si necesitas cambiar algo de la plantilla, lo cambiamos." },
  { title: "Dominio y hosting el primer año", text: "Nos encargamos de publicarla en tu propio dominio y de que esté en línea." },
  { title: "Capacitación", text: "Te enseñamos a usar tu panel para que actualices precios, productos y horarios sin depender de nadie." },
  { title: "Soporte después de la entrega", text: "Te acompañamos con dudas y ajustes cuando ya estés vendiendo." },
];
