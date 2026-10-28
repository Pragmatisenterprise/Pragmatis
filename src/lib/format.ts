// Las fechas de D1 vienen como "YYYY-MM-DD HH:MM:SS" en UTC.
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value.replace(" ", "T") + "Z");
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
