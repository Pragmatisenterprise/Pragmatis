import { ImagePlus, X } from "lucide-react";
import { useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { errorMessage, uploadImage } from "./api";

export const inputCls =
  "w-full rounded-xl border border-tinta/15 bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-tinta/30 focus:border-paramo";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-tinta/50">{hint}</span>}
    </label>
  );
}

export const TextInput = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cn(inputCls, p.className)} />;
export const TextArea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cn(inputCls, p.className)} />;

export function Check({ label, ...p }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" {...p} className="size-4 accent-paramo" />
      {label}
    </label>
  );
}

export const Badge = ({ on, yes, no }: { on: boolean; yes: string; no: string }) => (
  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", on ? "bg-maiz-suave text-paramo-hondo" : "bg-arena text-tinta/60")}>
    {on ? yes : no}
  </span>
);

export const PageTitle = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
    {children}
  </div>
);

export const ErrorBox = ({ message }: { message: string }) =>
  message ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-error">{message}</p> : null;

// Subir a R2 o pegar una URL. `value` vacío = sin imagen.
export function ImageUpload({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative shrink-0">
            <img src={value} alt="" className="h-16 w-24 rounded-lg bg-arena object-cover" />
            <button type="button" onClick={() => onChange("")} className="absolute -right-2 -top-2 rounded-full bg-tinta p-0.5 text-white" aria-label="Quitar imagen"><X size={12} /></button>
          </div>
        ) : (
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-arena text-tinta/30"><ImagePlus size={20} /></div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <label className={cn("btn cursor-pointer bg-arena px-3 py-2", busy && "pointer-events-none opacity-60")}>
            {busy ? "Subiendo…" : "Subir imagen"}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" onChange={pick} />
          </label>
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…o pega una URL https://" aria-label={`${label} (URL)`} className={cn(inputCls, "py-2")} />
        </div>
      </div>
      {hint && <span className="mt-1 block text-xs text-tinta/50">{hint}</span>}
      {error && <span role="alert" className="mt-1 block text-xs text-error">{error}</span>}
    </div>
  );
}
