import { api, ApiError } from "@/lib/api";

// Igual que `api`, pero avisa al panel si la sesión expiró para volver al login.
export async function adminApi<T = unknown>(path: string, opts?: { method?: string; body?: unknown }): Promise<T> {
  try {
    return await api<T>(path, opts);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) window.dispatchEvent(new Event("admin:unauthorized"));
    throw e;
  }
}

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Algo salió mal");

// Sube una imagen a R2 y devuelve su URL pública (/media/…).
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => null);
  if (res.status === 401) window.dispatchEvent(new Event("admin:unauthorized"));
  if (!res.ok) throw new ApiError(data?.error || "No se pudo subir la imagen", res.status);
  return data.url;
}
