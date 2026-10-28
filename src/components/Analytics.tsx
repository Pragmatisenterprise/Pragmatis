import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Registra cada página vista sin cookies ni identificadores persistentes.
export function Analytics() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    // El referrer externo solo aplica a la primera página de la visita.
    const body = JSON.stringify({ path: pathname, referrer: first.current ? document.referrer : "" });
    first.current = false;
    const sent = navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }));
    if (!sent) fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
