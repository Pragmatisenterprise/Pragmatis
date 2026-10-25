export async function postJson(path: string, data: Record<string, string>): Promise<void> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "" }));
    throw new Error(error || "Error de red");
  }
}
