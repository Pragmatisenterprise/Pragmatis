import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

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
