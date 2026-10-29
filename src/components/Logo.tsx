import { useId } from "react";
import { site } from "@/config/site";

// Símbolo "Ascenso". Geometría y degradados: brand/03-logo-final (ver guía de marca).
const SYMBOL = "M8 57H27V43H41V29H55V6H45V19H31V33H17V47H8Z";

const gradients = {
  oscuro: ["#2F7A5A", "#6CC19A", "#E3B23C"],
  claro: ["#1C5A43", "#3C8C68", "#A87B12"],
} as const;

type Variant = keyof typeof gradients | "mono";

export function LogoSymbol({ variant = "oscuro", className = "" }: { variant?: Variant; className?: string }) {
  const id = useId();
  const stops = variant === "mono" ? null : gradients[variant];
  return (
    <svg viewBox="8 6 47 51" className={className} aria-hidden>
      {stops && (
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="8" y1="57" x2="55" y2="6">
            <stop offset="0" stopColor={stops[0]} />
            <stop offset=".55" stopColor={stops[1]} />
            <stop offset="1" stopColor={stops[2]} />
          </linearGradient>
        </defs>
      )}
      <path d={SYMBOL} fill={stops ? `url(#${id})` : "currentColor"} />
    </svg>
  );
}

// Lockup: el símbolo mide 1.4 × la altura de mayúscula (≈0.98em) y se separa 0.32em del nombre.
export function Logo({ variant = "oscuro", className = "" }: { variant?: Variant; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.32em] font-display text-[1.375rem] font-semibold leading-none tracking-[-0.02em] ${className}`}>
      <LogoSymbol variant={variant} className="h-[0.98em] w-auto shrink-0" />
      {site.name}
    </span>
  );
}
