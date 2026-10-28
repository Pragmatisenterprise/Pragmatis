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
