import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { Logo } from "@/components/Logo";
import { errorMessage } from "./api";
import { ErrorBox, TextInput } from "./ui";

export function Login({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password"));
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/login", { method: "POST", body: { password } });
      onLogin();
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-black px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 text-white">
        <Logo />
        <h1 className="text-xl font-semibold">Panel de administración</h1>
        <label className="block text-sm">
          <span className="mb-1.5 block text-white/70">Contraseña</span>
          <TextInput name="password" type="password" required autoFocus autoComplete="current-password" className="border-white/10 bg-white/5 text-white focus:border-paramo-luz" />
        </label>
        <ErrorBox message={error} />
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</button>
      </form>
    </main>
  );
}
