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
  { title: "Garantía de 4 meses", text: "Si algo falla en los primeros 4 meses, lo corregimos sin costo." },
];

// Plan mensual opcional. Soporte = algo falla; cambio = algo nuevo que pides.
// TODO: valores reales. 0 = no se muestra ese dato.
const changesPerMonth = 0;
export const carePlan = {
  name: "Plan de acompañamiento",
  priceMonthly: 0,
  includes: [
    "Soporte por WhatsApp cuando algo falle, sin importar la fecha",
    `${changesPerMonth > 0 ? `Hasta ${changesPerMonth} cambios` : "Cambios"} al mes: textos, secciones y ajustes que nos pidas`,
    "Copias de seguridad de tu información",
    "Actualizaciones y mejoras de la plataforma",
    "Hosting y dominio sin renovación aparte",
  ],
};

// Sin plan, desde el segundo año el hosting y el dominio se renuevan cada año. TODO: valor real; 0 = no se muestra.
export const renewalYearly = 0;
