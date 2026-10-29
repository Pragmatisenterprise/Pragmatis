import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/config/site";

// Botón flotante de WhatsApp. No aparece mientras `site.whatsapp` esté vacío.
export function WhatsAppButton() {
  const href = whatsappUrl("¡Hola! Quiero saber más sobre Pragmatis.");
  if (!href) return null;
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-paramo px-4 py-3 text-sm font-medium text-white shadow-xl transition-colors hover:bg-paramo-hondo"
    >
      <MessageCircle size={20} /><span className="hidden sm:inline">Escríbenos</span>
    </a>
  );
}
