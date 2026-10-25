import { site } from "@/config/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xl font-semibold tracking-tight ${className}`}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
        <rect x="0" y="0" width="9" height="9" fill="currentColor" />
        <rect x="11" y="0" width="9" height="9" fill="currentColor" opacity=".45" />
        <rect x="11" y="11" width="9" height="9" fill="currentColor" />
      </svg>
      {site.name}
    </span>
  );
}
